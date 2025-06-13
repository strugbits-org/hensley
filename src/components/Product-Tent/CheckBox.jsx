import { useState } from "react";

export const CheckBox = ({
    data,
    classes = "",
    type = "checkbox",
    value = null,
    onChange = null
}) => {
    const { label, options } = data;

    const [internalState, setInternalState] = useState(
        type === "checkbox"
            ? options.map(() => false)
            : null
    );

    const checkedStates = value !== null ? value : internalState;

    const handleChange = (option) => {
        let newState;

        if (type === "checkbox") {
            newState = [...checkedStates];
            newState[option] = !newState[option];
        } else {
            newState = option;
        }

        if (value === null) {
            setInternalState(newState);
        }

        if (onChange) {
            onChange(newState, option, options[option]);
        }
    };

    const isChecked = (option) => {        
        if (type === "checkbox") {
            return Array.isArray(checkedStates) ? checkedStates[option] : false;
        } else {
            return checkedStates === option;
        }
    };

    return (
        <div className={classes}>
            <span className="lg:text-[16px] mb-[25px] font-haasBold sm:text-[14px] text-[#2B2218] uppercase select-none block">
                {label}
            </span>
            {options.map((option, index) => (
                <label key={index} className="flex items-center cursor-pointer mb-[10px]">
                    <input
                        type={type}
                        name={type === "radio" ? `radio-${label}` : undefined}
                        className="sr-only"
                        onChange={() => handleChange(option)}
                        checked={isChecked(option)}
                    />
                    <div className="relative w-4 h-4 border-[1.5px] border-secondary-alt bg-transparent">
                        {isChecked(option) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-secondary-alt"></div>
                            </div>
                        )}
                    </div>
                    <span className="lg:text-[16px] leading-[19px] font-haasLight sm:text-[14px] ml-[8px] text-[#2B2218] uppercase select-none">
                        {option}
                    </span>
                </label>
            ))}
        </div>
    );
};