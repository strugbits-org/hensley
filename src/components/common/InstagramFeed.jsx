"use client";
import React, { useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { PrimaryButton } from "./PrimaryButton";
import SectionTitle from "./SectionTitle";
import "keen-slider/keen-slider.min.css";
import "./style.css";
import { PrimaryImage } from "./PrimaryImage";
import { CustomLink } from "./CustomLink";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

const privateRoutes = [
  "/login",
  "/create-account",
  "/account",
  "/change-password",
  "/quotes-history",
  "/saved-products",
  "/product-sets",
  "/quotes-history",
  "/manage-blogs",
  "/manage-projects",
  "product-sorting"
];

function InstagramFeed({ data, details }) {
  const { instaFeedHeading, instaFeedTitle, instaFeedIcon, instaFeedButtonLabel, instaFeedButtonAction } = details;
  const [isSliderReady, setIsSliderReady] = useState(false);

  const pathname = usePathname();
  const isPrivateRoute = privateRoutes.includes(pathname);
  const sliderInstance = useRef();

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: 4,
        spacing: 4,
      },
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1.5, spacing: 5, origin: "center" },
        },
        "(min-width: 768px) and (max-width: 1024px)": {
          slides: { perView: 3, spacing: 4, origin: "center" },
        },
        "(min-width: 1025px) and (max-width: 1280px)": {
          slides: { perView: 3.5, spacing: 4, origin: "center" },
        },
      },
      created(slider) {
        sliderInstance.current = slider;
        setIsSliderReady(true);
      },
    },
    []
  );

  if (isPrivateRoute) return null;

  return (
    <div className="instagram-feed bg-white">
      <SectionTitle
        text={instaFeedHeading}
        classes={"py-[40px] hidden lg:block border-b border-primary-border"}
      />
      <div className="p-6 ">
        <div className="flex flex-col w-full border">
          <div className="flex lg:flex-row lg:justify-between flex-col justify-center w-full items-center min-h-[130px] border border-b-0 px-8 lg:pt-[30px] pb-[40px] pt-[131px] ">
            <h3 className="lg:hidden block text-secondary-alt text-[55px] max-w-[280px] font-recklessRegular leading-[50px] text-center uppercase">
              {instaFeedHeading}
            </h3>
            <div className="flex lg:flex-row lg:justify-center items-center lg:mt-0 lg:mb-0 mt-3 mb-10 gap-2 lg:gap-4">
              <PrimaryImage type="svg" url={instaFeedIcon} customClasses={"size-[18px] lg:size-[30px]"} />
              <h3 className="text-secondary-alt text-[18px] lg:text-[35px] font-recklessRegular">
                {instaFeedTitle}
              </h3>
            </div>
            <CustomLink to={instaFeedButtonAction}>
              <PrimaryButton className="border border-secondary-alt text-secondary-alt hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
                {instaFeedButtonLabel}
              </PrimaryButton>
            </CustomLink>
          </div>
          <div>
            {!isSliderReady && (
              <div className="w-full h-[300px] flex justify-center items-center">
                <Loading custom type='secondary' />
              </div>
            )}

            <div ref={sliderRef} className={`keen-slider mt-[20px] pb-[85px] ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
              {data.map((dt, index) => {
                return (
                  <CustomLink
                    to={dt.permalink}
                    target={"_blank"}
                    key={index}
                    className={`keen-slider__slide  flex flex-col md:p-[10px]`}
                  >
                    <div className="h-[325px] lg:h-[448px] relative">
                      <PrimaryImage type="insta" url={dt.image} customClasses={"h-full w-full object-cover"} />
                    </div>
                  </CustomLink>
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
      </div>
    </div>
  );
}

export default InstagramFeed;
