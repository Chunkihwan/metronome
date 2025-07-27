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
    const wakeLockRef = useRef(null);
    const isRunningRef = useRef(false);
    const beatCountRef = useRef(1);

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

    const handleStart = async () => {
        if (isPlaying) return;

        beatCountRef.current = 1;
        setCurrentBeat(1);
        setIsPlaying(true);
        isRunningRef.current = true;
        requestWakeLock();
    };

    const handleStop = () => {
        setIsPlaying(false);
        isRunningRef.current = false;
        beatCountRef.current = 1;
        setCurrentBeat(1);
        releaseWakeLock();

        // interval 명시적으로 정리
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // AudioContext 정리
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            try {
                audioContextRef.current.close();
            } catch (err) {
                console.log('Audio Context 정리 중 오류:', err);
            }
            audioContextRef.current = null;
        }
    };

    // 메트로놈 실행 useEffect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = 60000 / bpm;
        const startTime = Date.now();
        let beatCount = 1;

        // isRunningRef를 true로 설정
        isRunningRef.current = true;

        const runMetronome = () => {
            if (!isRunningRef.current) return;

            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const expectedBeat = Math.floor(elapsed / interval) + 1;

            if (expectedBeat > beatCount) {
                beatCount = expectedBeat;
                const nextBeat = ((beatCount - 1) % timeSignature.beats) + 1;
                setCurrentBeat(nextBeat);
                playBeat(nextBeat);
                console.log(`박자 ${nextBeat}/${timeSignature.beats} 재생됨`);
            }

            // 다음 프레임 요청
            requestAnimationFrame(runMetronome);
        };

        // 첫 번째 박자 즉시 재생
        playBeat(1);
        console.log(`첫 번째 박자 1/${timeSignature.beats} 재생됨`);

        // 애니메이션 프레임 시작
        requestAnimationFrame(runMetronome);

        return () => {
            isRunningRef.current = false;
        };
    }, [isPlaying, bpm, timeSignature]);

    const playBeat = (beat) => {
        try {
            // 매번 새로운 Audio Context 생성
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequency = beat === 1 ? 800 : 600;
            const volume = beat === 1 ? 0.6 : 0.5;

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.25);

            console.log(`소리 재생됨 - 박자: ${beat}, 주파수: ${frequency}Hz, 볼륨: ${volume}`);

            // Audio Context 정리
            setTimeout(() => {
                try {
                    audioContext.close();
                } catch (err) {
                    // 무시
                }
            }, 300);
        } catch (err) {
            console.error('소리 재생 실패:', err);
        }
    };

    const handleBpmChange = (newBpm) => {
        setBpm(newBpm);
        // useEffect가 bpm을 의존성으로 가지고 있으므로 자동으로 재설정됨
    };

    const handleTimeSignatureChange = (newTimeSignature) => {
        setTimeSignature(newTimeSignature);
        setCurrentBeat(1);
        beatCountRef.current = 1;
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            isRunningRef.current = false;

            // 모든 리소스 정리
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                try {
                    audioContextRef.current.close();
                } catch (err) {
                    console.log('Audio Context 정리 중 오류:', err);
                }
                audioContextRef.current = null;
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
                </div>

                <div className="flex justify-center mb-0">
                    <MetronomeNeedle
                        isPlaying={isPlaying}
                        bpm={bpm}
                        currentBeat={currentBeat}
                        timeSignature={timeSignature}
                    />
                </div>

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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
