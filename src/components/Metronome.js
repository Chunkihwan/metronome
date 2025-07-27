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

    const handleStart = () => {
        if (isPlaying) return;

        setIsPlaying(true);
        setCurrentBeat(1);

        // Wake Lock 요청
        requestWakeLock();

        // Web Audio API 초기화
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        // 첫 번째 박자 즉시 재생
        playBeat(1);

        // 다음 박자부터 간격에 맞춰 재생
        intervalRef.current = setInterval(() => {
            setCurrentBeat((prev) => {
                const nextBeat = prev >= timeSignature.beats ? 1 : prev + 1;
                playBeat(nextBeat);
                return nextBeat;
            });
        }, interval);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentBeat(1);

        // Wake Lock 해제
        releaseWakeLock();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current = null;
        }
    };

    const playBeat = (beat) => {
        if (!audioContextRef.current) return;

        // 이전 오실레이터 정리
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
        }

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // 첫 번째 박자는 더 높은 주파수, 나머지는 낮은 주파수
        const frequency = beat === 1 ? 800 : 600;
        const volume = beat === 1 ? 0.3 : 0.2;

        oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.1);

        oscillatorRef.current = oscillator;
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
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            releaseWakeLock();
        };
    }, [isPlaying]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-sm bg-gray-900/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-800">
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Yesol&apos;s Metronome
                    </h1>
                    {/* <p className="text-xl sm:text-2xl lg:text-4xl font-semibold text-cyan-400 glow">{bpm} BPM</p> */}
                </div>

                <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
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
