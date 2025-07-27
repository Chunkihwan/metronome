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
                className="px-4 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl transition-all duration-200 button-hover shadow-lg flex items-center space-x-2 sm:space-x-2"
            >
                <span className="text-base font-medium">박자</span>
                <span className="text-cyan-400 font-bold text-sm ">{currentLabel}</span>
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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />

                    {/* 모달 팝업 */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
                            {/* 헤더 */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h3 className="text-lg font-bold text-white">박자 선택</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium">{ts.label}</span>
                                                <span className="text-xs text-gray-400">기본 BPM: {ts.defaultBpm}</span>
                                            </div>
                                            {ts.beats === timeSignature.beats &&
                                                ts.beatType === timeSignature.beatType && (
                                                    <span className="text-cyan-400 text-lg">✓</span>
                                                )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* 푸터 */}
                            <div className="p-4 border-t border-gray-700">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
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
