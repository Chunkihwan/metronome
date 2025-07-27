'use client';

const PlayControl = ({ isPlaying, onStart, onStop }) => {
    const handleToggle = () => {
        if (isPlaying) {
            onStop();
        } else {
            onStart();
        }
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleToggle}
                className={`px-8 py-2 rounded-full text-base 
                    sm:text-lg lg:text-xl font-semibold transition-all duration-300 button-hover ${
                        isPlaying
                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                            : 'bg-gradient-to-r from-cyan-400 to-cyan-700 text-white'
                    }`}
            >
                {isPlaying ? 'STOP' : 'START'}
            </button>
        </div>
    );
};

export default PlayControl;
