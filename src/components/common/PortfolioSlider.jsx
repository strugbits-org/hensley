"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import Image from "next/image";
import heroImage from "@/assets/Atrium 5-X2.png";
import leftArrow from "@/assets/icons/leftArrow.svg";
import arrow from "@/assets/icons/arrow.svg";
import rightArrow from "../../assets/icons/rightArrow.svg";
import { PrimaryImage } from "./PrimaryImage";

function PortfolioSlider({ data, display, tab = false, cardCss }) {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedSlide, setExpandedSlide] = useState(null);
  const sliderInstance = useRef(null);

  const [sliderRef] = useKeenSlider(
    {
      mode: "free-snap",

      breakpoints: {
        "(max-width: 768px)": {
          loop: true,
          slides: { perView: 1.3, spacing: 15, origin: "center" },
        },
        "(min-width: 769px) and (max-width: 1024px)": {
          loop: true,
          slides: { perView: 1.5, spacing: 15, origin: "auto" },
        },
        "(min-width: 1025px)": {
          loop: tab ? false : true,
          slides: { perView: 2.5, spacing: 15, origin: tab ? 'auto' : 'center' },
        },
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

  const handleSeeMore = (index) => {
    setExpandedSlide(index);
    setTimeout(() => {
      sliderInstance.current?.next();
    }); 
  };



  return (
    <>
     <h3 className="uppercase font-recklessRegular sm:text-[65px] sm:leading-[50px] text-[55px] leading-[50px] text-[#2C2216 sm:w-full  text-center pt-[128px] pb-[40px] lg:hidden block">
        how we
        <span className="inline sm:hidden">
          <br />
        </span>{" "}
        do it
      </h3>
      <div
        ref={sliderRef}
        className={` ${tab && 'lg:pl-[100px]'} keen-slider mt-[30px] md:min-h-[850px] pb-[70px]`}
      >
        {data.map((dt, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={index}
              className={`${cardCss} cursor-pointer keen-slider__slide border border-white flex flex-col p-[20px] 
    sm:min-h-[680px] ${tab || 'lg:h-min'}`}
            >

              <div className="h-[425px] relative">

                <PrimaryImage timeout={0} url={dt.image} customClasses={"h-full w-full object-cover "} />

                <Image
                  src={arrow}
                  alt="Arrow"
                  className={`lg:hidden md:block ${tab ? 'lg:!block' : ''} sm:block hidden absolute bottom-3 left-2`}
                />
              </div>
              <div>
                <h3 className="text-secondary-alt text-[25px] leading-[22px] lg:text-[50px] lg:leading-[40px] xl:text-[70px] xl:leading-[60px] lg:max-w-[139px] md:text-5xl font-recklessRegular mt-[20px] mb-[20px]">
                  {dt.title}
                </h3>
                {isActive ? (
                  <p className="uppercase text-secondary-alt max-w-[600px] text-[14px] leading-[18px] lg:text-[16px] lg:leading-[20px] md:text-sm font-haasRegular lg:mt-[24px]">
                    {dt.content}
                  </p>
                ) : (
                  <>
                    <p onClick={()=>{handleSeeMore(index)}} className="lg:block hidden text-secondary-alt text-[16px] font-haasRegular w-[600px] leading-[20px]">
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
        <button
          onClick={() => sliderInstance.current?.prev()}
          className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
        >
          <Image src={leftArrow} alt="Left Arrow" width={20} height={20} />
        </button>

        <button
          onClick={() => sliderInstance.current?.next()}
          className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
        >
          <Image src={rightArrow} alt="Right Arrow" width={20} height={20} />
        </button>
      </div>
    </>
  );
}

export default PortfolioSlider;
