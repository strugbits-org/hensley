import React from 'react'
import image1 from "@/assets/person1.png"
import Image from 'next/image'
import { PrimaryButton } from '../common/PrimaryButton'
import SectionTitle from "../common/SectionTitle"

const data = [
    {
        image: image1,
        heading:"GABRIEL MACOHIN",
        status:"director"
    },
    {
        image: image1,
        heading:"GABRIEL MACOHIN",
         status:"director"
    },
    {
        image: image1,
        heading:"GABRIEL MACOHIN",
        status:""
    },
    {
        image: image1,
        heading:"GABRIEL MACOHIN",
    },
    {
        image: image1,
        heading:"GABRIEL MACOHIN",
        status:"director"
    },
]

function DreamTeam() {
  return (

    <>
    <SectionTitle text="dream team" classes={"text-[55px] w-[286px] pt-[40px] pb-[40px] "} />
    <div className='min-h-screen flex flex-col items-center justify-center lg:pb-[130px] sm:pb-[140px] pb-[131px] border'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-[30px] sm:w-full'>
       
       {
           data.map((dt)=>(
               <>
                <div className='lg:max-w-[450px] sm:w-auto mt-8 '>
           <div className='lg:max-h-[500px] sm:h-auto border '>
               <Image src={dt.image} className='w-full h-full'/>
           </div>
           <div>
               <h3 className='uppercase font-recklessLight text-secondary-alt
               md:text-[25px]
               lg:text-[35px]
               lg:leading-[35px]
                text-[20px] 
                leading-[20px] 
                mt-[12px]
                '>{dt.heading}</h3>
               <p className='uppercase font-haasRegular 
               md:text-[12px]
               lg:text-[16px]
               text-[12px]
               leading-[20px] text-secondary-alt lg:mt-[6px] mt-[3px]'>{dt?.status || ''}</p>
           </div>
       </div>
               </>
           ))
       }
   </div>
  <PrimaryButton className="border border-secondary-alt text-secondary-alt hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px] lg:mt-[83px] sm:mt-[42px] mt-[44px]">
                load more
              </PrimaryButton>
    </div>
    </>
  )
}

export default DreamTeam