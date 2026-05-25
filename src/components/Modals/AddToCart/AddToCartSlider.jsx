
"use client";
import React, { useEffect, useState } from 'react'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { PrimaryImage } from '@/components/common/PrimaryImage';

export const AddToCartSlider = ({ data, loop = true, origin = "center", isTent = false, noWidthConstraint = false }) => {
    const mediaItems = data?.product?.mediaItems || [];
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

    const hasMedia = mediaItems && mediaItems.length > 0;

    return (
        <div className={`relative w-full lg:h-full ${noWidthConstraint ? '' : 'sm:max-w-[45%]'} ${isTent ? 'h-auto' : 'h-full'}`}>
            <div ref={sliderRef} className="keen-slider">
                {hasMedia ? mediaItems.map((item, index) => (
                    <div key={item.id || index} className={`keen-slider__slide lg:!max-h-[400px] 3xl:!max-h-[640px] number-slide${index + 1} p-4 ${isTent ? '!max-h-[250px]' : '3xl:!max-h-[640px] !max-h-[400px]'}`}>
                        <PrimaryImage
                            key={item.id || index}
                            url={item.src}
                            size="card"
                            alt={item.alt || 'slide image'}
                            fit='fit'
                            customClasses={"h-full w-full object-contain"} />
                    </div>
                )) : (
                    <div className={`keen-slider__slide p-4 h-full lg:!max-h-[400px] ${isTent ? '!max-h-[250px]' : '!max-h-[400px]'}`}>
                        <div className="h-full w-full min-h-[400px] flex items-center justify-center">
                            <span className="font-haasRegular text-[12px] uppercase tracking-widest text-secondary-alt opacity-60">No image</span>
                        </div>
                    </div>
                )}
            </div>
            {(mediaItems && mediaItems.length > 1) && (instanceRef.current && (
                <>
                    <button
                        onClick={(e) =>
                            e.stopPropagation() || instanceRef.current?.prev()
                        }
                        disabled={currentSlide === 0}
                        className="absolute top-1/2 left-2 sm:left-4 lg:left-8 transform -translate-y-1/2 w-10 h-10 lg:w-[60px] lg:h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md flex items-center justify-center z-10"
                    >
                        <MdOutlineChevronLeft className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                    </button>
 
                    <button
                        onClick={(e) =>
                            e.stopPropagation() || instanceRef.current?.next()
                        }
                        disabled={
                            currentSlide ===
                            instanceRef.current.track.details.slides.length - 1
                        }
                        className="absolute top-1/2 right-2 sm:right-4 lg:right-8 transform -translate-y-1/2 w-10 h-10 lg:w-[60px] lg:h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md flex items-center justify-center z-10"
                    >
                        <MdOutlineChevronRight className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                    </button>
                </>
            ))}
        </div>
    )
}
