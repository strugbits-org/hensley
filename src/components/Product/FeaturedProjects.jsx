"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryImage } from "../common/PrimaryImage";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { CustomLink } from "../common/CustomLink";
import SectionTitle from "../common/SectionTitle";
import Loading from "@/app/loading";

export const FeaturedProjects = ({ data, pageDetails, loop = true, classes }) => {

    const { featuredProjectTitle } = pageDetails;

    const sliderInstance = React.useRef();
    const [isSliderReady, setIsSliderReady] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef] = useKeenSlider({
        loop,
        defaultAnimation: {
            duration: 2000,
        },
        breakpoints: {
            "(max-width: 1024px)": {
                slides: { perView: 1.2, spacing: 10, origin: "center" },
            },
            "(min-width: 1024px)": {
                slides: { perView: data.length === 1 ? 1 : 1.2, spacing: 10, },
            },
        },
        created(slider) {
            sliderInstance.current = slider;
            setIsSliderReady(true);
        },
        detailsChanged(slider) {
            setCurrentSlide(slider.track.details);
        },
    });

    if (!data || data.length === 0) return null;

    return (
        <div className={`w-full py-20 bg-primary lg:py-6 ${classes}`}>
            <div className='sm:px-0 px-[12px] flex items-center flex-col '>
                <SectionTitle text={featuredProjectTitle} classes="lg:!text-[60px] sm:!text-[55px] sm:!leading-[50px] lg:!py-[50px] !text-[35px] !leading-[30px] max-sm:!pt-[120px] " />
            </div>
            {!isSliderReady && (
                <div className="w-full h-[300px] flex justify-center items-center">
                    <Loading custom type='secondary' />
                </div>
            )}
            <div ref={sliderRef} className={`mt-[21px] relative keen-slider h-screen ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
                {data.map((item, index) => {
                    const { portfolioRef } = item;
                    return (
                        <div key={index} className="keen-slider__slide relative group">
                            <PrimaryImage useNextImage={true} q={60} url={portfolioRef.coverImage.imageInfo} type={"alternate"} customClasses="size-full object-cover" />
                            <CustomLink to={`/project/${portfolioRef.slug}`} className="absolute inset-0 flex justify-end pt-40 md:pt-20 lg:pt-64 lg:pb-24 px-6 lg:px-24">
                                <div className="flex justify-center md:justify-end w-full flex-shrink-0 gap-2">
                                    <div>
                                        <PrimaryImage
                                            url={"https://static.wixstatic.com/shapes/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"}
                                            alt={portfolioRef.title}
                                            customClasses="hidden md:block fill-primary-alt h-[132px] transition-all duration-500 ease-in-out lg:group-hover:w-full lg:group-hover:h-full"
                                        />
                                    </div>
                                    <h2
                                        className="w-full md:w-auto md:max-w-[150px] lg:max-w-[200px] text-[18px] lg:text-[24px] leading-[22px] md:leading-[18px] lg:leading-[30px] uppercase text-center md:text-end text-white font-haasRegular"
                                    >
                                        {portfolioRef.title}
                                    </h2>

                                </div>
                            </CustomLink>

                        </div>
                    );
                })}
                {/* Arrows */}
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
        </div>
    );
};