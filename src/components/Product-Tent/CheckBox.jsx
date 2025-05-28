import React, { useState } from 'react';

const CheckBox = ({ data, classes }) => {
    const { label, options } = data;

    // Initialize state: array of false values, one for each option
    const [checkedStates, setCheckedStates] = useState(
        options.map(() => false)
    );

    const handleCheckboxChange = (index) => {
        const updatedStates = [...checkedStates];
        updatedStates[index] = !updatedStates[index]; // toggle the checkbox
        setCheckedStates(updatedStates);
    };

    return (
        <div className={classes}>
            <span className="lg:text-[16px] mb-[25px] font-haasBold sm:text-[14px] text-[#2B2218] uppercase select-none block">
                {label}
            </span>
            {options.map((dt, index) => (
                <label key={index} className="flex items-center cursor-pointer mb-[10px]">
                    <input
                        type="checkbox"
                        className="peer hidden"
                        onChange={() => handleCheckboxChange(index)}
                        checked={checkedStates[index]}
                    />
                    <div className="relative w-4 h-4 border-[1.5px] border-secondary-alt bg-transparent">
                        {checkedStates[index] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-secondary-alt"></div>
                            </div>
                        )}
                    </div>
                    <span className="lg:text-[16px] leading-[19px] font-haasLight sm:text-[14px] ml-[8px] text-[#2B2218] uppercase select-none">
                        {dt}
                    </span>
                </label>
            ))}
        </div>
    );
};

export default CheckBox;
