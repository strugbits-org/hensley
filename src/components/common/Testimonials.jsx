"use client";
import React, { useRef, useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { TestimonialCard } from './TestimonialCard';

export const Testimonials = ({ data, pageDetails }) => {
    const { testimonialsTitle } = pageDetails;
    const sliderInstance = useRef();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef] = useKeenSlider(
        {
            loop: true,
            slides: data.length,
            defaultAnimation: {
                duration: 2000,
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: { perView: 1, spacing: 10, origin: "center" },
                },
                "(min-width: 768px) and (max-width: 1024px)": {
                    slides: { perView: 2, spacing: 10 },
                },
                "(min-width: 1025px)": {
                    slides: { perView: 1.4, spacing: 10 },
                },
            },
            created(slider) {
                sliderInstance.current = slider;
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
        },
        []
    );

    // Function to determine if a slide is before the active one
    const isBeforeActive = (index) => {
        if (currentSlide === 0) {
            return index === data.length - 1; // Last slide is before the first one in loop mode
        }
        return index === currentSlide - 1;
    };

    return (
        <div className='w-full mb-20'>
            <div className='sm:px-0 px-[12px] pb-12 flex items-center flex-col'>
                <SectionTitle text={data[0].sectionTitle} classes="py-[40px] lg:border-none md:mt-6 lg:mt-0 border-t border-b" />
            </div>
            <div className="p-6">
                <div ref={sliderRef} className="keen-slider lg:pl-32">
                    {data.map((testimonial, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide flex transition-[opacity] duration-300 ease-in-out ${isBeforeActive(index) ? "invisible" : ""}`}
                            >
                                <TestimonialCard data={testimonial} classes={""} />
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