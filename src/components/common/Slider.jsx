"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryButton } from "./PrimaryButton";
import Image from "next/image";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import image1 from '@/assets/DSC07729-X3.png'

const data = [
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.",
    btnText:"WE CREATE DREAM"
  },
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.",
    btnText:"WE CREATE DREAM"
  },
  {
    image: image1,
    heading: "EACH PROJECT IS UNIQUE, EACH WEDDING IS UNIQUE.",
    btnText:"WE CREATE DREAM"
  }
]

export default function SliderComponent() {
  const [opacities, setOpacities] = React.useState([]);
  const sliderInstance = React.useRef(null);


  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: data.length,
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
    <div ref={sliderRef} className="relative keen-slider h-screen pb-[150px] lg:pb-[0px]">
      {data.map((dt, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative transition-opacity duration-700 ease-in-out"
          style={{
            opacity: opacities[idx],
            pointerEvents: opacities[idx] === 1 ? "auto" : "none",
          }}
        >
          <Image src={dt.image.src} className="w-full h-full object-cover" width={200} height={200}/>

          <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2 z-10">
            <h2 className="text-[32px] md:text-[60px] sm:text-[35px] max-w-[340px] md:max-w-[600px] leading-tight text-white font-recklessLight mb-8">
              
              {dt.heading}
            </h2>
            <PrimaryButton className="border border-white text-white hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-4 py-4 hover:[letter-spacing:4px]">
              {dt.btnText}
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
