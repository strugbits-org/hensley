import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryImage } from './PrimaryImage'
import { insertBreaks } from '@/utils';
import { CustomLink } from './CustomLink';

function OurCategories({ data, pageDetails, classes }) {
  const { ourCategoriesTitle } = pageDetails;

  const checkIsTent = (category) => {
    const isTent = category._id === "d27f504d-05a2-ec30-c018-cc403e815bfa";
    return isTent;
  };
  return (
    <div className={`mb-20 md:mb-40 lg:mb-0 ${classes}`}>
      <div className='w-full sm:px-0 px-[12px]'>
        <SectionTitle text={ourCategoriesTitle} classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b" />
      </div>
      <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-4 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
        {data.map((item, index) => {
          const { categories: category, title } = item;
          const isTent = checkIsTent(category);

          return (
            <CustomLink to={isTent ? `/types-of-tents` : `/collections/${category.slug}`}
              key={category._id}
              className={`cursor-pointer group border flex flex-col lg:flex-row hover:bg-primary transition-all duration-300 ease-in-out ${item.rtl && 'lg:flex-row-reverse'
                } lg:h-[474px] gap-0 ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              {/* Image */}
              <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] px-[12px] lg:h-auto h-[382px] ">
                <div className="overflow-hidden h-full w-full ">
                  <PrimaryImage timeout={0} url={category.mainMedia} customClasses={"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"} alt={category.name} />
                </div>
              </div>

              {/* Content */}
              <div className={`lg:w-1/2 ${item.rtl ? 'lg:pl-[24px] ' : 'lg:pr-[24px]'} lg:py-[24px] py-[13px] max-lg:px-[12px]`}>
                <div className='h-full w-full flex justify-between gap-x-2'>
                  <div className='h-full flex flex-col justify-between'>
                    <h3 className="font-recklessRegular uppercase text-[35px] lg:text-[60px] xl:text-[80px] 2xl:text-[90px] leading-[45px] lg:leading-[50px] xl:leading-[70px] transition-all duration-300 ease-in-out group-hover:tracking-widest">
                      <span className='lg:block hidden'>{insertBreaks(category.name, 5, true)}</span>
                      <span className='lg:hidden'>{category.name}</span>
                    </h3>

                    <div>
                      <PrimaryImage
                        url={"https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"}
                        alt="Arrow"
                        customClasses="hidden lg:block arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[133px] group-hover:h-[133px] lg:mb-[12px] group-hover:filter brightness-50"
                      />

                      <span className="text-sm font-haasRegular leading-4">
                        {title}
                      </span>
                    </div>
                  </div>
                  <PrimaryImage
                    url={"https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"}
                    alt="Arrow"
                    customClasses="lg:hidden arrow w-[25px] h-[25px]"
                  />
                </div>
              </div>
            </CustomLink>
          )
        })}
      </div>
    </div>
  )
}

export default OurCategories;
