"use client";

import React, { useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import { PrimaryImage } from "./PrimaryImage";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { CustomLink } from "./CustomLink";
import Loading from "@/app/loading";

export default function SliderComponent({
  data = [],
  classes = "",
  pageDetails = {},
  loop = false,
}) {
  const sliderData = Array.isArray(data) ? data : [];
  const { ourProjectsTitle } = pageDetails ?? {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const sliderInstance = useRef(null);

  const [sliderRef] = useKeenSlider({
    slides: { perView: 1, spacing: 10 },
    loop,
    breakpoints: {
      "(max-width: 1024px)": {
        slides: {
          perView: sliderData.length > 1 ? 1.3 : 1,
          spacing: 10,
          origin: "center",
        },
      },
      "(max-width: 768px)": {
        slides: {
          perView: sliderData.length > 1 ? 1.3 : 1,
          spacing: 8,
          origin: "center",
        },
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

  if (sliderData.length === 0) return null;

  return (
    <>
      {!isSliderReady && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loading custom type="secondary" />
        </div>
      )}
      <div className={`w-full relative ${classes}`}>
        <div
          ref={sliderRef}
          className={`relative keen-slider h-screen py-20 lg:py-[0px] ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}
        >
          {sliderData.map((slide, index) => {
            const { portfolioRef, titleAndDescription, image } = slide;

            // Compute fallback title from titleAndDescription
            const rawTitle = titleAndDescription?.split("~")[0] || "";
            const maxLength = 85;
            const displayedTitle =
              rawTitle.length > maxLength ?
                rawTitle.slice(0, maxLength).trim() + "..."
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
                  size="tablet"
                  type="alternate"
                  customClasses="size-full object-cover brightness-50"
                />

                <div className="absolute top-1/2 lg:left-[20%] left-[10%] right-[10%] lg:transform -translate-y-1/2 z-10 flex flex-col justify-center items-center lg:block">
                  <h2 className="text-[25px] leading-[22px] lg:text-[60px] lg:leading-[55px] 3xl:text-[100px] 3xl:leading-[92px] max-w-[340px] lg:max-w-[600px] 3xl:max-w-[1000px] lg:text-left text-center text-white font-recklessLight mb-8 3xl:mb-14">
                    {portfolioRef?.title || displayedTitle}
                  </h2>
                  <CustomLink
                    to={`/project/${portfolioRef?.slug || slide?.slug}`}
                  >
                    <PrimaryButton className="border border-white text-white hover:bg-primary hover:text-secondary-alt max-h-[60px] 3xl:max-h-[90px] max-w-[280px] 3xl:max-w-[420px] px-4 py-4 3xl:px-6 3xl:py-6 hover:[letter-spacing:4px]">
                      {ourProjectsTitle}
                    </PrimaryButton>
                  </CustomLink>
                </div>

                {/* Arrows */}
                {sliderData.length >= 4 && (
                  <>
                    {(loop || currentSlide?.rel > 0) && (
                      <button
                        onClick={() => sliderInstance.current?.prev()}
                        className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                      >
                        <BsChevronLeft className="w-[20px] h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                      </button>
                    )}

                    {(loop || currentSlide?.rel !== currentSlide?.maxIdx) && (
                      <button
                        onClick={() => sliderInstance.current?.next()}
                        className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                      >
                        <BsChevronRight className="w-[20px] h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                      </button>
                    )}
                  </>
                )}

                <span className="lg:block hidden absolute bottom-[48px] left-[48px] 3xl:bottom-[72px] 3xl:left-[72px] text-white font-recklessRegular text-[35px] 3xl:text-[56px]">
                  {(currentSlide?.rel ?? 0) + 1}/{sliderData.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
