import arrow from '@/assets/icons/arrow-down.svg'
import { useState } from 'react';

const Checkbox = ({ label }) => (
    <label className="flex items-center cursor-pointer">
        <input type="checkbox" className="peer hidden" />
        <div className="w-4 h-4 border-[1.5px] border-black lg:bg-primary-alt sm:bg-white peer-checked:bg-black peer-checked:p-[2px]">
            <div className="w-full h-full" />
        </div>
        <span className="lg:text-[18px] font-haasLight sm:text-[14px] ml-[8px] text-[#2B2218] uppercase">{label}</span>
    </label>
);


const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <>
            <button
                className="lg:text-[18px] sm:text-[14px] sm:mt-[10px] font-haasLight uppercase text-left text-gray-800 py-1 flex items-center gap-x-[8px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="10"
                    viewBox="0 0 20.707 11.061"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
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
            {isOpen && <div className="ml-4 space-y-1">{children}</div>}
        </>
    );
};

const renderFilters = (items) =>
    items.map((item, index) => {
        if (item.children) {
            return (
                <CollapsibleSection key={index} title={item.title || item.label}>
                    {renderFilters(item.children)}
                </CollapsibleSection>
            );
        }
        return <Checkbox key={index} label={item.label} />;
    });

const FilterMenu = ({ items }) => {
    return (
        <div className="text-[#3E3E3E] font-sans w-full ">
            <div className="lg:border-t border-b w-full lg:py-[14px]">
                <h4 className="font-bold font-haasBold uppercase lg:text-[18px] sm:text[14px]">Products</h4>
            </div>
            <div className="flex flex-col h-full">
                {renderFilters(items)}
            </div>
        </div>
    );
};

export default FilterMenu