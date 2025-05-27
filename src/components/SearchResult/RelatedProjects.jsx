import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryImage } from '../common/PrimaryImage'
import Image from 'next/image'
import image from '@/assets/search-image-3.png'
import { PrimaryButton } from '../common/PrimaryButton'

const CardButtons = ({ text, classes }) => {
  return (
    <>
      <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-1`}>{text}</button>
    </>
  )
}

const ProjectCards = () => {
  return (
    <div className="cursor-pointer group border flex flex-col lg:flex-row hover:bg-primary transition-all duration-300 ease-in-out lg:h-[474px] gap-0">
      {/* Image Section */}
      <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] px-[12px] lg:h-auto h-[382px]">
        <div className="overflow-hidden h-full w-full">
          <Image src={image} alt="Project Image" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      </div>

      {/* Content Section */}
      <div className="lg:w-1/2 lg:pr-[24px] lg:py-[24px] py-[13px] max-lg:px-[12px]">
        <div className="h-full w-full flex justify-between gap-x-2">
          <div className="h-full flex flex-col justify-between">
            <div className='flex flex-col gap-y-[15px]'>
              <span className='font-haasRegular *:
            text-[12px]
            uppercase
            text-secondary-alt
            block
            '>DEC 28, 2023 – MIRCEA MANEA</span>

              <span
                className="font-recklessRegular
              text-[35px]
              leading-[35px]
              uppercase "
              >
                GALLOP AND GLAMOUR: HENSLEY EQUESTRIAN EXTRAVAGANZA EVENT DESIGN
              </span>

              <div className='w-full flex gap-x-[6px] flex-wrap gap-y-[10px]'>
                <CardButtons text={"corporate"} classes={"!bg-transparent border border-black"} />
                <CardButtons text={"event design and production"} />
                <CardButtons text={"creative services agency"} />
                <CardButtons text={"+3 studios"} />

              </div>
            </div>

            <div>
              <PrimaryImage
                url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                alt="Arrow"
                customClasses="hidden lg:block arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[133px] group-hover:h-[133px] lg:mb-[12px] group-hover:filter brightness-50"
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
    </div>
  )
}

function RelatedProjects({ classes }) {
  return (
    <div className={`mb-20 md:mb-40 lg:mb-0 pb-[100px] ${classes}`}>
      <SectionTitle text="PROJECTS RELATED TO YOUR SEARCH" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
      <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-0 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
        <ProjectCards />
        <ProjectCards />
        <ProjectCards />
        <ProjectCards />
      </div>

      <div className='w-full flex justify-center items-center'>
        <PrimaryButton
          className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
                                    max-h-[60px] max-w-[280px]
                                    p-0  mt-[15px] hover:[letter-spacing:4px]"
        >
          see all
        </PrimaryButton>
      </div>

    </div>
  )
}

export default RelatedProjects
