"use client";

import React, { useState, useRef } from "react";
import instaIcon from "@/assets/icons/newInsta.svg";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { PrimaryButton } from "./PrimaryButton";
import heroImage from "@/assets/Atrium 5-X2.png";
import leftArrow from "@/assets/icons/leftArrow.svg";
import arrow from "@/assets/icons/arrow.svg";
import rightArrow from "../../assets/icons/rightArrow.svg";
import SectionTitle from "./SectionTitle";
import { useMediaQuery } from "@uidotdev/usehooks";
import "keen-slider/keen-slider.min.css";
import "./style.css";

const data = [
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
  { image: heroImage },
];

function InstaFeedback() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInstance = useRef(null);

  // ✅ Use useMediaQuery to replace window.innerWidth checks
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: isMobile ? 1.3 : isTablet ? 2.3 : 4,
        spacing: isMobile ? 5 : isTablet ? 8 : 10,
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
    <>
      <SectionTitle
        text="let's get social"
        classes={"pt-[40px] pb-[40px] hidden lg:flex bg-white "}
      />
      <div className="w-full flex flex-col items-center bg-white p-4">
        <div className="flex flex-col lg:w-[95%] w-full border ">
          <div className="flex lg:flex-row lg:justify-between flex-col justify-center w-full items-center min-h-[130px] border px-8 lg:pt-[30px] pb-[40px] pt-[131px] ">
            <h3 className="lg:hidden block text-[#2C2216] lg:text-[35px] text-[55px] w-[274px] font-recklessRegular leading-[50px] text-center lg:mb-[0px]">
              LET’S GET SOCIAL
            </h3>
            <div className="flex lg:flex-row lg:justify-center items-center lg:mt-0 lg:mb-0 mt-[7px] mb-[40px] ">
              <Image
                src={instaIcon}
                className="mr-2 h-[17px] w-[17px] lg:h-[29px] lg:w-[29px]"
              />
              <h3 className="text-[#2C2216] lg:text-[35px] md:text-[18px] font-recklessRegular">
                STAY CONNECTED FEED
              </h3>
            </div>
            <PrimaryButton className="border border-[#2C2216] text-[#2C2216] hover:bg-[#F0DEA2] hover:text-[#2C2216] max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px] lg:mt-[0px] md:mt-[20px]">
              FOLLOW US
            </PrimaryButton>
          </div>
          <div>
            <div ref={sliderRef} className="keen-slider mt-[20px] ">
              {data.map((dt, index) => {
                const isActive = index === currentSlide;

                return (
                  <div
                    key={index}
                    className={`keen-slider__slide  flex flex-col md:p-[10px]  ${isActive ? "min-h" : "min-h"
                      }`}
                  >
                    <div className="h-[425px] relative">
                      <Image
                        className="h-full w-full object-cover"
                        src={dt.image}
                      />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => sliderInstance.current?.prev()}
                className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
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
                className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
              >
                <Image
                  src={rightArrow}
                  alt="Right Arrow"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InstaFeedback;
