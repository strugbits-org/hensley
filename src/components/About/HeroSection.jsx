import React from "react";
import Image from "next/image";
import heroImage from "@/assets/Atrium 5-X2.png";
import { PrimaryButton } from "../common/PrimaryButton";
import { SecondaryButton } from "../common/SecondaryButton";

function HeroSection() {
  return (
    <div className="flex w-full md:h-screen md:flex-row sm: justify-center sm:items-center flex-col ">
      <div className="md:w-1/2 flex items-center justify-center ">
        <div className="md:w-min  md:text-left text-center sm:p-10 ">
          <h1 className="font-recklessRegular 
          lg:text-[140px] lg:leading-[120px] lg:max-w-[650px] 
          md:text-[80px] md:leading-[80px]
          sm:text-[55px] sm:leading-[50px] 
          text-[#2C2216]  
          text-[80px] leading-[100px] ">
            WE ARE HENSLEY
          </h1>
          <p className="text-[24px] font-haasRegular md:text-[14px] md:mt-[14px]">
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
      <div className="md:w-1/2 p-5 md:h-screen sm:h-[500px] sm:w-full">
        <Image className="h-full w-full" src={heroImage} />
      </div>
    </div>
  );
}

export default HeroSection;