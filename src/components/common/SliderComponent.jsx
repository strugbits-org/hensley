"use client";

import React, { useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import { PrimaryImage } from "./PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { CustomLink } from "./CustomLink";
import Loading from "@/app/loading";

export default function SliderComponent({ data, classes, pageDetails, loop = false }) {

  const { buttonLabelPortfolioSlider } = pageDetails;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const sliderInstance = useRef(null);

  const [sliderRef] = useKeenSlider({
    slides: { perView: 1, spacing: 10 },
    loop,
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: data.length > 1 ? 1.3 : 1, spacing: 10, origin: "center" },
      },
      "(max-width: 768px)": {
        slides: { perView: data.length > 1 ? 1.3 : 1, spacing: 8, origin: "center" },
      },
    },
    created(s) {
      sliderInstance.current = s;
      setCurrentSlide(s.track.details);
      setIsSliderReady(true);
    },
    detailsChanged(s) {
      setCurrentSlide(s.track.details);
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <>
      {!isSliderReady && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loading custom type='secondary' />
        </div>
      )}
      <div className={`w-full relative ${classes}`}>
        <div
          ref={sliderRef}
          className={`relative keen-slider h-screen py-20 lg:py-[0px] ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}
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
                {(data.length >= 4) && (
                  <>
                    {(loop || currentSlide?.rel > 0) && <button
                      onClick={() => sliderInstance.current?.prev()}
                      className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                    >
                      <MdOutlineChevronLeft className="w-[20px] h-[20px]" />
                    </button>}

                    {(loop || currentSlide?.rel !== currentSlide?.maxIdx) && <button
                      onClick={() => sliderInstance.current?.next()}
                      className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                    >
                      <MdOutlineChevronRight className="w-[20px] h-[20px]" />
                    </button>}
                  </>
                )}

                <span className="lg:block hidden absolute bottom-[48px] left-[48px] text-white font-recklessRegular text-[35px]">
                  {currentSlide?.rel + 1}/{data.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
