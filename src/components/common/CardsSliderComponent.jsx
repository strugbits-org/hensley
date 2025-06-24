"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import Loading from "@/app/loading";

export const CardsSlider = ({ data, cardCss, loop = false }) => {
  const sliderInstance = useRef(null);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider(
    {
      loop,
      defaultAnimation: {
        duration: 2000,
      },
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1.1, spacing: 15 },
        },
        "(min-width: 769px) and (max-width: 1024px)": {
          slides: { perView: 1.5, spacing: 15 },
        },
        "(min-width: 1025px)": {
          slides: { perView: 3, spacing: 30 },
        },
      },
      created(slider) {
        sliderInstance.current = slider;
        setIsSliderReady(true);
      },
      detailsChanged(slider) {
        setCurrentSlide(slider.track.details);
      },
    },
    []
  );

  return (
    <div className='w-full lg:px-10'>
      {!isSliderReady && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loading custom type='secondary' />
        </div>
      )}
      <div
        ref={sliderRef}
        className={`keen-slider mt-[30px] md:min-h-[850px] pb-[70px] ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}
      >
        {data.map((slide, index) => {
          return (
            <div
              key={index}
              className={`${cardCss} group max-w-[596px] w-full group keen-slider__slide border border-white flex flex-col p-[20px] sm:min-h-[680px]`}
            >
              <div className="h-[425px] relative overflow-hidden">
                <PrimaryImage url={slide.image} customClasses={"h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"} alt={slide.heading} />
                <div className="hidden lg:block ">
                  <PrimaryImage url={"https://static.wixstatic.com/shapes/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"} alt={"Arrow"} customClasses="absolute fill-primary-alt left-5 bottom-5 w-[34px] h-[34px] transition-all duration-500 ease-in-out group-hover:w-[90%] group-hover:h-[90%]" />
                  <PrimaryImage url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"} alt={"Arrow"} customClasses="absolute fill-primary-alt left-5 bottom-5 w-[34px] h-[34px] group-hover:invisible" />
                </div>
              </div>
              <div>
                <h3 className="text-secondary-alt text-[25px] leading-[35px] lg:text-[35px] lg:leading-[35px] lg:max-w-[139px] font-recklessRegular mt-[20px] mb-[20px] !max-w-none uppercase">
                  {slide.title}
                </h3>
                <p className="text-secondary-alt max-w-[600px] text-[14px] leading-[18px] lg:text-[16px] lg:leading-[20px] md:text-sm font-haasRegular lg:mt-[24px] uppercase">
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}
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
      </div>
    </div>
  );
}