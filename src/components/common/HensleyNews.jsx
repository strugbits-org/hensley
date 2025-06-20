"use client";
import React, { useRef, useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryButton } from '../common/PrimaryButton'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import NewsCard from './NewsCard';
import Loading from '@/app/loading';

export const HensleyNews = ({ data, pageDetails, loop = true, origin = "center", titleType = "primary" }) => {
    const { hensleyNewsTitle } = pageDetails;
    const [isSliderReady, setIsSliderReady] = useState(false);

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
                setIsSliderReady(true);
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
        <div className='w-full py-20 lg:py-6'>
            <div className='sm:px-0 px-[12px] pb-12 flex items-center flex-col lg:border-b max-lg:border border-primary-border'>
                {titleType === "primary" ? (
                    <>
                        <SectionTitle text={hensleyNewsTitle} classes="lg:!text-[200px] lg:!leading-[160px] sm:!text-[65px] sm:!leading-[50px] lg:py-[20px] py-[20px] md:mt-6 lg:mt-0" />
                        <PrimaryButton className="border border-secondary-alt text-secondary-alt hover:text-secondary-alt hover:border-secondary-alt text-base text-[16px] font-haasRegular hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">SEE ALL</PrimaryButton>
                    </>
                ) : (
                    <SectionTitle text={hensleyNewsTitle} classes="lg:!text-[60px] sm:!text-[55px] sm:!leading-[50px] lg:!py-[30px] !text-[35px] !leading-[30px] max-sm:!pt-[120px] " />
                )}

            </div>
            <div className="p-6">
                {!isSliderReady && (
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Loading custom type='secondary' />
                    </div>
                )}

                <div ref={sliderRef} className={`keen-slider ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
                    {data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide flex px-2`}
                            >
                                <NewsCard data={item} />
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
