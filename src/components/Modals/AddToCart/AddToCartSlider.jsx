
"use client";
import React, { useEffect, useState } from 'react'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { PrimaryImage } from '@/components/common/PrimaryImage';

export const AddToCartSlider = ({ data, loop = true, origin = "center" }) => {
    const mediaItems = data.product.mediaItems;
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [sliderRef, instanceRef] = useKeenSlider(
        isMounted
            ? {
                loop,
                mode: "free-snap",
                slides: {
                    origin,
                    perView: 1,
                    spacing: 4,
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
                slideChanged(slider) {
                    setCurrentSlide(slider.track.details.rel);
                },
            }
            : null,
        []
    );

    return (
        <div className={`relative w-full h-full sm:max-w-[45%]`}>
            <div ref={sliderRef} className="keen-slider">
                {mediaItems.map((item, index) => (
                    <div key={item.id} className={`keen-slider__slide number-slide${index + 1} !max-h-[400px] p-4`}>
                        <PrimaryImage
                            key={item.id}
                            url={item.src}
                            alt={'slide image'}
                            fit='fit'
                            customClasses={"h-full w-full object-contain"} />
                    </div>
                ))}
            </div>
            {instanceRef.current && (
                <>
                    <button
                        onClick={(e) =>
                            e.stopPropagation() || instanceRef.current?.prev()
                        }
                        disabled={currentSlide === 0}
                        className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                    >
                        <MdOutlineChevronLeft className="w-[20px] h-[20px]" />
                    </button>

                    <button
                        onClick={(e) =>
                            e.stopPropagation() || instanceRef.current?.next()
                        }
                        disabled={
                            currentSlide ===
                            instanceRef.current.track.details.slides.length - 1
                        }
                        className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                    >
                        <MdOutlineChevronRight className="w-[20px] h-[20px]" />
                    </button>
                </>
            )}
        </div>
    )
}
