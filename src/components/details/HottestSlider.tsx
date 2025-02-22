import React from 'react';

const HorizontalSlider = () => {
    return (
        <div className="flex justify-center mt-10">
            <div className="flex justify-center w-1/2">
                <input
                    type="range"
                    min="1"
                    max="100"
                    value="50"
                    title="Slider"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0"
                />
                <div className="flex justify-center">
                    <span className="text-gray-600">1</span>
                    <span className="mx-2">|</span>
                    <span className="text-gray-600">100</span>
                </div>
            </div>
        </div>
    );
};

export default HorizontalSlider;