"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryImage } from "../common/PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { CustomLink } from "../common/CustomLink";
import SectionTitle from "../common/SectionTitle";
import Loading from "@/app/loading";

export default function OurProjects({ data, pageDetails }) {
  const { ourProjectsTitle } = pageDetails;
  const [isSliderReady, setIsSliderReady] = useState(false);

  const sliderInstance = React.useRef();

  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: data.length,
    defaultAnimation: {
      duration: 2000,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 1.2, spacing: 10, origin: "center" },
      },
      "(min-width: 1024px)": {
        slides: { perView: data.length === 1 ? 1 : 1.1, spacing: 0, },
      },
    },
    created(s) {
      sliderInstance.current = s;
      setIsSliderReady(true);
    },
  });

  return (
    <div className="mb-20 md:mb-40 lg:mb-0">
      <div className='w-full sm:px-0 px-[12px]'>
        <SectionTitle text={ourProjectsTitle} classes="py-[40px] md:mt-6 lg:mt-0" />
      </div>
      {!isSliderReady && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loading custom type='secondary' />
        </div>
      )}

      <div
        ref={sliderRef}
        className={`relative keen-slider h-screen ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}
      >
        {data.map((item, index) => {
          const { portfolioRef } = item;
          return (
            <div key={index} className="keen-slider__slide relative group">
              <PrimaryImage useNextImage={true} q={60} url={portfolioRef.coverImage.imageInfo} type={"alternate"} customClasses="size-full object-cover" />
              <CustomLink to={`/project/${portfolioRef.slug}`} className="absolute inset-0 flex justify-end pt-40 md:pt-20 lg:pt-64 lg:pb-24 px-6 lg:px-24">
                <div className="flex justify-center md:justify-end w-full flex-shrink-0 gap-2">
                  <div>
                    <PrimaryImage
                      url={"https://static.wixstatic.com/shapes/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"}
                      alt={portfolioRef.title}
                      customClasses="hidden md:block fill-primary-alt h-[132px] transition-all duration-500 ease-in-out lg:group-hover:w-full lg:group-hover:h-full"
                    />
                  </div>
                  <h2
                    className="w-full md:w-auto md:max-w-[150px] lg:max-w-[200px] text-[18px] lg:text-[24px] leading-[22px] md:leading-[18px] lg:leading-[30px] uppercase text-center md:text-end text-white font-haasRegular"
                  >
                    {portfolioRef.title}
                  </h2>

                </div>
              </CustomLink>

            </div>
          );
        })}
        {/* Arrows */}
        <button
          onClick={() => sliderInstance.current?.prev()}
          className="absolute top-1/2 left-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center hidden z-20 "
        >
          <MdOutlineChevronLeft className="size-[20px]" />
        </button>

        <button
          onClick={() => sliderInstance.current?.next()}
          className="absolute top-1/2 right-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center hidden z-20"
        >
          <MdOutlineChevronRight className="size-[20px]" />
        </button>
      </div>
    </div>
  );
}
