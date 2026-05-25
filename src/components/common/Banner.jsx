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

  const cleanBackgroundImage =
    typeof backgroundImage === "string" ?
      backgroundImage.split("?")[0]
    : backgroundImage;
  const cleanMobileImage =
    typeof mobileImage === "string" ? mobileImage.split("?")[0] : mobileImage;

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
    <div className="lg:mt-[75px] mt-0 lg:p-4 p-0 lg:border-t border-t-0 border-primary-border">
      <div className="relative banner w-full lg:h-auto lg:aspect-[16/10] h-auto lg:p-6 bg-[#babab2]">
        {/* Desktop Background Image (Absolute) */}
        <div className="hidden lg:block absolute lg:inset-6 inset-0 bg-[#babab2] z-0">
          <PrimaryImage
            timeout={0}
            url={cleanBackgroundImage}
            size="tablet"
            alt={title}
            original={true}
            customClasses=" h-full w-full object-cover object-center"
          />
        </div>

        {/* Mobile / Tablet Content Layout (Stacked Flow inside h-[100vh]) */}
        <div className="lg:hidden flex flex-col justify-center gap-y-6 items-center h-auto w-full py-12 px-6 z-10 relative">
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
          <div className="w-full flex justify-center items-center overflow-hidden h-[442px] relative">
            <PrimaryImage
              timeout={0}
              url={cleanMobileImage}
              size="card"
              alt={title}
              original={true}
              customClasses="h-[442px] w-[357px] object-cover"
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
        <div className="hidden lg:block absolute lg:inset-6 inset-0 lg:px-12 xl:px-16 2xl:px-24 3xl:px-40 py-24 lg:py-16 3xl:py-28 z-10">
          <div className="flex flex-col lg:justify-start lg:h-full justify-between max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg 3xl:max-w-[40rem] gap-4 lg:gap-6 3xl:gap-10 items-center lg:items-start">
            <span className="text-center lg:block hidden lg:text-start text-[14px] lg:text-[24px] 3xl:text-[42px] leading-4 lg:leading-10 3xl:leading-[60px] font-haasRegular text-white">
              {subtitle}
            </span>
            <h2 className="text-center lg:block hidden lg:text-start text-[55px] lg:text-[70px] xl:text-[90px] 2xl:text-[115px] 3xl:text-[200px] leading-[55px] lg:leading-[70px] xl:leading-[90px] 2xl:leading-[110px] 3xl:leading-[190px] font-recklessRegular text-white">
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
    </div>
  );
};
