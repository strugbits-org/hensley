"use client";
import React, { useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import { TestimonialCard } from './TestimonialCard';

export const Testimonials = ({ data, pageDetils }) => {
    const { testimonialsTitle } = pageDetils;
    console.log("Testimonials Data: ", data[0]);

    const sliderInstance = useRef();

    const [sliderRef] = useKeenSlider(
        {
            loop: true,
            slides: data.length,
            defaultAnimation: {
                duration: 2000,
            },
            breakpoints: {
                "(max-width: 1024px)": {
                    slides: { perView: 1.2, spacing: 10, origin: "center" },
                },
                "(min-width: 1024px)": {
                    slides: { perView: 1.5, spacing: 10 },
                },
            },
            created(slider) {
                sliderInstance.current = slider;
            },
        },
        []
    );

    return (
        <div className='w-full'>
            <div className='sm:px-0 px-[12px] pb-12 flex items-center flex-col'>
                <SectionTitle text={testimonialsTitle} classes="py-[40px] lg:border-none md:mt-6 lg:mt-0 border-t border-b" />
            </div>
            <div className="p-6">
                <div ref={sliderRef} className="keen-slider pl-32">

                    {data.map((testimonial, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide`}
                            >
                                <TestimonialCard data={testimonial} />
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
            {/* <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          /> */}
        </div>
    )
}
