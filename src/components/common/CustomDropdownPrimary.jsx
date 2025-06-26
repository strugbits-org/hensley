import React, { useCallback, useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

export const CustomDropdownPrimary = ({ products, onSelect, placeholder = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(placeholder);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
        if (!isOpen) setIsOpen(true);
    }, [isOpen]);

    const handleOptionSelect = useCallback((option) => {
        setSelected(option.label);
        setSearchQuery('');
        setIsOpen(false);
        onSelect?.(option);
    }, [onSelect]);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = products.filter((item) => item.label?.toLowerCase().includes(q));
        setFilteredProducts(filtered);
    }, [products, searchQuery]);

    const dropDownRef = useDetectClickOutside({ onTriggered: () => { if (isOpen) setIsOpen(false); } });

    return (
        <div ref={dropDownRef} className={`relative w-[460px] ${isOpen ? 'z-[9999]' : 'z-[999]'}`}>
            <div
                className="h-[60px] px-5 border-b border-secondary-alt bg-white flex items-center justify-between cursor-pointer"
                onClick={toggleDropdown}
            >
                <input
                    type="text"
                    placeholder={selected}
                    className="w-full px-3 py-2 outline-none border-none text-base uppercase placeholder:text-secondary-alt font-haasLight cursor-pointer placeholder:text-center"
                    value={searchQuery}
                    onChange={handleSearchChange}
                // onClick={(e) => e.stopPropagation()}
                />
                <svg className={`w-4 h-4 ml-2 ${isOpen ? 'rotate-180' : ''} transition-transform duration-300`} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5H7z" />
                </svg>
            </div>

            {isOpen && (
                <div className="bg-white w-full shadow-md z-[999] max-h-[200px] overflow-y-auto">
                    <ul role="listbox">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((item, index) => (
                                <li
                                    key={(item._id || item.label) + index}
                                    className="px-5 text-left py-3 transition-all duration-300 hover:bg-[#F0DEA2] cursor-pointer uppercase font-haasLight"
                                    onClick={() => handleOptionSelect(item)}
                                    role="option"
                                >
                                    {item.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-5 py-3 text-sm text-secondary-altas uppercase font-haasRegular">No matching results</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};