import React from 'react'
import SectionTitle from '../common/SectionTitle'
import Image from 'next/image'
import { PrimaryImage } from './PrimaryImage'

function OurCategories({ data }) {
  console.log('data', data);


  return (
    <>
      <div className='w-full lg:border-none sm:px-0 px-[12px]'>
        <SectionTitle text="our categories" classes="text-[35px] pt-[40px] pb-[40px] border-t border-b" />
      </div>
      <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-4 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
        {data.map((item, index) => {
          const { categories: category, title } = item;

          return (
            <div
              key={category._id}
              className={`cursor-pointer group border flex hover:bg-[#F0DEA2] transition-all duration-300 ease-in-out lg:flex-row ${item.rtl && 'lg:flex-row-reverse'
                } lg:h-[474px] gap-0 ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              {/* Image */}
              <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] sm:py-[13px] sm:px-[12px] lg:h-auto h-[382px] ">
                <div className="overflow-hidden h-full w-full ">
                  <PrimaryImage timeout={0} url={category.mainMedia} customClasses={"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"} alt={category.name} />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 flex flex-col justify-between lg:px-[24px] lg:py-[24px]">
                {/* Desktop Title */}
                <h3 className="w-[326px] break-words font-recklessRegular xl:text-[90px] xl:leading-[70px] lg:text-[70px] lg:leading-[50px] uppercase hidden lg:block transition-all duration-300 ease-in-out group-hover:tracking-widest">
                  {category.name}
                </h3>

                <div className="hidden lg:block">
                  <Image
                    src={"https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"}
                    width={25}
                    height={25}
                    alt="Arrow"
                    className="arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[133px] group-hover:h-[133px] lg:mb-[12px] group-hover:filter brightness-50"
                  />

                  <span className="lg:text-[14px] font-haasRegular">
                    {title}
                  </span>
                </div>

                {/* Mobile View */}
                <div className="w-full flex lg:hidden justify-between pb-[34px] pt-[12px] px-[11px]">
                  <div>
                    <h3
                      className="font-recklessRegular xl:text-[90px] xl:leading-[70px] lg:text-[70px] lg:leading-[50px] uppercase
                        sm:text-[30px] sm:leading-[45px] text-[35px] leading-[45px]"
                    >
                      {category.name}
                    </h3>
                    <span className="lg:text-[14px] font-haasRegular">
                      {title}
                    </span>
                  </div>
                  <Image
                    src={"https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"}
                    width={25}
                    height={25}
                    alt="Arrow"
                    className="sm:h-[25px] sm:w-[25px] "
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default OurCategories;
