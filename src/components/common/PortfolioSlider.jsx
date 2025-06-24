"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import Loading from "@/app/loading";

function PortfolioSlider({ data, tab = false, cardCss, loop = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const sliderInstance = useRef(null);

  const [sliderRef] = useKeenSlider(
    {
      mode: "free-snap",
      loop,
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1.3, spacing: 15, origin: "center" },
        },
        "(min-width: 769px) and (max-width: 1024px)": {
          slides: { perView: 1.5, spacing: 15, origin: "auto" },
        },
        "(min-width: 1025px)": {
          loop: tab ? false : loop,
          slides: { perView: 2.5, spacing: 15, origin: tab ? 'auto' : 'center' },
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

  const handleSeeMore = (index) => {
    setTimeout(() => {
      sliderInstance.current?.moveToIdx(index);
    });
  };

  console.log("currentSlide", currentSlide);
  

  if (!data || data.length === 0) return null;

  return (
    <>
      <h3 className="uppercase font-recklessRegular sm:text-[65px] sm:leading-[50px] text-[55px] leading-[50px] text-[#2C2216 sm:w-full  text-center pt-[128px] pb-[40px] lg:hidden block">
        how we
        <span className="inline sm:hidden">
          <br />
        </span>{" "}
        do it
      </h3>
      {!isSliderReady && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loading custom type='secondary' />
        </div>
      )}
      <div ref={sliderRef} className={` ${tab && 'lg:pl-[100px]'} keen-slider mt-[30px] md:min-h-[850px] pb-[70px] ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
        {data.map((dt, index) => {
          const isActive = index === currentSlide?.rel;

          return (
            <div onClick={() => { handleSeeMore(index) }} key={index} className={`${cardCss} cursor-pointer keen-slider__slide border border-white flex flex-col p-[20px] sm:min-h-[680px] ${tab || 'lg:h-min'}`}>
              <div className="h-[425px] relative">
                <PrimaryImage timeout={0} url={dt.image} customClasses={"h-full w-full object-cover "} />
              </div>
              <div>
                <h3 className="uppercase text-secondary-alt text-[25px] leading-[22px] lg:text-[50px] lg:leading-[40px] xl:text-[70px] xl:leading-[60px] lg:max-w-[139px] md:text-5xl font-recklessRegular mt-[20px] mb-[20px]">
                  {dt.title}
                </h3>
                {isActive ? (
                  <p className="uppercase text-secondary-alt max-w-[600px] text-[14px] leading-[18px] lg:text-[16px] lg:leading-[20px] md:text-sm font-haasRegular lg:mt-[24px]">
                    {dt.content}
                  </p>
                ) : (
                  <>
                    <p className="lg:block hidden text-secondary-alt text-[16px] font-haasRegular w-[600px] leading-[20px]">
                      {tab ? dt.content : "+SEE MORE"}
                    </p>
                    <p className="uppercase lg:hidden text-secondary-alt text-[16px] font-haasRegular w-[600px] leading-[20px]">
                      {dt.content}
                    </p>
                  </>
                )}
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
    </>
  );
}

export default PortfolioSlider;
