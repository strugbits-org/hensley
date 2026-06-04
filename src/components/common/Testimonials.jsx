"use client";
import React, { useRef, useState } from "react";
import SectionTitle from "../common/SectionTitle";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { useKeenSlider } from "keen-slider/react";
import { TestimonialCard } from "./TestimonialCard";
import Loading from "@/components/common/Loading";

export const Testimonials = ({
  data,
  pageDetails,
  lgPreview = 1.4,
  cardClasses,
  sliderClasses,
  imageExp = true,
  titleClass = "",
}) => {
  const sliderInstance = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderReady, setIsSliderReady] = useState(false);

  if (!data?.length) return null;

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      slides: { perView: 1, spacing: 16 },
      breakpoints: {
        // Origin shifted to 0 (left-aligned) to prevent centering gaps
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 20, origin: 0 },
        },
        "(min-width: 1024px)": {
          slides: { perView: lgPreview, spacing: 24, origin: 0 },
        },
      },
      created(slider) {
        sliderInstance.current = slider;
        setIsSliderReady(true);
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [],
  );

  return (
    <div className="w-full mb-20 relative z-0">
      <div className="sm:px-0 px-[12px] pt-12 pb-6 flex items-center flex-col">
        <SectionTitle
          text={data[0]?.sectionTitle || "what people say"}
          classes="py-[20px] lg:!mt-0"
        />
      </div>
      <div className="p-6 border-t border-b border-primary-border">
        {!isSliderReady && (
          <div className="w-full h-[300px] flex justify-center items-center">
            <Loading custom type="secondary" />
          </div>
        )}
        <div
          ref={sliderRef}
          className={`${sliderClasses} keen-slider lg:pl-32 ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}
        >
          {data.map((testimonial, index) => {
            return (
              <div
                key={index}
                className="keen-slider__slide flex justify-center items-start lg:items-stretch h-auto transition-[opacity] duration-300 ease-in-out"
              >
                <TestimonialCard
                  imageExp={imageExp}
                  data={testimonial}
                  classes={`w-full h-full ${cardClasses}`}
                  titleClass={titleClass}
                />
              </div>
            );
          })}

          <button
            onClick={() => sliderInstance.current?.prev()}
            className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
          >
            <MdOutlineChevronLeft className="w-[20px] h-[20px]" />
          </button>

          <button
            onClick={() => sliderInstance.current?.next()}
            className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
          >
            <MdOutlineChevronRight className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
