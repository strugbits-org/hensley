"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import { PrimaryImage } from "./PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { CustomLink } from "./CustomLink";

export default function SliderComponent({ data, classes, pageDetails }) {

  const { buttonLabelPortfolioSlider } = pageDetails;

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInstance = React.useRef(null);

  const [sliderRef] = useKeenSlider({
    slides: data.length,
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: data.length > 1 ? 1.3 : 1, spacing: 10, origin: "center" },
      },
      "(max-width: 768px)": {
        loop: true,
        slides: { perView: data.length > 1 ? 1.3 : 1, spacing: 8, origin: "center" },
      },
    },
    created(s) {
      sliderInstance.current = s;
      setCurrentSlide(s.track.details.rel);
    },
    detailsChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <div className={classes}>
      <div
        ref={sliderRef}
        className="relative keen-slider h-screen py-20 lg:py-[0px] lg:block hidden"
      >
        {data.map((slide, index) => {
          const { portfolioRef, titleAndDescription, image } = slide;

          // Compute fallback title from titleAndDescription
          const rawTitle = titleAndDescription?.split("~")[0] || "";
          const maxLength = 85;
          const displayedTitle = rawTitle.length > maxLength
            ? rawTitle.slice(0, maxLength).trim() + "..."
            : rawTitle;

          return (
            <div
              key={index}
              className="keen-slider__slide relative transition-opacity duration-700 ease-in-out"
            >
              <PrimaryImage
                useNextImage={true}
                q={60}
                url={portfolioRef?.coverImage?.imageInfo || image}
                type="alternate"
                customClasses="size-full object-cover brightness-50"
              />

              <div className="absolute top-1/2 lg:left-[20%] left-[10%] right-[10%] lg:transform -translate-y-1/2 z-10 flex flex-col justify-center items-center lg:block">
                <h2 className="text-[25px] leading-[22px] lg:text-[60px] lg:leading-[55px] max-w-[340px] lg:max-w-[600px] lg:text-left text-center text-white font-recklessLight mb-8">
                  {portfolioRef?.title || displayedTitle}
                </h2>
                <CustomLink to={`/project/${portfolioRef?.slug || slide?.slug}`}>
                  <PrimaryButton className="border border-white text-white hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-4 py-4 hover:[letter-spacing:4px]">
                    {buttonLabelPortfolioSlider}
                  </PrimaryButton>
                </CustomLink>
              </div>

              {/* Arrows */}
              <button
                onClick={() => sliderInstance.current?.prev()}
                className="hover:border border-black absolute top-1/2 left-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center hidden z-20"
              >
                {/* <MdOutlineChevronLeft className="size-[20px]" /> */}
                <svg
                  className="scale-x-[-1]"
                  data-bbox="0.354 0.352 8.156 16.312"
                  viewBox="0 0 9.217 17.019"
                  height="17.019"
                  width="9.217"
                  xmlns="http://www.w3.org/2000/svg"
                  data-type="ugc"
                >
                  <g>
                    <path stroke="#2c2216" fill="none" d="M.354.352 8.51 8.508.354 16.664"></path>
                  </g>
                </svg>

              </button>

              <button
                onClick={() => sliderInstance.current?.next()}
                className={`absolute top-1/2 right-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full ${currentSlide == data.length - 1 ? 'bg-[#D3D3D3]' : 'bg-white hover:border border-black'} shadow-md lg:flex items-center justify-center hidden z-20`}
              >
                {/* <MdOutlineChevronRight className="size-[20px]" /> */}
                <svg data-bbox="0.354 0.352 8.156 16.312" viewBox="0 0 9.217 17.019" height="17.019" width="9.217" xmlns="http://www.w3.org/2000/svg" data-type="ugc">
                  <g>
                    <path stroke="#2c2216" fill="none" d="M.354.352 8.51 8.508.354 16.664"></path>
                  </g>
                </svg>
              </button>

              <span className="lg:block hidden absolute bottom-[48px] left-[48px] text-white font-recklessRegular text-[35px]">
                {currentSlide + 1}/{data.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
