import React, { useState } from 'react'
import FilterMenu from './MenuFilter';
import { PrimaryImage } from './PrimaryImage';
export const ProductsFilterPopup = ({ selectedCategory, subCategories, onFilterChange, selectedFilters }) => {
    const [isActive, setIsActive] = useState(false);
    const filterIcon = isActive ? "https://static.wixstatic.com/shapes/0e0ac5_afdc5e19d5f849fa973b191220040065.svg" : "https://static.wixstatic.com/shapes/0e0ac5_4aae04aee0b3485b8d8e621d030eecbe.svg";
    return (
        <div className={`lg:hidden z-10 absolute right-6`}>
            <div onClick={() => setIsActive(!isActive)} className={`absolute right-full top-0 flex z-20 justify-center items-center w-[55px] h-[55px] border border-secondary-alt rounded-[50px]`}>
                <PrimaryImage url={filterIcon} alt={"cat-tab"} />
            </div>
            {isActive && (
                <div className='bg-white absolute -top-4 -right-4 min-h-[300px] w-[330px] rounded-[30px] shadow-lg px-[20px] py-[40px] pt-16'>
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