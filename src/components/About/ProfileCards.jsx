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

function ProfileCards() {
  return (

    <>
    <SectionTitle text="dream team" classes={"pt-[40px] pb-[40px] "} />
    <div className='min-h-screen flex flex-col items-center justify-center pb-11'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 mb-[30px]'>
       
       {
           data.map((dt)=>(
               <>
                <div className='md:max-w-[450px] sm-w-[366px] mt-8'>
           <div className='md:max-h-[500px] sm:max-h-[366px] border border-black'>
               <Image src={dt.image} className='w-full h-full'/>
           </div>
           <div>
               <h3 className='uppercase font-recklessLight text-[#2C2216]
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
               leading-[20px] text-[#2C2216] md:mt-[8px] mt-[2px]'>{dt?.status || ''}</p>
           </div>
       </div>
               </>
           ))
       }
   </div>
  <PrimaryButton className="border border-[#2C2216] text-[#2C2216] hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
                load more
              </PrimaryButton>
    </div>
    </>
  )
}

export default ProfileCards