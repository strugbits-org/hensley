import React from "react";
import Image from "next/image";
import heroImage from "@/assets/Atrium 5-X2.png";
import { PrimaryButton } from "../common/PrimaryButton";
import arrow from "@/assets/icons/arrow.svg"

function HeroSection() {
  const data = {
    title:"",
    tagline:"",
    imageSrc:"",
    buttonLabel:"",
    buttonAction:""
  }
  return (
    <div className="flex w-full lg:h-screen lg:flex-row md: justify-center md:items-center flex-col ">
      <div className="lg:w-1/2 flex items-center justify-center md:pl-11">
        <div className="lg:w-min lg:text-left text-center w-[492px]">
          <h1 className="font-recklessRegular 
          text-[55px] lg:text-[114px] xl:text-[140px] lg:leading-[120px] 
          leading-[50px] 
          text-[#2C2216]  
         ">
            WE ARE <br /> HENSLEY
          </h1>
          <p className="lg:text-[24px] font-haasRegular text-[14px] mt-[14px]">
            CORPORATE & SOCIAL EVENTS
          </p>
          <PrimaryButton className="border border-black text-[#2C2216] hover:bg-[#F0DEA2] hover:border-[#2C2216] 
          max-h-[60px] max-w-[280px]
           p-0 mt-[60px] hover:[letter-spacing:4px]
           ">
            DISCOVER
          </PrimaryButton>
        </div>
      </div>
      <div className="lg:w-1/2 p-5 md:h-screen sm:h-[500px] md:w-full relative">
        <Image className="h-full w-full object-cover" src={heroImage} />
        <Image src={arrow} className="lg:block hidden absolute bottom-[50px] left-[50px] black h-[25px] w-[25px]" />
      </div>
    </div>
  );
}

export default HeroSection;