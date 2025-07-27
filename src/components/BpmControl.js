'use client';

const BpmControl = ({ bpm, onBpmChange }) => {
    const handleDecrease = () => {
        if (bpm > 40) {
            onBpmChange(bpm - 1);
        }
    };

    const handleIncrease = () => {
        if (bpm < 200) {
            onBpmChange(bpm + 1);
        }
    };

    const handleSliderChange = (e) => {
        onBpmChange(parseInt(e.target.value));
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-6">
                <button
                    onClick={handleDecrease}
                    className="flex justify-center items-center w-10 h-10 text-lg font-bold text-white bg-gradient-to-br from-gray-800 to-gray-700 rounded-full shadow-lg transition-all duration-200 sm:w-12 sm:h-12 hover:from-gray-700 hover:to-gray-600 sm:text-xl lg:text-2xl button-hover"
                    disabled={bpm <= 40}
                >
                    -
                </button>

                <div className="text-center">
                    <div className="px-1 text-[18px] font-bold text-cyan-400 glow p-.5 min-w-14">{bpm}</div>
                    <div className="text-xs font-medium text-gray-400 pt-.5">BPM</div>
                </div>

                <button
                    onClick={handleIncrease}
                    className="flex justify-center items-center w-10 h-10 text-lg font-bold text-white bg-gradient-to-br from-gray-800 to-gray-700 rounded-full shadow-lg transition-all duration-200 sm:w-12 sm:h-12 hover:from-gray-700 hover:to-gray-600 sm:text-xl lg:text-2xl button-hover"
                    disabled={bpm >= 200}
                >
                    +
                </button>
            </div>

            <div className="w-64">
                <input
                    type="range"
                    min="40"
                    max="200"
                    value={bpm}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer sm:h-3 lg:h-4 slider"
                    style={{
                        background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${
                            ((bpm - 40) / 160) * 100
                        }%, #374151 ${((bpm - 40) / 160) * 100}%, #374151 100%)`,
                    }}
                />
                <div className="flex justify-between mt-2 text-xs font-medium text-gray-400 sm:text-sm lg:text-base">
                    <span>40</span>
                    <span>120</span>
                    <span>200</span>
                </div>
            </div>
        </div>
    );
};

export default BpmControl;
