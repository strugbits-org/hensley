"use client";
import React from "react";
import { PrimaryButton } from "../common/PrimaryButton";
import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";
import { convertToHTML } from "@/utils/renderRichText";
import { VideoPlayer } from "../common/helpers/VideoPlayer";

function HeroSection({ data = {} }) {

  const { title, tagline, image1, content1, buttonLabel, video, buttonLink = "#" } = data;

  return (
    <div className="w-full">
      {/* First Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px] mb-10 lg:mb-0 p-6 lg:px-0">
        <div className="bg-secondary-glass p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="lg:max-w-[600px] lg:text-left text-center ml-auto mr-0">
            <p className="text-secondary uppercase text-lg
            sm:text-[14px]
            sm:leading-[20px]
            font-haasRegular mb-4">
              {title}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-6xl 
            text-[35px]
            leading-[30px]
            lg:mt-0
            mt-[29px]
            mb-[34px]
            font-recklessRegular text-secondary tracking-tight lg:mb-0
            ">
              {tagline}
            </h1>
            <CustomLink to={buttonLink}>
              <PrimaryButton className="border border-secondary-alt text-secondary-alt hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">{buttonLabel}</PrimaryButton>
            </CustomLink>
          </div>
        </div>
        <div className="w-full h-full lg:px-[24px]">
          <PrimaryImage url={image1} alt="Hensley Events" customClasses=" w-full h-full" />
        </div>
      </div>

      {/* Second Section */}
      <div className="bg-primary p-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-primary-border items-center">
          <div className="relative min-h-[600px] m-6 ">
            <VideoPlayer url={video} classes={"h-[600px]"} />
          </div>
          <div className="p-6 md:p-12 lg:pl-16 xl:p-28 flex flex-col justify-center">
            {convertToHTML({
              content: content1,
              class_p: "text-secondary-alt uppercase leading-[20px] text-base font-haasRegular mb-3",
              class_heading: "text-secondary-alt uppercase text-[35px] leading-[35px] tracking-tight font-recklessRegular mb-4"
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HeroSection;
