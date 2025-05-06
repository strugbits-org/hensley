"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import Image from "next/image";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";

const images = [
  "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590004987778-bece5c9adab6?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
  "https://images.unsplash.com/photo-1590005176489-db2e714711fc?ixlib=rb-1.2.1&auto=format&fit=crop&h=500&w=800&q=80",
];

export default function SliderComponent() {
  const [opacities, setOpacities] = React.useState([]);
  const sliderInstance = React.useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: images.length,
    created(s) {
      sliderInstance.current = s;
    },
    detailsChanged(s) {
      const newOpacities = s.track.details.slides.map((_, i) =>
        i === s.track.details.rel ? 1 : 0
      );
      setOpacities(newOpacities);
    },
  });

  return (
    <div ref={sliderRef} className="relative keen-slider h-[600px]">
      {images.map((src, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative transition-opacity duration-700 ease-in-out"
          style={{
            opacity: opacities[idx],
            pointerEvents: opacities[idx] === 1 ? "auto" : "none",
          }}
        >
          <img src={src} className="w-full h-full object-cover" />

          {/* Centered Content */}
          <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2 z-10">
            <h2 className="text-[32px] md:text-[60px] sm:text-[35px] max-w-[340px] md:max-w-[600px] leading-tight text-white font-recklessLight mb-8">
              EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.
            </h2>
            <PrimaryButton className="border border-white text-white hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
              WE CREATE DREAM
            </PrimaryButton>
          </div>

          {/* Arrows */}
          <button
            onClick={() => sliderInstance.current?.prev()}
            className="absolute top-1/2 left-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md flex items-center justify-center z-20"
          >
            <Image src={leftArrow} alt="Left Arrow" width={20} height={20} />
          </button>

          <button
            onClick={() => sliderInstance.current?.next()}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full bg-white shadow-md flex items-center justify-center z-20"
          >
            <Image src={rightArrow} alt="Right Arrow" width={20} height={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
