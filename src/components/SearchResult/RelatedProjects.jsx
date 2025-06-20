import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryImage } from '../common/PrimaryImage'
import { PrimaryButton } from '../common/PrimaryButton'
import { CustomLink } from '../common/CustomLink'
import { formatDate } from '@/utils'

const Tag = ({ text, classes }) => {
  return (
    <>
      <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-2`}>{text}</button>
    </>
  )
}

const ProjectCards = ({ data, isRTL }) => {
  const { portfolioRef, markets, studios } = data;

  return (
    <CustomLink to={`/project/${data.slug}`} className={`cursor-pointer group border flex flex-col lg:flex-row hover:bg-primary transition-all duration-300 ease-in-out lg:h-[474px] gap-0 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
      {/* Image Section */}
      <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] px-[12px] lg:h-auto h-[382px]">
        <div className="overflow-hidden h-full w-full">
          <PrimaryImage useNextImage={true} url={data.image} alt={portfolioRef.title} type='alternate' q={"50"} customClasses="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      </div>

      {/* Content Section */}
      <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] max-lg:px-[12px]">
        <div className="h-full w-full flex justify-between gap-x-2">
          <div className="h-full flex flex-col justify-between">
            <div className='flex flex-col gap-y-[15px]'>
              <span className='font-haasRegular *:
            text-[12px]
            uppercase
            text-secondary-alt
            block
            '>{formatDate(portfolioRef._updatedDate)}</span>

              <h2 className="font-recklessRegular 2xl:text-[35px] 2xl:leading-[35px] max-2xl:text-[20px] max-2xl:leading-[18px] text-[23px] leading-[25px] uppercase ">
                {portfolioRef.title}
              </h2>

              <ul className="flex gap-2 flex-wrap my-4">
                {markets.map((market, index) => (
                  <Tag key={index} text={market.category} />
                ))}
                {studios.map((studio, index) => (
                  <React.Fragment key={index}>
                    {index < 2 && (
                      <Tag text={studio.name} />
                    )}
                  </React.Fragment>
                ))}
                {studios.length > 2 ? (
                  <Tag text={`+${studios.length - 2} studios`} />
                ) : null}
              </ul>
              <p className='font-haasRegular uppercase 2xl:text-[12px] 2xl:leading-[16px] lg:text-[12px] text-secondary-alt block line-clamp-3'>
                {portfolioRef.description.slice(0, 200)}{portfolioRef.description.length > 200 ? '...' : ''}
              </p>
            </div>

            <div className='pt-[10px]'>
              <PrimaryImage
                url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                alt="Arrow"
                customClasses="hidden lg:block arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[70px] group-hover:h-[70px] lg:mb-[12px] group-hover:filter brightness-50"
              />
            </div>
          </div>

          <PrimaryImage
            url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
            alt="Arrow"
            customClasses="lg:hidden arrow w-[25px] h-[25px]"
          />
        </div>
      </div>
    </CustomLink>
  )
}

function RelatedProjects({ data, classes, pageTitle="" }) {
  return (
    <div className={`mb-20 md:mb-40 lg:mb-0 pb-[100px] ${classes}`}>
      <SectionTitle text={pageTitle} classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
      <div className="w-full grid sm:grid-cols-2 grid-cols-1 lg:gap-0 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
        {data.map((item, index) => {
          const isRTL = Math.floor(index / 2) % 2 === 1;
          return (
            <ProjectCards key={index} data={item} isRTL={isRTL} />
          );
        })}
      </div>

      <CustomLink to={"/portfolio"} className='w-full flex justify-center items-center'>
        <PrimaryButton className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt max-h-[60px] max-w-[280px] p-0 mt-[15px] hover:[letter-spacing:4px]">
          see all
        </PrimaryButton>
      </CustomLink>
    </div>
  )
}

export default RelatedProjects
