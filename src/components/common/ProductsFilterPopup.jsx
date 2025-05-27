import React, { useState } from 'react'
import FilterMenu from './MenuFilter';
import { PrimaryImage } from './PrimaryImage';
export const ProductsFilterPopup = ({ selectedCategory, subCategories, onFilterChange, selectedFilters, type = 'popup', hidden = false }) => {
    const [isActive, setIsActive] = useState(false);
    const filterIcon = isActive ? "https://static.wixstatic.com/shapes/0e0ac5_afdc5e19d5f849fa973b191220040065.svg" : "https://static.wixstatic.com/shapes/0e0ac5_4aae04aee0b3485b8d8e621d030eecbe.svg";
    if (hidden) return;
    return (
        <div className={`z-10 absolute right-6 ${type !== "subCategory" ? 'lg:hidden' : 'top-0'}`}>
            <div onClick={() => setIsActive(!isActive)} className={`cursor-pointer absolute right-full top-0 flex z-20 justify-center items-center w-[55px] h-[55px] border border-secondary-alt rounded-[50px] transition-all duration-300 ${type === "subCategory" && isActive ? 'border-transparent hover:border-secondary-alt' : ''}`}>
                <PrimaryImage url={filterIcon} alt={"cat-tab"} />
            </div>
            {isActive && (
                <div className={`absolute max-w-[330px] rounded-[30px] shadow-lg ${type !== "subCategory" ? 'bg-white min-w-[330px] -top-4 -right-4 py-10 pt-16 px-5' : 'bg-primary min-w-[250px] top-0 right-0 py-10 px-10'}`}>
                    <FilterMenu
                        type={type}
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