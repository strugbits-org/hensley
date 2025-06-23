import { useState, useCallback } from 'react';
import { PrimaryImage } from './PrimaryImage';
import { CustomLink } from './CustomLink';

const ProductFilterCardSubCategories = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="flex justify-center items-center pb-[18px]">
      <div className={`relative lg:w-[924px] sm:w-[681px] w-[344px] bg-white py-[25px] flex flex-col justify-between items-center`}>

        {/* Header */}
        <div
          className="sm:px-[71px] px-[21px] cursor-pointer flex flex-row w-full justify-between items-center select-none"
          onClick={toggleOpen}
        >
          <h3 className="lg:text-[45px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none">
            ALL SUB-CATEGORIES
          </h3>
          <PrimaryImage
            url="https://static.wixstatic.com/shapes/0e0ac5_3bd320dac8514b3ebaa8d424375b0ac2.svg"
            customClasses={`w-[16px] h-[16px] lg:h-[24px] lg:w-[24px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="w-full top-full z-[10] bg-white">
            <ul className="sm:px-[71px] px-[21px] grid grid-cols-2 gap-y-4 gap-x-4 w-full list-none py-[23px]">
              {data.map((category, index) => {
                return (
                  <li className={`cursor-pointer px-4 py-2`} key={`${index}`}>
                    <CustomLink to={`/subcategory/${category.slug}`}
                      className="text-[18px] lg:text-[20px] text-secondary-alt uppercase font-recklessRegular hover:opacity-70 transition-opacity"
                    >
                      {category.name}
                    </CustomLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilterCardSubCategories;