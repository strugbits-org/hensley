import React, { useState } from 'react'
import catTab from '@/assets/icons/cat-tab.svg'
import Image from 'next/image';
import FilterMenu from './MenuFilter';
export const ProductsFilterPopup = ({ selectedCategory, subCategories, onFilterChange, selectedFilters }) => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className={`lg:hidden z-10 absolute right-6 top-1/2 translate-y-[-50%]`}>
            <div className={`absolute right-full top-0 flex z-20 justify-center items-center w-[55px] h-[55px] border border-secondary-alt rounded-[50px]`}>
                <Image
                    src={catTab}
                    onClick={() => setIsActive(!isActive)}
                    alt='cat-tab'
                />
            </div>
            {isActive && (
                <div className='bg-white absolute -top-4 -right-4 min-h-[300px] w-[330px] rounded-[30px] shadow-lg px-[20px] py-[40px] pt-24'>
                    <FilterMenu
                        type='popup'
                        selectedCategory={selectedCategory}
                        items={subCategories}
                        onFilterChange={onFilterChange}
                        selectedFilters={selectedFilters}
                    />
                </div>
            )}
        </div>
    )
}