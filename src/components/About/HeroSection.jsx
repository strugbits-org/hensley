'use client'
import React from "react";
import Image from "next/image";
import { PrimaryButton } from "../common/PrimaryButton";
import arrow from "@/assets/icons/arrow.svg";
import { PrimaryImage } from "../common/PrimaryImage";

function HeroSection({heroSectionData}) {

  const {title, subtitle, image, buttonLabel, buttonLink} = heroSectionData;

  const data = {
    title: title,
    tagline: subtitle,
    imageSrc: require("@/assets/Atrium 5-X2.png"),
    buttonLabel,
    buttonAction: () => {
      // You can replace this with a navigation function or scroll action
     if (buttonLink) {
      window.location.href = buttonLink; // Navigates to the link
    } else {
      console.log("Button clicked! No link provided.");
    }
    },
  };

  return (
    <div className="flex w-full lg:h-screen lg:flex-row md:justify-center md:items-center flex-col">
      <div className="lg:w-1/2 flex items-center justify-center md:pl-11 lg:mb-0 mb-[59px]">
        <div className="lg:w-min lg:text-left text-center w-[492px]">
          <h1
            className="font-recklessRegular 
              text-[55px] lg:text-[114px] xl:text-[140px] lg:leading-[120px] 
              leading-[50px] 
              text-secondary-alt  
              lg:pt-0 pt-[60px]"
          >
            {data.title.split(" ").slice(0, 2).join(" ")} <br />{" "}
            {data.title.split(" ").slice(2).join(" ")}
          </h1>
          <p className="lg:text-[24px] font-haasRegular text-[14px] mt-[14px]">
            {data.tagline}
          </p>
          <PrimaryButton
           onClick={data.buttonAction} 
            className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
              max-h-[60px] max-w-[280px]
              p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
          >
            {data.buttonLabel}
          </PrimaryButton>
        </div>
      </div>

      <div className="lg:w-1/2 p-5 md:h-screen sm:h-[500px] md:w-full relative">
        {/* <Image
          className="h-full w-full object-cover"
          src={data.imageSrc}
          alt="Hero Image"
        /> */}
        <PrimaryImage timeout={0} url={image} customClasses={"h-full w-full object-cover "}  />
        <Image
          src={arrow}
          alt="Scroll Arrow"
          className="lg:block hidden absolute bottom-[50px] left-[50px] black h-[25px] w-[25px]"
        />
      </div>
    </div>
  );
}

export default HeroSection;
