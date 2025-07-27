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
    const lastBeatTimeRef = useRef(0);

    // Wake Lock 요청 함수 (개선된 버전)
    const requestWakeLock = async () => {
        try {
            // Wake Lock API가 지원되는 경우
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake Lock 활성화됨');

                wakeLockRef.current.addEventListener('release', () => {
                    console.log('Wake Lock 해제됨');
                });
            } else {
                // 대안: 비디오 요소를 사용한 화면 켜짐 유지
                const video = document.createElement('video');
                video.muted = true;
                video.loop = true;
                video.autoplay = true;
                video.style.display = 'none';
                video.src = 'data:video/mp4;base64,AAAAHGZ0eXBNUDQyAAAAAAAAAAEAAAAAAAAAAAAAAAAAAA==';
                document.body.appendChild(video);
                video.play();
                console.log('비디오 기반 화면 켜짐 유지 활성화됨');
            }
        } catch (err) {
            console.log('Wake Lock 요청 실패:', err);

            // 마지막 대안: 주기적으로 NoSleep 이벤트 발생
            setInterval(() => {
                if (isRunningRef.current) {
                    document.body.click();
                }
            }, 30000);
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

    // AudioContext 초기화 (재사용)
    const initAudioContext = async () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContextRef.current.state === 'suspended') {
                    await audioContextRef.current.resume();
                }
                console.log('AudioContext 초기화됨:', audioContextRef.current.state);
            } catch (err) {
                console.error('AudioContext 초기화 실패:', err);
                return null;
            }
        }
        return audioContextRef.current;
    };

    const handleStart = async () => {
        if (isPlaying) return;

        // AudioContext 초기화
        await initAudioContext();

        beatCountRef.current = 1;
        setCurrentBeat(1);
        setIsPlaying(true);
        isRunningRef.current = true;
        lastBeatTimeRef.current = Date.now();

        requestWakeLock();
    };

    const handleStop = () => {
        setIsPlaying(false);
        isRunningRef.current = false;
        beatCountRef.current = 1;
        setCurrentBeat(1);
        releaseWakeLock();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // 메트로놈 실행 useEffect (정확한 타이밍)
    useEffect(() => {
        if (!isPlaying) return;

        const interval = 60000 / bpm;
        isRunningRef.current = true;

        const runMetronome = () => {
            if (!isRunningRef.current) return;

            const now = Date.now();
            const timeSinceLastBeat = now - lastBeatTimeRef.current;

            // 정확한 타이밍으로 박자 재생
            if (timeSinceLastBeat >= interval - 10) {
                // 10ms 허용 오차
                let nextBeat = beatCountRef.current + 1;
                if (nextBeat > timeSignature.beats) nextBeat = 1;

                beatCountRef.current = nextBeat;
                setCurrentBeat(nextBeat);
                playBeat(nextBeat);
                lastBeatTimeRef.current = now;
                console.log(`박자 ${nextBeat}/${timeSignature.beats} 재생됨`);
            }
        };

        // 첫 번째 박자 즉시 재생
        playBeat(1);
        console.log(`첫 번째 박자 1/${timeSignature.beats} 재생됨`);

        // 더 자주 체크 (10ms마다)
        intervalRef.current = setInterval(runMetronome, 10);

        return () => {
            isRunningRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPlaying, bpm, timeSignature]);

    const playBeat = async (beat) => {
        try {
            // AudioContext 사용 시도
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
                const oscillator = audioContextRef.current.createOscillator();
                const gainNode = audioContextRef.current.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContextRef.current.destination);

                const frequency = beat === 1 ? 800 : 600;
                const volume = beat === 1 ? 0.3 : 0.2;

                oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
                gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

                oscillator.start(audioContextRef.current.currentTime);
                oscillator.stop(audioContextRef.current.currentTime + 0.1);

                console.log(`AudioContext 소리 재생됨 - 박자: ${beat}`);
            } else {
                // 대안: HTML5 Audio 사용
                playBeepSound(beat);
            }
        } catch (err) {
            console.error('소리 재생 실패, HTML5 Audio로 대체:', err);
            playBeepSound(beat);
        }
    };

    // HTML5 Audio 대안
    const playBeepSound = (beat) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequency = beat === 1 ? 800 : 600;
            const volume = beat === 1 ? 0.3 : 0.2;

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            setTimeout(() => {
                try {
                    audioContext.close();
                } catch (err) {
                    // 무시
                }
            }, 150);

            console.log(`HTML5 Audio 소리 재생됨 - 박자: ${beat}`);
        } catch (err) {
            console.error('HTML5 Audio도 실패:', err);
        }
    };

    const handleBpmChange = (newBpm) => {
        setBpm(newBpm);
    };

    const handleTimeSignatureChange = (newTimeSignature) => {
        setTimeSignature(newTimeSignature);
        setCurrentBeat(1);
        beatCountRef.current = 1;
    };

    // 페이지 가시성 변경 시 Wake Lock 재요청
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                requestWakeLock();
                // AudioContext 재시작
                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
            }
        };

        const handlePageHide = () => {
            // 페이지가 숨겨질 때 리소스 정리하지 않음 (백그라운드 재생 유지)
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
            isRunningRef.current = false;

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // AudioContext는 정리하지 않음 (재사용을 위해)
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
                    <p className="mt-1 text-xs text-gray-400">v0.2</p>
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
