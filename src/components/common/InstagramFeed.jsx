"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import { PrimaryButton } from "./PrimaryButton";
import SectionTitle from "./SectionTitle";
import { useMediaQuery } from "@uidotdev/usehooks";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { CustomLink } from "./CustomLink";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

function InstagramFeed({ data, details }) {
  const { instaFeedHeading, instaFeedTitle, instaFeedIcon, instaFeedButtonLabel, instaFeedButtonAction } = details;

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInstance = useRef(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: isMobile ? 1.3 : isTablet ? 2.3 : 4,
        spacing: isMobile ? 5 : isTablet ? 8 : 10,
      },
      created(slider) {
        sliderInstance.current = slider;
        setCurrentSlide(slider.track.details.rel);
      },
      detailsChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    []
  );

  return (
    <div className="instagram-feed bg-white">
      <SectionTitle
        text={instaFeedHeading}
        classes={"py-[40px] hidden lg:block"}
      />
      <div className="p-6">
        <div className="flex flex-col w-full border">
          <div className="flex lg:flex-row lg:justify-between flex-col justify-center w-full items-center min-h-[130px] border px-8 lg:pt-[30px] pb-[40px] pt-[131px] ">
            <h3 className="lg:hidden block text-secondary-alt text-[55px] max-w-[280px] font-recklessRegular leading-[50px] text-center uppercase">
              {instaFeedHeading}
            </h3>
            <div className="flex lg:flex-row lg:justify-center items-center lg:mt-0 lg:mb-0 mt-3 mb-10 gap-2 lg:gap-4">
              <PrimaryImage type="svg" url={instaFeedIcon} customClasses={"size-[18px] lg:size-[30px]"} />
              <h3 className="text-secondary-alt text-[18px] lg:text-[35px] font-recklessRegular">
                {instaFeedTitle}
              </h3>
            </div>
            <CustomLink to={instaFeedButtonAction}>
              <PrimaryButton className="border border-secondary-alt text-secondary-alt hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
                {instaFeedButtonLabel}
              </PrimaryButton>
            </CustomLink>
          </div>
          <div>
            <div ref={sliderRef} className="keen-slider mt-[20px] ">
              {data.map((dt, index) => {
                const isActive = index === currentSlide;

                return (
                  <CustomLink
                    to={"/"}
                    key={index}
                    className={`keen-slider__slide  flex flex-col md:p-[10px]  ${isActive ? "min-h" : "min-h"
                      }`}
                  >
                    <div className="h-[425px] relative">
                      <PrimaryImage type="insta" url={dt.image} customClasses={"h-full w-full object-cover"} />
                    </div>
                  </CustomLink>
                );
              })}
              <button
                onClick={() => sliderInstance.current?.prev()}
                className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
              >
                <MdOutlineChevronLeft className="w-[20px] h-[20px]" />
              </button>

              <button
                onClick={() => sliderInstance.current?.next()}
                className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
              >
                <MdOutlineChevronRight className="w-[20px] h-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstagramFeed;
