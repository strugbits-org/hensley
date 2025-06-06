
"use client";
import React, { useRef } from 'react'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import AddToCartCard from './AddToCartCard';

export const AddToCartSlider = ({ data, loop = true, origin = "center", classes }) => {
console.log("data", data);

    const mediaItems = data.product.mediaItems;

    const sliderInstance = useRef();

    const [sliderRef] = useKeenSlider(
        {
            loop,
            mode: "free-snap",
            slides: {
                origin,
                perView: 1,
                spacing: 4,
            },
            created(slider) {
                sliderInstance.current = slider;
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: { perView: 1, spacing: 5, origin: "center" },
                },
                "(min-width: 768px) and (max-width: 1024px)": {
                    slides: { perView: 1, spacing: 4, origin: "center" },
                },
                "(min-width: 1025px) and (max-width: 1280px)": {
                    slides: { perView: 1, spacing: 4, origin: "center" },
                },
            },
        },
        []
    );

    return (
        <div className={`${classes}  w-full h-full flex items-center `}>
            <div className="">
                <div ref={sliderRef} className="keen-slider ">

                    <div
                        className={`keen-slider__slide  flex flex-col px-2`}
                    >
                        {data.map((item, index) => (
                            <AddToCartCard />
                        ))}
                    </div>
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
