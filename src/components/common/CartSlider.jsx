"use client";

import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import Image from "next/image";
import heroImage from "@/assets/Atrium 5-X2.png";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "../../assets/icons/rightArrow.svg";

function cartSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInstance = useRef(null);

  const isMobile = window.innerWidth <= 768;

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: isMobile ? 1 : 2.5,
        spacing: 15,
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

  const data = [
    {
      image: heroImage,
      heading: "OUR CULTURE",
      para: "WITH OUR COMPANY ROOTS ESTABLISHED IN SAN FRANCISCO, THE MULTI-CULTURAL SPIRIT OF THIS CITY IS DEEPLY ENGRAINED IN OUR DNA. WE BELIEVE IN A DIVERSITY OF THOUGHT AND A RICH VARIETY OF VOICES. IT’S WHAT MAKES US STRONGER, MORE CREATIVE, AND ULTIMATELY MORE SUCCESSFUL; INSPIRING EXCITING, INNOVATIVE SOLUTIONS. WE REALIZE, WITH OUR TEAM AND OUR WORK, WE HAVE THE ABILITY TO DELIVER AN EXPERIENCE FOR A GLOBALIST WORLD; ONE THAT RESONATES WITH A WIDER AUDIENCE OF PEOPLE.",
    },
    {
      image: heroImage,
      heading: "INNOVATION",
      para: "WITH OUR COMPANY ROOTS ESTABLISHED IN SAN FRANCISCO, THE MULTI-CULTURAL SPIRIT OF THIS CITY IS DEEPLY ENGRAINED IN OUR DNA. WE BELIEVE IN A DIVERSITY OF THOUGHT AND A RICH VARIETY OF VOICES. IT’S WHAT MAKES US STRONGER, MORE CREATIVE, AND ULTIMATELY MORE SUCCESSFUL; INSPIRING EXCITING, INNOVATIVE SOLUTIONS. WE REALIZE, WITH OUR TEAM AND OUR WORK, WE HAVE THE ABILITY TO DELIVER AN EXPERIENCE FOR A GLOBALIST WORLD; ONE THAT RESONATES WITH A WIDER AUDIENCE OF PEOPLE.",
    },
    {
      image: heroImage,
      heading: "COMMUNITY",
      para: "WITH OUR COMPANY ROOTS ESTABLISHED IN SAN FRANCISCO, THE MULTI-CULTURAL SPIRIT OF THIS CITY IS DEEPLY ENGRAINED IN OUR DNA. WE BELIEVE IN A DIVERSITY OF THOUGHT AND A RICH VARIETY OF VOICES. IT’S WHAT MAKES US STRONGER, MORE CREATIVE, AND ULTIMATELY MORE SUCCESSFUL; INSPIRING EXCITING, INNOVATIVE SOLUTIONS. WE REALIZE, WITH OUR TEAM AND OUR WORK, WE HAVE THE ABILITY TO DELIVER AN EXPERIENCE FOR A GLOBALIST WORLD; ONE THAT RESONATES WITH A WIDER AUDIENCE OF PEOPLE.",
    },
    {
      image: heroImage,
      heading: "GROWTH",
      para: "WITH OUR COMPANY ROOTS ESTABLISHED IN SAN FRANCISCO, THE MULTI-CULTURAL SPIRIT OF THIS CITY IS DEEPLY ENGRAINED IN OUR DNA. WE BELIEVE IN A DIVERSITY OF THOUGHT AND A RICH VARIETY OF VOICES. IT’S WHAT MAKES US STRONGER, MORE CREATIVE, AND ULTIMATELY MORE SUCCESSFUL; INSPIRING EXCITING, INNOVATIVE SOLUTIONS. WE REALIZE, WITH OUR TEAM AND OUR WORK, WE HAVE THE ABILITY TO DELIVER AN EXPERIENCE FOR A GLOBALIST WORLD; ONE THAT RESONATES WITH A WIDER AUDIENCE OF PEOPLE.",
    },
    {
      image: heroImage,
      heading: "INTEGRITY",
      para: "WITH OUR COMPANY ROOTS ESTABLISHED IN SAN FRANCISCO, THE MULTI-CULTURAL SPIRIT OF THIS CITY IS DEEPLY ENGRAINED IN OUR DNA. WE BELIEVE IN A DIVERSITY OF THOUGHT AND A RICH VARIETY OF VOICES. IT’S WHAT MAKES US STRONGER, MORE CREATIVE, AND ULTIMATELY MORE SUCCESSFUL; INSPIRING EXCITING, INNOVATIVE SOLUTIONS. WE REALIZE, WITH OUR TEAM AND OUR WORK, WE HAVE THE ABILITY TO DELIVER AN EXPERIENCE FOR A GLOBALIST WORLD; ONE THAT RESONATES WITH A WIDER AUDIENCE OF PEOPLE.",
    },
  ];

  return (
    <div ref={sliderRef} className="keen-slider mt-[20px] min-h-[750px]">
      {data.map((dt, index) => {
        const isActive = index === currentSlide;

        return (
          <div
            key={index}
            className={`keen-slider__slide border border-white flex flex-col p-[20px]  ${
              isActive ? "h-min" : "h-min"
            }`}
          >
            <div className="lg:min-h-[425px]">
              <Image
                className="h-full w-full object-cover"
                src={dt.image}
                alt={dt.heading}
              />
            </div>
            <div>
              <h3 className="text-[#2C2216] min-w-[313px] text-[70px] md:text-5xl font-recklessLight leading-[60px] mt-[20px] mb-[20px]">
                {dt.heading}
              </h3>
              {isActive ? (
                <>
                  <p className="text-[#2C2216] max-w-[600px] text-[16px] md:text-sm font-haasRegular leading-[20px]">
                    {dt.para}
                  </p>
                </>
              ) : (
                <p className="text-[#2C2216] text-[16px] font-haasRegular w-[600px] leading-[20px]">
                  +SEE MORE
                </p>
              )}
            </div>
          </div>
        );
      })}
      <button
        onClick={() => sliderInstance.current?.prev()}
        className="absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md flex items-center justify-center z-10"
      >
        <Image src={leftArrow} alt="Left Arrow" width={20} height={20} />
      </button>

      <button
        onClick={() => sliderInstance.current?.next()}
        className="absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md flex items-center justify-center z-10"
      >
        <Image src={rightArrow} alt="Right Arrow" width={20} height={20} />
      </button>
    </div>
  );
}

export default cartSlider;
