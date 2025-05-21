import { useState } from 'react';
import { CustomLink } from './CustomLink';
import { PrimaryImage } from './PrimaryImage';

const FilterCardSubCategories = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='flex justify-center items-center pb-[18px]'>
        <div className='lg:w-[924px] sm:w-[681px] w-[344px] bg-white py-[25px] sm:px-[71px] px-[21px] flex flex-col justify-between items-center'>
          <div className='cursor-pointer flex flex-row w-full justify-between items-center select-none' onClick={() => setIsOpen(!isOpen)}>
            <h3 className='lg:text-[45px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none'>ALL SUB-CATEGORIES</h3>
            <PrimaryImage url={"https://static.wixstatic.com/shapes/0e0ac5_3bd320dac8514b3ebaa8d424375b0ac2.svg"} customClasses={"w-[16px] h-[16px] lg:h-[24px] lg:w-[24px]"} />
          </div>
          {isOpen && (
            <ul className="grid grid-cols-2 gap-y-4 gap-x-4 w-full list-none py-[23px]">
              {data.map((item, index) => (
                <li key={index}>
                  <CustomLink to={`/subcategory/${item.slug}`} className="text-[18px] lg:text-[20px] text-secondary-alt uppercase font-recklessRegular">{item.name}</CustomLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </>
  )
}

export default FilterCardSubCategories;