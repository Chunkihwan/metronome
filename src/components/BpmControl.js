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
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 ">
            <div className="flex items-center space-x-4 sm:space-x-6 ">
                <button
                    onClick={handleDecrease}
                    className="w-10 h-10 sm:w-12 sm:h-12  bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-200 button-hover shadow-lg"
                    disabled={bpm <= 40}
                >
                    -
                </button>

                <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400 glow p-.5 px-1 min-w-14">{bpm}</div>
                    {/* <div className="text-xs sm:text-sm lg:text-base text-gray-400 font-medium">BPM</div> */}
                </div>

                <button
                    onClick={handleIncrease}
                    className="w-10 h-10 sm:w-12 sm:h-12  bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-200 button-hover shadow-lg"
                    disabled={bpm >= 200}
                >
                    +
                </button>
            </div>

            <div className="w-48 sm:w-64 ">
                <input
                    type="range"
                    min="40"
                    max="200"
                    value={bpm}
                    onChange={handleSliderChange}
                    className="w-full h-2 sm:h-3 lg:h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${
                            ((bpm - 40) / 160) * 100
                        }%, #374151 ${((bpm - 40) / 160) * 100}%, #374151 100%)`,
                    }}
                />
                <div className="flex justify-between text-xs sm:text-sm lg:text-base text-gray-400 mt-2 font-medium">
                    <span>40</span>
                    <span>120</span>
                    <span>200</span>
                </div>
            </div>
        </div>
    );
};

export default BpmControl;
