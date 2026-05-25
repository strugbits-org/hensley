'use client'
import React from "react";
import SectionTitle from "../common/SectionTitle";
import { PrimaryButton } from "../common/PrimaryButton";
import { PrimaryImage } from "../common/PrimaryImage";
import { CustomLink } from "../common/CustomLink";

const Cards = ({ logo, description, title, buttonLabel, buttonLink }) => {
  // Support new `description` field; fall back to old `title` field for body text
  const bodyText = description ?? title ?? '';
  const paragraphs = bodyText?.split(/\n\s*\n/) || [];
  // Support new logo as media object { url } or old logo as bare string URL
  const logoUrl = logo?.url || (typeof logo === 'string' ? logo : '');


  return (
    <div className="lg:max-w-[608px] 3xl:max-w-none 3xl:w-full md:min-h-[902px] 3xl:min-h-[1360px] bg-[rgb(44,34,22)] flex justify-center items-center p-11 3xl:p-16">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[306px] h-[108px] 3xl:w-[460px] 3xl:h-[160px]">
          <PrimaryImage timeout={0} url={logoUrl} fit={"fit"} customClasses={"h-full w-full object-contain"} />
        </div>

        {paragraphs.map((para, index) => (
          <p
            key={index}
            className={`max-w-[417px] 3xl:max-w-[780px] text-center text-[#FFFFFF] font-haasRegular md:text-[18px] md:leading-[30px] 3xl:text-[34px] 3xl:leading-[52px] leading-[30px] sm:text-[14px] sm:leading-[18px] ${index === 0 ? 'lg:mt-[61px] 3xl:mt-[90px] mt-[22px]' : 'lg:mt-11 3xl:mt-16 mt-10'
              } ${index === paragraphs.length - 1 ? 'lg:mb-[48px] 3xl:mb-[72px] mb-[44px]' : ''}`}
          >
            {para}
          </p>
        ))}

        <CustomLink to={buttonLink} target={"_blank"}>
          <PrimaryButton className="lg:text-[14px] 3xl:text-[26px] font-haasRegular uppercase block border border-white text-white hover:bg-primary hover:text-secondary-alt max-h-[60px] 3xl:max-h-[100px] max-w-[280px] 3xl:max-w-[480px] px-8 py-4 3xl:px-12 3xl:py-7 hover:[letter-spacing:4px]">
            {buttonLabel}
          </PrimaryButton>
        </CustomLink>
      </div>
    </div>
  );
};


function MeetFamily({ data, pageTitle }) {

  return (
    <>
      <div className="w-full">
        <SectionTitle text={pageTitle} classes=" text-[55px] sm:pt-[40px] sm:pb-[40px]" />
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
