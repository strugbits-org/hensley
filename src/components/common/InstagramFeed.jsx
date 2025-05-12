"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import { PrimaryButton } from "./PrimaryButton";
import heroImage from "@/assets/Atrium 5-X2.png";
import SectionTitle from "./SectionTitle";
import { useMediaQuery } from "@uidotdev/usehooks";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { CustomLink } from "./CustomLink";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

const data = [
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
];

function InstagramFeed({ data, details }) {
  const { instaFeedHeading, instaFeedTitle, instaFeedIcon, instaFeedButtonLabel, instaFeedButtonAction } = details;

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInstance = useRef(null);

  // ✅ Use useMediaQuery to replace window.innerWidth checks
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
    <>
      <SectionTitle
        text={instaFeedHeading}
        classes={"pt-[40px] pb-[40px] hidden lg:flex bg-white "}
      />
      <div className="w-full flex flex-col items-center bg-white p-4">
        <div className="flex flex-col lg:w-[95%] w-full border ">
          <div className="flex lg:flex-row lg:justify-between flex-col justify-center w-full items-center min-h-[130px] border px-8 lg:pt-[30px] pb-[40px] pt-[131px] ">
            <h3 className="lg:hidden block text-[#2C2216] lg:text-[35px] text-[55px] w-[274px] font-recklessRegular leading-[50px] text-center lg:mb-[0px] uppercase">
              {instaFeedHeading}
            </h3>
            <div className="flex lg:flex-row lg:justify-center items-center lg:mt-0 lg:mb-0 mt-[7px] mb-[40px] ">
              <PrimaryImage type="svg" url={instaFeedIcon} customClasses={"mr-4 w-[40px] h-[40px]"} />
              <h3 className="text-[#2C2216] lg:text-[35px] md:text-[18px] font-recklessRegular">
                {instaFeedTitle}
              </h3>
            </div>
            <CustomLink to={instaFeedButtonAction}>
              <PrimaryButton className="border border-[#2C2216] text-[#2C2216] hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px] lg:mt-[0px] md:mt-[20px]">
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
    </>
  );
}

export default InstagramFeed;
