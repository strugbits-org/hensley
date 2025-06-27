'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Listing from './Listing';

const InputField = ({ id, label, placeholder, classes, borderColor = 'black', type = "text", onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleChange = useCallback((e) => {
        onChange?.(e.target.value);
    }, [onChange]);

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm
                    border-b 
                    border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}
                    hover:border-b-2
                    outline-none transition-all duration-300
                `}
            />
        </div>
    );
};

const Categories = React.memo(({ data, setActiveCategory }) => {
    const { name } = data.collections;
    return (
        <button
            onClick={setActiveCategory}
            className='text-[24px] bg-white px-[15px] py-[10px] rounded text-secondary-alt uppercase font-haasRegular text-left'
        >
            {name}
        </button>
    )
});

const ProductSorting = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return data;
        return data.filter(({ collections }) =>
            collections.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    Product Sorting
                </h2>
            </div>
            <div className='px-[50px] sm:py-[20px] flex flex-col gap-y-[15px] max-lg:mt-3 '>
                <div className='w-full mx-auto'>
                    {activeCategory && (
                        <Listing data={activeCategory} CategoriesData={data} backToCategories={() => {setActiveCategory(null); setSearchTerm('')}} />
                    )}
                    {!activeCategory && (
                        <div className='w-full flex flex-col gap-y-[15px]'>
                            <div className='flex justify-between w-full flex-wrap'>
                                <span className='text-[30px] block text-secondary-alt uppercase font-haasBold'>
                                    categories
                                </span>
                                <InputField
                                    id="search"
                                    placeholder="SEARCH CATEGORIES"
                                    borderColor="secondary-alt"
                                    classes={'w-full lg:w-[350px]'}
                                    onChange={handleSearch}
                                />
                            </div>

                            <div className='w-full grid grid0cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]'>
                                {filteredCategories.map((category) => (
                                    <Categories key={category._id} data={category} setActiveCategory={() => setActiveCategory(category)} />
                                ))}
                                {filteredCategories.length === 0 && <p className='text-secondary-alt text-[20px] font-haasRegular uppercase col-span-3 mx-auto my-20'>No categories found</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSorting;