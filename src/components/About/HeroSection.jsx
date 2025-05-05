import React from 'react'
import Image from "next/image"
import heroImage from '@/assets/Atrium 5-X2.png'
import { PrimaryButton } from "../common/PrimaryButton"
import { SecondaryButton } from "../common/SecondaryButton"

function HeroSection() {
  return (
    <div className="flex w-full 2xl:h-screen lg:flex-row flex-col-reverse">
    <div className="lg:w-1/2 flex items-center justify-center ">
    <div className="lg:w-min  lg:text-left sm:text-center sm:p-10">
        <h1 className="font-recklessRegular 2xl:text-[140px] 2xl:leading-[120px] text-[#2C2216]  text-[100px] leading-[100px]">WE ARE HENSLEY</h1>
        <p className="text-[24px] font-haasRegular">CORPORATE & SOCIAL EVENTS</p>
        <PrimaryButton className="border border-button-border text-[#2C2216] hover:bg-[#F0DEA2] h-[60px] w-[280px] p-0 mt-[60px] hover:[letter-spacing:5px]">DISCOVER</PrimaryButton>
    </div>
    </div>
    <div className="lg:w-1/2 p-5  lg:h-auto sm:h-[500px]">
    <Image className="h-full w-full" src={heroImage}/>
    </div>
</div>
  )
}

export default HeroSection