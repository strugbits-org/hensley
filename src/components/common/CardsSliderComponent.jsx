"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

// Tablet version
function TabletCardsSlider({ data, cardCss }) {
  const sliderInstance = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: data.length,
      defaultAnimation: {
        duration: 2000,
      },
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
          loop: true,
          slides: { perView: 2.5, spacing: 15 },
        },
      },
      created(slider) {
        sliderInstance.current = slider;
      },
      slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
    },
    []
  );


  const isBeforeActive = (index) => {
    if (currentSlide === 0) {
      return index === data.length - 1; // Last slide is before the first one in loop mode
    }
    return index === currentSlide - 1;
  };

  return (
    <div
      ref={sliderRef}
      className="lg:pl-[100px]  keen-slider mt-[30px] md:min-h-[850px] pb-[70px]"
    >
      {data.map((slide, index) => {
        return (
          <div
            key={index}
            className={`${cardCss}  group keen-slider__slide border border-white flex flex-col p-[20px] sm:min-h-[680px] ${isBeforeActive(index) ? "invisible" : ""} `}
          >
            <div className="h-[425px] relative overflow-hidden">
              <PrimaryImage url={slide.image} customClasses={"h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"} alt={slide.heading} />
              {/* <PrimaryImage
                url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"}
                alt="Arrow"
                customClasses="h-auto w-[34px] lg:!block sm:block hidden absolute bottom-4 left-4
                group-hover:h-[calc(100%-40px)]
                group-hover:w-auto
                transition-all duration-300 ease-in-out
                "
              /> */}
              <div className="arrow block ">
                <PrimaryImage
                  url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"}
                  alt="Arrow"
                  customClasses="group-hover:invisible absolute left-6 bottom-8 h-[20px] w-[20px] xl:h-[34px] xl:w-[34px] 
                   lg:group-hover:h-full
                   lg:group-hover:w-auto
                    transition-[height] transition-[width] duration-300 ease-in-out"
                />
                <PrimaryImage
                  url={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                  alt="Arrow"
                  customClasses="invisible group-hover:visible absolute left-6 bottom-8 h-[20px] w-[20px] xl:h-[34px] xl:w-[34px] 
                  lg:group-hover:h-[90%]
                   lg:group-hover:w-auto transition-[height] transition-[width] duration-300 ease-in-out"
                />
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
      <button
        onClick={() => sliderInstance.current?.prev()}
        className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
      >
        <MdOutlineChevronLeft className="size-[20px]" />
      </button>
      <button
        onClick={() => sliderInstance.current?.next()}
        className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
      >
        <MdOutlineChevronRight className="size-[20px]" />
      </button>
    </div>
  );
}

// Normal version
function NormalCardsSlider({ data, cardCss }) {
  const [currentSlide, setCurrentSlide] = useState(0);
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
          loop: true,
          slides: { perView: 2.5, spacing: 15, origin: "center" },
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

  return (
    <div
      ref={sliderRef}
      className="keen-slider mt-[30px] md:min-h-[850px] pb-[70px]"
    >
      {data.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`${cardCss} keen-slider__slide border border-white flex flex-col p-[20px] sm:min-h-[680px] lg:h-min`}
          >
            <div className="h-[425px] relative">
              <PrimaryImage url={slide.image} customClasses={"h-full w-full object-cover"} alt={slide.heading} />
              <PrimaryImage
                url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"}
                alt="Arrow"
                customClasses="size-10 lg:hidden md:block sm:block hidden absolute bottom-4 left-4
                
                "
              />
            </div>
            <div>
              <h3 className="text-secondary-alt text-[25px] leading-[22px] lg:text-[50px] lg:leading-[40px] xl:text-[70px] xl:leading-[60px] lg:max-w-[139px] md:text-5xl font-recklessRegular mt-[20px] mb-[20px]">
                {slide.title}
              </h3>
              {isActive ? (
                <p className="text-secondary-alt max-w-[600px] text-[14px] leading-[18px] lg:text-[16px] lg:leading-[20px] md:text-sm font-haasRegular lg:mt-[24px]">
                  {slide.description}
                </p>
              ) : (
                <>
                  <p className="lg:block hidden text-secondary-alt text-[16px] font-haasRegular w-[600px] leading-[20px]">
                    +SEE MORE
                  </p>
                  <p className="lg:hidden text-secondary-alt text-[16px] font-haasRegular w-[600px] leading-[20px]">
                    {slide.description}
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
        <MdOutlineChevronLeft className="size-[20px]" />
      </button>
      <button
        onClick={() => sliderInstance.current?.next()}
        className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
      >
        <MdOutlineChevronRight className="size-[20px]" />
      </button>
    </div>
  );
}

// Main component
function CardsSliderComponent({ data, display = false, tablet = false, cardCss }) {
  return (
    <>
      {!display && (
        <h3 className="uppercase font-recklessRegular sm:text-[65px] sm:leading-[50px] text-[55px] leading-[50px] text-[#2C2216 sm:w-full  text-center pt-[128px] pb-[40px] lg:hidden block">
          how we
          <span className="inline sm:hidden">
            <br />
          </span>{" "}
          do it
        </h3>
      )}
      {tablet ? (
        <TabletCardsSlider data={data} cardCss={cardCss} />
      ) : (
        <NormalCardsSlider data={data} cardCss={cardCss} />
      )}
    </>
  );
}

export default CardsSliderComponent;
