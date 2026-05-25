import { useState } from "react";

const getOptionLabel = (option) => (typeof option === 'object' ? option.label : option);
const getOptionValue = (option) => (typeof option === 'object' ? option.value : option);

export const CheckBox = ({
    data,
    classes = "",
    type = "checkbox",
    value = null,
    onChange = null,
    required = false,
    error = ""
}) => {
    const { label, options } = data;

    const [internalState, setInternalState] = useState(
        type === "checkbox"
            ? options.map(() => false)
            : null
    );

    const checkedStates = value !== null ? value : internalState;

    const handleChange = (optionValue) => {
        let newState;

        if (type === "checkbox") {
            const idx = options.findIndex((o) => getOptionValue(o) === optionValue);
            newState = [...(Array.isArray(checkedStates) ? checkedStates : options.map(() => false))];
            newState[idx] = !newState[idx];
        } else {
            newState = optionValue;
        }

        if (value === null) {
            setInternalState(newState);
        }

        if (onChange) {
            onChange(newState);
        }
    };

    const isChecked = (option) => {
        const optionValue = getOptionValue(option);
        if (type === "checkbox") {
            const idx = options.findIndex((o) => getOptionValue(o) === optionValue);
            return Array.isArray(checkedStates) ? checkedStates[idx] : false;
        } else {
            return checkedStates === optionValue;
        }
    };

    return (
        <div className={`relative ${classes}`}>
            <span className="lg:text-[16px] 3xl:text-[26px] mb-[25px] 3xl:mb-[40px] font-haasBold sm:text-[14px] text-[#2B2218] uppercase select-none block">
                {label}{required ? '*' : ''}
            </span>
            {options.map((option, index) => (
                <label key={index} className="flex items-center cursor-pointer mb-[10px] 3xl:mb-[18px]">
                    <input
                        type={type}
                        name={type === "radio" ? `radio-${label}` : undefined}
                        className="sr-only"
                        onChange={() => handleChange(getOptionValue(option))}
                        checked={isChecked(option)}
                    />
                    <div className="relative w-4 h-4 3xl:w-7 3xl:h-7 border-[1.5px] 3xl:border-2 border-secondary-alt bg-transparent flex-shrink-0">
                        {isChecked(option) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 3xl:w-3.5 3xl:h-3.5 bg-secondary-alt"></div>
                            </div>
                        )}
                    </div>
                    <span className="lg:text-[16px] 3xl:text-[26px] leading-[19px] 3xl:leading-[30px] font-haasLight sm:text-[14px] ml-[8px] 3xl:ml-[16px] text-[#2B2218] uppercase select-none">
                        {getOptionLabel(option)}
                    </span>
                </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};