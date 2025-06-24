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
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px] mb-10 lg:mb-0 p-3 lg:px-0">
        <div className="bg-secondary-glass p-6 md:p-12 lg:p-16 flex flex-col justify-center mb-10">
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
              <PrimaryButton className="lg:mt-[35px] border border-secondary-alt text-secondary-alt hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">{buttonLabel}</PrimaryButton>
            </CustomLink>
          </div>
        </div>
        <div className="w-full h-full lg:px-[24px] min-h-[500px]">
          <PrimaryImage url={image1} alt="Hensley Events" customClasses=" w-full h-full object-cover" />
        </div>
      </div>

      {/* Second Section */}
      <div className="bg-primary p-4 py-12">
        <div className="grid grid-cols-1 lg:py-[25px] lg:grid-cols-2 lg:border border-primary-alt items-center">
          <div className="relative h-auto lg:h-full my-20 lg:m-6">
            <VideoPlayer url={video} classes={"lg:!h-full !w-full"} />
          </div>
          <div className="md:p-12 lg:pl-16 flex flex-col justify-center">
            {convertToHTML({
              content: content1,
              class_heading: "text-secondary-alt lg:uppercase text-[24px] lg:text-[35px] lg:leading-[35px] tracking-tight font-recklessRegular mb-4",
              class_p: "text-secondary-alt uppercase leading-[20px] text-sm lg:text-base font-haasRegular mb-3",
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HeroSection;
