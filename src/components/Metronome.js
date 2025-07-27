'use client';

import { useState, useEffect, useRef } from 'react';
import BpmControl from './BpmControl';
import PlayControl from './PlayControl';
import MetronomeNeedle from './MetronomeNeedle';
import TimeSignatureSelector from './TimeSignatureSelector';

const Metronome = () => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeSignature, setTimeSignature] = useState({ beats: 1, beatType: 4 });
    const [currentBeat, setCurrentBeat] = useState(1);

    const intervalRef = useRef(null);
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const wakeLockRef = useRef(null);

    // BPM에 따른 간격 계산 (ms)
    const interval = 60000 / bpm;

    // Wake Lock 요청 함수
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake Lock 활성화됨');
            }
        } catch (err) {
            console.log('Wake Lock 요청 실패:', err);
        }
    };

    // Wake Lock 해제 함수
    const releaseWakeLock = async () => {
        try {
            if (wakeLockRef.current) {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                console.log('Wake Lock 해제됨');
            }
        } catch (err) {
            console.log('Wake Lock 해제 실패:', err);
        }
    };

    // Audio Context 초기화
    const initAudioContext = async () => {
        try {
            // 기존 Context가 닫혀있으면 새로 생성
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();

                // 사용자 상호작용이 필요한 경우 Audio Context를 재개
                if (newAudioContext.state === 'suspended') {
                    await newAudioContext.resume();
                }

                audioContextRef.current = newAudioContext;
                console.log('Audio Context 초기화됨 - 상태:', newAudioContext.state);
            }
            return audioContextRef.current;
        } catch (err) {
            console.error('Audio Context 초기화 실패:', err);
            return null;
        }
    };

    const handleStart = async () => {
        if (isPlaying) return;

        // Audio Context 초기화
        const ctx = await initAudioContext();
        if (!ctx) {
            console.error('Audio Context 초기화 실패');
            return;
        }

        setIsPlaying(true);
        setCurrentBeat(1);

        // Wake Lock 요청
        requestWakeLock();

        // 첫 번째 박자 즉시 재생
        playBeat(1);

        // 메트로놈 실행 플래그
        let isRunning = true;
        let beatCount = 1;

        const runMetronome = () => {
            if (!isRunning) return;

            beatCount++;
            const nextBeat = beatCount > timeSignature.beats ? 1 : beatCount;
            setCurrentBeat(nextBeat);
            playBeat(nextBeat);

            console.log(`박자 ${nextBeat}/${timeSignature.beats} - 간격: ${interval}ms`);

            if (beatCount > timeSignature.beats) {
                beatCount = 1;
            }

            // 다음 박자 예약
            setTimeout(runMetronome, interval);
        };

        // 첫 번째 간격 후 다음 박자 시작
        setTimeout(runMetronome, interval);

        // intervalRef에 중지 함수 저장
        intervalRef.current = () => {
            isRunning = false;
        };

        console.log(`메트로놈 시작됨 - BPM: ${bpm}, 간격: ${interval}ms`);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentBeat(1);

        // Wake Lock 해제
        releaseWakeLock();

        // 메트로놈 중지
        if (intervalRef.current) {
            intervalRef.current();
            intervalRef.current = null;
        }

        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
            } catch (err) {
                console.log('Oscillator 정리 중 오류:', err);
            }
            oscillatorRef.current = null;
        }
    };

    const playBeat = (beat) => {
        try {
            // 매번 새로운 Audio Context 생성 (브라우저 정책 때문)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // 첫 번째 박자는 더 높은 주파수, 나머지는 낮은 주파수
            const frequency = beat === 1 ? 800 : 600;
            const volume = beat === 1 ? 0.5 : 0.3;

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);

            console.log(`박자 ${beat} 재생됨 - 주파수: ${frequency}Hz, 볼륨: ${volume}`);

            // Audio Context 정리
            setTimeout(() => {
                try {
                    audioContext.close();
                } catch (err) {
                    console.log('Audio Context 정리 중 오류:', err);
                }
            }, 300);
        } catch (err) {
            console.error('소리 재생 실패:', err);
        }
    };

    // 간단한 소리 재생 함수 (대안)
    const playSimpleSound = (beat) => {
        try {
            // HTML5 Audio API 사용
            const audio = new Audio();
            audio.volume = beat === 1 ? 0.5 : 0.3;

            // 간단한 톤 생성 (Data URL 사용)
            const sampleRate = 44100;
            const duration = 0.2;
            const frequency = beat === 1 ? 800 : 600;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(beat === 1 ? 0.5 : 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);

            console.log(`간단한 소리 재생됨 - 박자 ${beat}`);
        } catch (err) {
            console.error('간단한 소리 재생 실패:', err);
        }
    };

    const handleBpmChange = (newBpm) => {
        setBpm(newBpm);

        // 재생 중이면 간격 재설정
        if (isPlaying) {
            handleStop();
            setTimeout(handleStart, 50);
        }
    };

    const handleTimeSignatureChange = (newTimeSignature) => {
        setTimeSignature(newTimeSignature);
        setCurrentBeat(1);
    };

    useEffect(() => {
        // 페이지 가시성 변경 시 Wake Lock 재요청
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (oscillatorRef.current) {
                try {
                    oscillatorRef.current.stop();
                } catch (err) {
                    console.log('Cleanup 중 oscillator 오류:', err);
                }
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                try {
                    audioContextRef.current.close();
                } catch (err) {
                    console.log('Audio Context 정리 중 오류:', err);
                }
            }
            releaseWakeLock();
        };
    }, [isPlaying]);

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black md:p-6">
            <div className="p-4 w-full max-w-sm rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-sm bg-gray-900/50 md:p-6">
                <div className="mt-2 text-center">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 sm:text-3xl">
                        Yesol&apos;s Metronome
                    </h1>
                    {/* <p className="text-xl font-semibold text-cyan-400 sm:text-2xl lg:text-4xl glow">{bpm} BPM</p> */}
                </div>

                <div className="flex justify-center mb-0">
                    <MetronomeNeedle
                        isPlaying={isPlaying}
                        bpm={bpm}
                        currentBeat={currentBeat}
                        timeSignature={timeSignature}
                    />
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <BpmControl bpm={bpm} onBpmChange={handleBpmChange} />
                    <PlayControl isPlaying={isPlaying} onStart={handleStart} onStop={handleStop} />
                    <TimeSignatureSelector
                        timeSignature={timeSignature}
                        onTimeSignatureChange={handleTimeSignatureChange}
                        onBpmChange={handleBpmChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Metronome;
