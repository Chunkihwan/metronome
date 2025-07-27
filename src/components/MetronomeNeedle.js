'use client';

import { useEffect, useState } from 'react';

const MetronomeNeedle = ({ isPlaying, bpm, currentBeat, timeSignature }) => {
    const [rotation, setRotation] = useState(0);

    // BPM에 따른 애니메이션 속도 계산
    const animationDuration = 60000 / bpm; // ms
    const swingAngle = 45; // 좌우 스윙 각도

    useEffect(() => {
        if (!isPlaying) {
            setRotation(0);
            return;
        }

        const animate = () => {
            setRotation((prev) => {
                // 현재 박자가 첫 번째 박자인지 확인
                const isFirstBeat = currentBeat === 1;

                // 첫 번째 박자는 더 큰 스윙, 나머지는 작은 스윙
                const maxAngle = isFirstBeat ? swingAngle : swingAngle * 0.7;

                // 사인파를 이용한 자연스러운 스윙 애니메이션
                const time = Date.now() / animationDuration;
                const swing = Math.sin(time * Math.PI) * maxAngle;

                return swing;
            });
        };

        const interval = setInterval(animate, 16); // 60fps

        return () => clearInterval(interval);
    }, [isPlaying, bpm, currentBeat, animationDuration, swingAngle]);

    return (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] flex items-center justify-center">
            {/* 반원형 게이지 */}
            <div className="absolute w-64 h-32 sm:w-80 sm:h-40 lg:w-96 lg:h-48 xl:w-[28rem] xl:h-56 border-t-4 border-gray-600 rounded-t-full opacity-40"></div>

            {/* 게이지 눈금들 */}
            {[...Array(9)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-3 bg-gray-500 origin-bottom"
                    style={{
                        transform: `rotate(${i * 22.5 - 90}deg) translateY(-32px sm:-40px lg:-48px xl:-56px)`,
                        left: '50%',
                        marginLeft: '-2px',
                    }}
                />
            ))}

            {/* 바늘 */}
            <div
                className="absolute w-2 h-28 sm:h-32 lg:h-36 xl:h-40 bg-gradient-to-t from-cyan-400 to-cyan-300 origin-bottom transition-transform duration-75 ease-out glow"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
                }}
            >
                {/* 바늘 끝점 */}
                <div className="absolute -top-3 -left-2 w-6 h-6 bg-cyan-400 rounded-full glow"></div>
            </div>

            {/* 중앙 점 */}
            {/* <div className="absolute w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full glow"></div> */}

            {/* 박자 표시 */}
            {/* <div className="absolute -bottom-16 sm:-bottom-20 lg:-bottom-24 text-center">
                <div className="text-xs sm:text-sm lg:text-base text-gray-300 font-medium">
                    Beat {currentBeat} of {timeSignature.beats}
                </div>
                {currentBeat === 1 && <div className="text-xs text-cyan-400 font-bold mt-1 glow">STRONG BEAT</div>}
            </div> */}

            {/* BPM 표시 */}
            <div className="absolute top-2 text-center">
                <div className="text-sm sm:text-base lg:text-lg text-cyan-400 font-bold glow p-1 px-2">{bpm} BPM</div>
            </div>
        </div>
    );
};

export default MetronomeNeedle;
