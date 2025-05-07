import React from 'react'
import logo from '@/assets/testimonialLogo.png'
import Image from 'next/image'
import { PrimaryButton } from '../common/PrimaryButton'
import SectionTitle from "../common/SectionTitle"

const Cards = ()=>{
    return(
        <div className='lg:max-w-[608px] md:min-h-[902px] bg-[rgb(44,34,22)] flex justify-center items-center p-11'>
            <div className='flex flex-col items-center justify-center'>
                <Image src={logo} />
                <p className='max-w-[417px] text-center text-[#FFFFFF] font-haasRegular
                 md:text-[18px] 
                 leading-[30px]
                  sm:text-[14px]
                sm:leading-[18px]
                  mt-[61px]'>VIDENT EXHIBITS IS OUR IN-HOUSE EXHIBIT STUDIO. SPECIALIZING IN THE DESIGN AND PRODUCTION OF CORPORATE EXHIBIT ENVIRONMENTS</p>
                <p className='max-w-[417px] text-center text-[#FFFFFF] font-haasRegular 
                md:text-[18px] 
                leading-[30px] 
                sm:text-[14px]
                sm:leading-[18px]
                mt-11 mb-[48px]'>VIDENT COMBINES CUTTING-EDGE TECHNOLOGY, INGENUITY, AND CRAFTSMANSHIP TO MANUFACTURE CREATIVE, QUALITY TRADE SHOW DISPLAYS, EXHIBITS AND EMPOWERING ACTIVATIONS THAT ENABLE EXHIBITORS TO ENGAGE THEIR CUSTOMERS IN THE MOST INNOVATIVE WAYS.</p>
                        <PrimaryButton className="border border-white text-white hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
                              learn more
                            </PrimaryButton>
            </div>
        </div>
    )
}

function WhatWeOffer() {
  return (
   
    <>
     <SectionTitle text="meet the family" classes={"pt-[40px] pb-[40px] "}/>
     <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-10 md:px-8 px-4 pt-10 pb-10'>
        <Cards />
        <Cards />
        <Cards />
    </div>
    </>
  )
}

export default WhatWeOffer