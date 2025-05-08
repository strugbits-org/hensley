import React from 'react'
import Image from 'next/image'
import SectionTitle from '../common/SectionTitle'

import image1 from '@/assets/house.png'
import arrowIcon from '@/assets/icons/arrow-dark.svg'

const categories = [
  {
    id: 1,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
  {
    id: 2,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
  {
    id: 3,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
]

function OurCategory() {
  return (
    <>
      {/* <SectionTitle text="our categories" classes="pt-[40px] pb-[40px]" /> */}
      <div className="w-full border px-[10px] grid sm:grid-cols-2 grid-cols-1 gap-4 py-[24px]">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`group border flex hover:bg-[#F0DEA2] transition-all duration-300 ease-in-out lg:flex-row flex-col lg:h-[474px] gap-0 ${
              index === 0 ? 'sm:col-span-2' : ''
            }`}
          >
            {/* Image */}
            <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px]">
              <div className="overflow-hidden h-full w-full">
                <Image
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2 flex flex-col justify-between lg:px-[24px] lg:py-[24px]">
              {/* Desktop Title */}
              <h3 className="font-recklessRegular xl:text-[90px] xl:leading-[70px] lg:text-[70px] lg:leading-[50px] uppercase hidden lg:block">
                {category.title}
              </h3>

              {/* Desktop Icon + Description */}
              <div className="hidden lg:block">
                <Image
                  src={arrowIcon}
                  alt="Arrow"
                  className="arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[133px] group-hover:h-[133px]"
                />
                <span className="lg:text-[14px] font-haasRegular">
                  {category.description}
                </span>
              </div>

              {/* Mobile View */}
              <div className="w-full flex lg:hidden justify-between pb-[34px] pt-[12px] px-[11px]">
                <div>
                  <h3
                    className="font-recklessRegular xl:text-[90px] xl:leading-[70px] lg:text-[70px] lg:leading-[50px] uppercase
                    sm:text-[30px] sm:leading-[45px] text-[35px] leading-[45px]"
                  >
                    {category.title}
                  </h3>
                  <span className="lg:text-[14px] font-haasRegular">
                    {category.description}
                  </span>
                </div>
                <Image
                  src={arrowIcon}
                  alt="Arrow"
                  className="sm:h-[25px] sm:w-[25px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default OurCategory
