"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import Image from "next/image";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import image1 from "@/assets/DSC07729-X3.png";

const data = [
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE..",
    btnText: "WE CREATE DREAM",
  },
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.",
    btnText: "WE CREATE DREAM",
  },
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.",
    btnText: "WE CREATE DREAM",
  },
];

export default function SliderComponent() {
  const [opacities, setOpacities] = React.useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 640 && window.innerWidth <= 1024;
  const sliderInstance = React.useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: data.length,
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 1.3, spacing: 10, origin: "center" },
      },
      "(max-width: 768px)": {
        slides: { perView: 1.3, spacing: 8, origin: "center" },
      },
    },
    created(s) {
      sliderInstance.current = s;
      setCurrentSlide(s.track.details.rel);
    },
    detailsChanged(s) {
      setCurrentSlide(s.track.details.rel);
      const newOpacities = s.track.details.slides.map((_, i) =>
        i === s.track.details.rel ? 1 : 0
      );
      setOpacities(newOpacities);
    },
  });

  return (
    <>
      <div
        ref={sliderRef}
        className="relative keen-slider h-screen pb-[150px] lg:pb-[0px] lg:block hidden"
      >
        {data.map((dt, idx) => (
          <>
            <div
              key={idx}
              className="keen-slider__slide relative transition-opacity duration-700 ease-in-out "
              style={{
                opacity: !(isTablet || isMobile) && opacities[idx],
                pointerEvents:
                  !(isTablet || isMobile) && opacities[idx] === 1
                    ? "auto"
                    : "none",
              }}
            >
              <Image
                src={dt.image.src}
                className="w-full h-full object-cover"
                width={200}
                height={200}
              />

              <div className="absolute top-1/2 lg:left-[20%] left-[10%] right-[10%] lg:transform -translate-y-1/2  z-10  flex flex-col justify-center items-center lg:block ">
                <h2
                  className="
            text-[25px]
            leading-[22px]
            lg:text-[60px]
            lg:leading-[55px]
            max-w-[340px]
            lg:max-w-[600px]
            lg:text-left
            text-center
             text-white font-recklessLight mb-8"
                >
                  {dt.heading}
                </h2>
                <PrimaryButton className="border border-white text-white hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-4 py-4 hover:[letter-spacing:4px]">
                  {dt.btnText}
                </PrimaryButton>
              </div>

              {/* Arrows */}
              <button
                onClick={() => sliderInstance.current?.prev()}
                className="absolute top-1/2 left-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center hidden z-20 "
              >
                <Image
                  src={leftArrow}
                  alt="Left Arrow"
                  width={20}
                  height={20}
                />
              </button>

              <button
                onClick={() => sliderInstance.current?.next()}
                className="absolute top-1/2 right-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center hidden z-20"
              >
                <Image
                  src={rightArrow}
                  alt="Right Arrow"
                  width={20}
                  height={20}
                />
              </button>
              <span className="lg:block hidden absolute bottom-[48px] left-[48px] text-white font-recklessRegular text-[35px]">
                {currentSlide + 1}/{data.length}
              </span>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
