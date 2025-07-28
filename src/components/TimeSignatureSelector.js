'use client';

import { useState } from 'react';

const TimeSignatureSelector = ({ timeSignature, onTimeSignatureChange, onBpmChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const timeSignatures = [
        { beats: 1, beatType: 4, label: '1/4', defaultBpm: 120 },
        { beats: 2, beatType: 4, label: '2/4', defaultBpm: 120 },
        { beats: 3, beatType: 4, label: '3/4', defaultBpm: 90 },
        { beats: 4, beatType: 4, label: '4/4', defaultBpm: 120 },
        { beats: 6, beatType: 8, label: '6/8', defaultBpm: 80 },
        { beats: 3, beatType: 8, label: '3/8', defaultBpm: 140 },
        { beats: 5, beatType: 4, label: '5/4', defaultBpm: 100 },
    ];

    const handleSelect = (selected) => {
        onTimeSignatureChange(selected);

        // 박자에 맞는 기본 BPM으로 변경
        const selectedSignature = timeSignatures.find(
            (ts) => ts.beats === selected.beats && ts.beatType === selected.beatType
        );

        if (selectedSignature && selectedSignature.defaultBpm) {
            onBpmChange(selectedSignature.defaultBpm);
        }

        setIsOpen(false);
    };

    const currentLabel =
        timeSignatures.find((ts) => ts.beats === timeSignature.beats && ts.beatType === timeSignature.beatType)
            ?.label || `${timeSignature.beats}/${timeSignature.beatType}`;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-1.5 space-x-2 text-white bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg transition-all duration-200 hover:from-gray-700 hover:to-gray-600 button-hover sm:space-x-2"
            >
                <span className="text-base font-medium">박자</span>
                <span className="text-sm font-bold text-cyan-400">{currentLabel}</span>
                {/* <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg> */}
            </button>

            {isOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50" onClick={() => setIsOpen(false)} />

                    {/* 모달 팝업 */}
                    <div className="flex fixed inset-0 z-50 justify-center items-center p-4">
                        <div className="w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm bg-gray-900/95">
                            {/* 헤더 */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                                <h3 className="text-lg font-bold text-white">박자 선택</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex justify-center items-center w-8 h-8 text-white bg-gray-800 rounded-full transition-colors hover:bg-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* 박자 목록 */}
                            <div className="p-2">
                                {timeSignatures.map((ts) => (
                                    <button
                                        key={ts.label}
                                        onClick={() => handleSelect(ts)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-200 rounded-xl mb-2 ${
                                            ts.beats === timeSignature.beats && ts.beatType === timeSignature.beatType
                                                ? 'bg-cyan-600/20 text-cyan-400 font-bold'
                                                : 'text-white hover:text-cyan-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium">{ts.label}</span>
                                                <span className="text-xs text-gray-400">기본 BPM: {ts.defaultBpm}</span>
                                            </div>
                                            {ts.beats === timeSignature.beats &&
                                                ts.beatType === timeSignature.beatType && (
                                                    <span className="text-lg text-cyan-400">✓</span>
                                                )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* 푸터 */}
                            <div className="p-4 border-t border-gray-700">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="py-2 w-full text-white bg-gray-800 rounded-lg transition-colors hover:bg-gray-700"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimeSignatureSelector;
