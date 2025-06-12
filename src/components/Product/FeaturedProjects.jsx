"use client";
import React, { useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import FeaturedCard from './FeaturedCard';

export const FeatuedProjects = ({ data, pageDetails, loop = true, origin = "center", classes }) => {

    console.log("--featured projects data--",data);

    const { featuredProjectTitle } = pageDetails;
    const sliderInstance = useRef();
    const [sliderRef] = useKeenSlider(
        {
            loop: loop,
            mode: "free-snap",
            slides: {
                origin: origin,
                perView: 4,
                spacing: 4,
            },
            created(slider) {
                sliderInstance.current = slider;
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: { perView: 1.2, spacing: 5, origin: "center" },
                },
                "(min-width: 768px) and (max-width: 1024px)": {
                    slides: { perView: 2, spacing: 4, origin: "center" },
                },
                "(min-width: 1025px) and (max-width: 1280px)": {
                    slides: { perView: 3.5, spacing: 4, origin: "center" },
                },
            },
        },
        []
    );

    return (
        data && data.length > 0 && <div className={`w-full py-20 bg-primary lg:py-6 ${classes}`}>
            <div className='sm:px-0 px-[12px] flex items-center flex-col '>
                <SectionTitle text={featuredProjectTitle} classes="lg:!text-[60px] sm:!text-[55px] sm:!leading-[50px] lg:!py-[30px] !text-[35px] !leading-[30px] max-sm:!pt-[120px] " />
            </div>
            <div className="p-6 bg-[#F4F1EC] bg-primary">
                <div ref={sliderRef} className="keen-slider ">
                    {data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide flex px-2 `}
                            >
                                <FeaturedCard data={item} classes={"bg-primary-alt"}/>
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
    )
}
