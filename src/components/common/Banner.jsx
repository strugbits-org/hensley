import React from "react";
import { PrimaryImage } from "./PrimaryImage";
import { PrimaryButton } from "./PrimaryButton";
import { CustomLink } from "./CustomLink";

export const Banner = ({ data }) => {
  if (!data) return null;
  const {
    backgroundImage,
    title,
    subtitle,
    buttonLabel,
    mobileImage,
    buttonLink,
  } = data;

  const formatMobileTitle = (text) => {
    if (!text) return null;
    const cleanText = text.toUpperCase().replace(/\s+/g, " ").trim();
    if (cleanText.includes("START HERE HENSLEY HIGHLIGHTS")) {
      return (
        <>
          <span className="block">START HERE</span>
          <span className="block">HENSLEY</span>
          <span className="block">HIGHLIGHTS</span>
        </>
      );
    }
    return text.split(" ").map((word, idx) => (
      <span key={idx} className="block">
        {word}
      </span>
    ));
  };

  return (
    <div className="relative banner lg:h-[125vh] h-[100vh] lg:p-6 border border-primary-border bg-[#babab2]">
      {/* Desktop Background Image (Absolute) */}
      <div className="hidden lg:block absolute lg:inset-6 inset-0 bg-[#babab2] z-0">
        <PrimaryImage
          timeout={0}
          url={backgroundImage}
          size="tablet"
          alt={title}
          fit="fit"
          customClasses="border border-primary-border h-full w-full object-cover"
        />
      </div>

      {/* Mobile / Tablet Content Layout (Stacked Flow inside h-[100vh]) */}
      <div className="lg:hidden flex flex-col justify-center gap-y-6 items-center h-full w-full py-12 px-6 z-10 relative">
        {/* Top Text Block */}
        <div className="flex flex-col gap-y-3 items-center w-full flex-shrink-0">
          <span className="text-center text-[14px] leading-4 font-haasRegular text-primary-alt uppercase tracking-wider">
            {subtitle}
          </span>
          <h2 className="text-center text-[45px] sm:text-[55px] leading-[45px] sm:leading-[55px] font-recklessRegular text-white uppercase w-full flex flex-col gap-y-1">
            {formatMobileTitle(title)}
          </h2>
        </div>

        {/* Middle Image Block (Strictly under the text and above the button with identical spacing) */}
        <div className="w-full flex justify-center items-center overflow-hidden max-h-[38vh] relative">
          <PrimaryImage
            timeout={0}
            url={mobileImage}
            size="card"
            alt={title}
            fit="fit"
            customClasses="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Bottom Button Block (Strictly under the image with identical spacing) */}
        <div className="flex-shrink-0 w-full flex justify-center">
          <CustomLink to={buttonLink}>
            <PrimaryButton className="font-haasRegular border border-white text-white hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
              {buttonLabel}
            </PrimaryButton>
          </CustomLink>
        </div>
      </div>

      {/* Desktop Content Layout (Absolute Overlap) */}
      <div className="hidden lg:block absolute inset-0 lg:px-16 xl:px-24 2xl:px-44 py-24 lg:py-20 z-10">
        <div className="flex flex-col lg:justify-start lg:h-full justify-between max-w-xs lg:max-w-md xl:max-w-xl gap-4 lg:gap-6 items-center lg:items-start">
          <span className="text-center lg:block hidden lg:text-start text-[14px] lg:text-[24px] leading-4 lg:leading-10 font-haasRegular text-white">
            {subtitle}
          </span>
          <h2 className="text-center lg:block hidden lg:text-start text-[55px] lg:text-[100px] xl:text-[130px] 2xl:text-[140px] leading-[55px] lg:leading-[100px] xl:leading-[130px] 2xl:leading-[140px] font-recklessRegular text-white">
            {title}
          </h2>
          <CustomLink to={buttonLink}>
            <PrimaryButton className="font-haasRegular border border-white text-white hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
              {buttonLabel}
            </PrimaryButton>
          </CustomLink>
        </div>
      </div>
    </div>
  );
};
