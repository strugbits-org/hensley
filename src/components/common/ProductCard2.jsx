import React from 'react'
import arrowIcon from '@/assets/icons/arrow-lg-light.svg'
import Image from 'next/image'


function ProductCard2({ data }) {
  return (
    <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-4 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
      {data.map((category, index) => (
        <div
          key={category.id}
          className={`cursor-pointer group border flex hover:bg-[#F0DEA2] transition-all duration-300 ease-in-out lg:flex-row flex-col lg:h-[474px] gap-0 ${index === 0 ? 'sm:col-span-2' : ''
            }`}
        >
          {/* Image */}
          <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] sm:py-[13px] sm:px-[12px] lg:h-auto h-[382px] ">
            <div className="overflow-hidden h-full w-full ">
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
            <h3 className="font-recklessRegular xl:text-[90px] xl:leading-[70px] lg:text-[70px] lg:leading-[50px] uppercase hidden lg:block transition-all duration-300 ease-in-out group-hover:tracking-widest">
              {category.title}
            </h3>

            {/* Desktop Icon + Description */}
            <div className="hidden lg:block">
              <Image
                src={"https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"}
                width={25}
                height={25}
                alt="Arrow"
                className="arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[133px] group-hover:h-[133px] lg:mb-[12px] group-hover:filter brightness-50"
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
                className="sm:h-[25px] sm:w-[25px] "
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductCard2