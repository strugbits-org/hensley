'use client'
import React from "react";
import SectionTitle from "../common/SectionTitle";
import { PrimaryButton } from "../common/PrimaryButton";
import { PrimaryImage } from "../common/PrimaryImage";
import { CustomLink } from "../common/CustomLink";

const Cards = ({ logo, title, buttonLabel, buttonLink }) => {
  // Split title into parts by double line breaks or similar logic
  const paragraphs = title?.split(/\n\s*\n/) || [];


  return (
    <div className="lg:max-w-[608px] md:min-h-[902px] bg-[rgb(44,34,22)] flex justify-center items-center p-11">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[306px] h-[108px]">
          <PrimaryImage timeout={0} url={logo} fit={"fit"} customClasses={"h-full w-full object-contain"} />
        </div>

        {paragraphs.map((para, index) => (
          <p
            key={index}
            className={`max-w-[417px] text-center text-[#FFFFFF] font-haasRegular md:text-[18px] md:leading-[30px] leading-[30px] sm:text-[14px] sm:leading-[18px] ${index === 0 ? 'lg:mt-[61px] mt-[22px]' : 'lg:mt-11 mt-10'
              } ${index === paragraphs.length - 1 ? 'lg:mb-[48px] mb-[44px]' : ''}`}
          >
            {para}
          </p>
        ))}

        <CustomLink to={buttonLink}>
          <PrimaryButton className="lg:text-[14px] font-haasRegular uppercase block border border-white text-white hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
            {buttonLabel}
          </PrimaryButton>
        </CustomLink>
      </div>
    </div>
  );
};


function MeetFamily({ data }) {

  return (
    <>
      <div className="w-full">
        <SectionTitle text="meet the family" classes=" text-[55px] sm:pt-[40px] sm:pb-[40px]" />
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:gap-10 lg:gap-3 lg:px-8 px-2 pt-10 pb-10 gap-0">
        {data.map((card, idx) => (
          <Cards key={idx} {...card} />
        ))}
      </div>
    </>
  );
}

export default MeetFamily;
