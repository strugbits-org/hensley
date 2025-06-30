"use client";
import React, { useEffect, useState } from 'react'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { PrimaryImage } from '@/components/common/PrimaryImage';

export const MatchFeatureSlider = ({ data, loop = false, origin = "auto", onClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const MutationPlugin = (slider) => {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                slider.update();
                slider.moveToIdx(slider?.track?.details?.minIdx);
            })
        })
        const config = { childList: true }

        slider.on("created", () => {
            observer.observe(slider.container, config);
            setCurrentSlide(slider.track.details);
        })

        slider.on("updated", () => {
            observer.observe(slider.container, config);
            setCurrentSlide(slider.track.details);
        })

        slider.on("destroyed", () => {
            observer.disconnect()
        })
    }

    const [sliderRef, sliderInstance] = useKeenSlider(
        isMounted
            ? {
                loop,
                mode: "free-snap",
                slides: {
                    origin,
                    perView: 4,
                    spacing: 2,
                },
                breakpoints: {
                    "(max-width: 768px)": {
                        slides: { perView: 3, spacing: 4, origin: "center" },
                    },

                },
                slideChanged(slider) {
                    setCurrentSlide(slider.track.details);
                },
            }
            : null,
        [MutationPlugin]
    );

    return (
        <div className={`relative w-full h-full`}>
            <div ref={sliderRef} className="keen-slider">
                {data.map((product, index) => (
                    <div key={product._id} className={`keen-slider__slide number-slide${index + 1} !max-h-[200px] `}>
                        <div className='w-full group border border-primary-border pb-6 px-[5px] pt-[5px] relative'>
                            <div className='w-full'>
                                <PrimaryImage key={product._id} min_h={150} min_w={150} timeout={0} url={product.mainMedia} className='h-full w-full object-contain' />
                            </div>
                            <span
                                className='text-[12px] mt-2 block text-secondary-alt uppercase font-haasRegular'
                            >
                                {product.name}
                            </span>
                            <div className='w-full px-[15px] hidden group-hover:block absolute sm:top-5 top-11 left-1/2 transform -translate-x-1/2 transition-all duration-300'>
                                <button onClick={() => onClick(product)} className={`rounded-full w-full sm:my-[33px] p-2 bg-white text-secondary-alt tracking-[3px] group transform transition-all duration-300 hover:bg-red-500 hover:text-white relative`}>
                                    <span className='font-haasLight uppercase lg:text-[12px] group-hover:font-haasBold'>REMOVE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {data.length === 0 && (
                <div className='w-full flex justify-center items-center text-secondary-alt font-haasRegular uppercase text-[18px] my-20'>
                    No matching products
                </div>
            )}

            {data.length > 0 && (
                <>
                    <button
                        onClick={() => sliderInstance.current?.prev()}
                        disabled={!loop && currentSlide?.rel === 0}
                        className="absolute bottom-0 right-12 w-[40px] h-[40px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <MdOutlineChevronLeft className="w-[20px] h-[20px]" />
                    </button>

                    <button
                        onClick={() => sliderInstance.current?.next()}
                        disabled={!loop && currentSlide?.rel === currentSlide?.maxIdx}
                        className="absolute bottom-0 right-0 w-[40px] h-[40px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <MdOutlineChevronRight className="w-[20px] h-[20px]" />
                    </button>
                </>
            )}
        </div>
    );
};
