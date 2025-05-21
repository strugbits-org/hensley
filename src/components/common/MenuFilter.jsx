import { useState } from 'react';

const Checkbox = ({ label, onChange, checked }) => (
    <label className="flex items-center cursor-pointer">
        <input
            type="checkbox"
            className="peer hidden"
            onChange={onChange}
            checked={checked}
        />
        <div className="relative w-5 h-5 border-[1.5px] border-secondary-alt bg-transparent">
            {checked && (
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-secondary-alt"></div>
                </div>
            )}
        </div>
        <span className="lg:text-[18px] font-haasLight sm:text-[14px] ml-[8px] text-[#2B2218] uppercase select-none">{label}</span>
    </label>
);

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <>
            <button
                className="lg:text-[18px] sm:text-[14px] sm:mt-[10px] font-haasLight uppercase text-left text-gray-800 py-1 flex items-center gap-x-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20.707 11.061"
                    className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                >
                    <path
                        d="M-13612-8763.341l10-10,10,10"
                        transform="translate(-13591.646 -8762.987) rotate(180)"
                        fill="none"
                        stroke="#2c2216"
                        strokeWidth="1"
                    />
                </svg>
                {title}
            </button>
            {isOpen && <div className="ml-6 space-y-3 mt-2">{children}</div>}
        </>
    );
};

const FilterMenu = ({ items, selectedCategory, onFilterChange, selectedFilters = [], type }) => {
    return (
        <div className="text-[#3E3E3E] font-sans w-full">
            <div className={`lg:border-t border-b w-full lg:py-[14px] border-primary-border ${type === 'popup' ? 'border-t-0 pb-2' : ''}`}>
                <h4 className="font-bold font-haasBold uppercase lg:text-[18px] sm:text-[14px]">CATEGORIES</h4>
            </div>
            <div className="flex flex-col h-full mt-3">
                <CollapsibleSection title={selectedCategory?.name}>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <Checkbox
                                key={index}
                                label={item.name}
                                onChange={() => onFilterChange(item)}
                                checked={selectedFilters.some(filter => filter._id === item._id)}
                            />
                        ))}
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default FilterMenu;