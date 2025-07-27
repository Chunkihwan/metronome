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
        <div className="flex relative justify-center items-center w-80 h-64">
            {/* 반원형 게이지 */}
            <div className="absolute w-80 h-40 rounded-t-full border-t-4 border-gray-600 opacity-40"></div>

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
                className="absolute w-2 h-28 bg-gradient-to-t from-cyan-400 to-cyan-300 transition-transform duration-75 ease-out origin-bottom sm:h-32 lg:h-36 xl:h-40 glow"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
                }}
            >
                {/* 바늘 끝점 */}
                <div className="absolute -left-2 -top-3 w-6 h-6 bg-cyan-400 rounded-full glow"></div>
            </div>

            {/* 중앙 점 */}
            {/* <div className="absolute w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full glow"></div> */}

            {/* 박자 표시 */}
            {/* <div className="absolute -bottom-16 text-center sm:-bottom-20 lg:-bottom-24">
                <div className="text-xs font-medium text-gray-300 sm:text-sm lg:text-base">
                    Beat {currentBeat} of {timeSignature.beats}
                </div>
                {currentBeat === 1 && <div className="mt-1 text-xs font-bold text-cyan-400 glow">STRONG BEAT</div>}
            </div> */}

            {/* BPM 표시 */}
            {/* <div className="absolute top-2 text-center">
                <div className="p-1 px-2 text-sm font-bold text-cyan-400 sm:text-base lg:text-lg glow">{bpm} BPM</div>
            </div> */}
        </div>
    );
};

export default MetronomeNeedle;
