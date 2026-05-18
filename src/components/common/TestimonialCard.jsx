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
      className={`flex flex-col lg:flex-row group  bg-primary lg:bg-transparent relative min-h-[499px] lg:h-[499px] lg:max-h-[600px] w-full lg:border border-primary-border duration-300 ease-in-out max-w-[1240px] flex-shrink-0 ${classes}`}
    >
      <div
        className={`w-full lg:w-1/2 max-h-[364px] lg:max-h-none h-full relative flex p-3 lg:p-6 ${imageExp ? "group-hover:lg:p-0" : "lg:p-6"} transition-all duration-300 ease-in-out`}
      >
        <PrimaryImage
          url={displayImage}
          size="card"
          alt={displayTitle}
          customClasses="grow w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 p-6 flex flex-col">
        <h2 className="text-center lg:text-start text-[35px] leading-[42px] lg:text-[45px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular mb-2">
          {displayName}
        </h2>
        <p className="text-center lg:text-start my-[16px] text-[14px] lg:text-[18px] leading-[30px] text-secondary-alt font-haasRegular ">
          {feedback || description}
        </p>
        <span
          className={`text-center lg:text-start text-[12px] leading-[42px] lg:text-[12px] lg:leading-[42px]  tracking-wider text-secondary-alt font-recklessRegular  mt-2 `}
        >
          {displayTitle}
        </span>
      </div>
    </div>
  );
};
