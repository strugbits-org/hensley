"use client";
import React, { useEffect, useState } from 'react'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { PrimaryImage } from '@/components/common/PrimaryImage'
import image from '@/assets/plate-2.png'
import Image from 'next/image';

export const MatchFeatureSlider = ({ loop = true, origin = "auto" }) => {
    const mediaItems = [
        { id: '1', src: image },
        { id: '2', src: image },
        { id: '3', src: image },
        { id: '4', src: image },

    ];

    const [currentSlide, setCurrentSlide] = useState(0);
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
                    perView: 4,
                    spacing: 2,
                },
                breakpoints: {
                    "(max-width: 768px)": {
                        slides: { perView: 3, spacing: 4, origin: "center" },
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
        <div className={`relative w-full h-full`}>
            <div ref={sliderRef} className="keen-slider">
                {mediaItems.map((item, index) => (
                    <div key={item.id} className={`keen-slider__slide number-slide${index + 1} !max-h-[200px] `}>
                        {/* <PrimaryImage
                            timeout={0}
                            key={item.id}
                            url={item.src}
                            alt={'slide image'}
                            fit='fit'
                            customClasses={"h-full w-full object-contain"} /> */}
                        <Image src={image} className='object-contain' />
                    </div>
                ))}
            </div>

            {mediaItems.length > 1 && instanceRef.current && (
                <>
                    <button
                        onClick={(e) =>
                            e.stopPropagation() || instanceRef.current?.prev()
                        }
                        disabled={currentSlide === 0}
                        className="hidden absolute bottom-0 right-12 w-[40px] h-[40px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
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
                        className="hidden absolute bottom-0 right-0  w-[40px] h-[40px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                    >
                        <MdOutlineChevronRight className="w-[20px] h-[20px]" />
                    </button>
                </>
            )}
        </div>
    );
};
