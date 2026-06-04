import React from "react";
import { PrimaryImage } from "../common/PrimaryImage";

export const TestimonialCard = ({ data, classes, imageExp, titleClass }) => {
  const {
    name,
    authorName,
    title,
    authorTitle,
    feedback,
    description,
    image,
    avatar,
  } = data;
  const displayName = authorName || name;
  const displayTitle = authorTitle || title;
  const displayImage = avatar || image;

  return (
    <div
      className={`flex flex-col lg:flex-row group bg-primary lg:bg-transparent relative w-full h-full lg:min-h-[480px] 3xl:min-h-[760px] lg:border border-primary-border duration-300 ease-in-out max-w-[1240px] 3xl:max-w-[1900px] flex-shrink-0 ${classes}`}
    >
      {/* 1. aspect-square for mobile/tablet stacked cards.
        2. lg:aspect-[4/5] forces the desktop image box to stay a tall portrait shape!
      */}
      <div
        className={`w-full lg:w-1/2 aspect-square lg:aspect-[4/5] relative flex p-3 lg:p-6 3xl:p-10 ${
          imageExp ? "group-hover:lg:p-0" : "lg:p-6"
        } transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <PrimaryImage
          url={displayImage}
          size="card"
          alt={displayTitle}
          /* THE ANCHOR: !object-top forces the crop to happen at the bottom, protecting the faces */
          customClasses="w-full h-full !object-cover !object-top"
        />
      </div>

      <div className="w-full lg:w-1/2 p-6 sm:p-8 3xl:p-12 flex flex-col justify-between flex-grow">
        <div className="flex flex-col">
          <h2 className="text-center lg:text-start text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] lg:text-[45px] lg:leading-[48px] 3xl:text-[68px] 3xl:leading-[72px] uppercase tracking-wider text-secondary-alt font-recklessRegular mb-2 3xl:mb-4">
            {displayName}
          </h2>
          <p className="text-center lg:text-start my-[16px] 3xl:my-[28px] text-[14px] lg:text-[16px] xl:text-[18px] 3xl:text-[26px] leading-[24px] lg:leading-[30px] 3xl:leading-[42px] text-secondary-alt font-haasRegular">
            {feedback || description}
          </p>
        </div>

        <span
          className={`text-center lg:text-start text-[12px] leading-[20px] 3xl:text-[18px] 3xl:leading-[28px] tracking-wider text-secondary-alt font-recklessRegular mt-auto pt-4 3xl:pt-8 block uppercase ${titleClass}`}
        >
          {displayTitle}
        </span>
      </div>
    </div>
  );
};
