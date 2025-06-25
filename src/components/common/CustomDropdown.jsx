import React, { useCallback, useState } from 'react'

export const CustomDropdown = ({ products }) => {
    // console.log("products", products);

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Select Any Product');

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleOptionSelect = useCallback((option) => {
        setSelected(option);
        setIsOpen(false);
    }, []);

    return (
        <div className="relative w-[460px] z-[9999]">
            <div
                className="h-[60px] px-5 border-b border-black bg-white cursor-pointer flex items-center justify-between"
                onClick={toggleDropdown}
            >
                <span className="uppercase font-haasLight">{selected}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5H7z" />
                </svg>
            </div>
            {isOpen && (
                <ul className="bg-white w-full shadow-md z-[99999] max-h-[400px] overflow-y-scroll" role="listbox">
                    {products.map(({ product }) => {
                        const name = product.name;
                        return (
                            <li
                                key={product}
                                className="px-5 text-left py-3 transform transition-all duration-300 hover:bg-[#F0DEA2] cursor-pointer uppercase font-haasLight"
                                onClick={() => handleOptionSelect(product)}
                                role="option"
                            >
                                {name}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
};