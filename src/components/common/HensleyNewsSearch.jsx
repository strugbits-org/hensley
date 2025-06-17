"use client";
import React, { useRef } from 'react'
import SectionTitle from './SectionTitle'
import { PrimaryButton } from './PrimaryButton'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import NewsCard from './NewsCard';
import { CustomLink } from './CustomLink';

export const HensleyNewsSearch = ({ data, pageDetails, loop = true, origin = "center" }) => {
    const { hensleyNewsTitle } = pageDetails;

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
        <div className='w-full py-20 lg:py-6 bg-primary mt-8'>
            <div className='sm:px-0 px-[12px] flex items-center flex-col'>
                <SectionTitle text={hensleyNewsTitle} classes="py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
            </div>
            <div className="p-6">
                <div ref={sliderRef} className="keen-slider">
                    {data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide flex px-2`}
                            >
                                <NewsCard data={item} classes={"bg-primary-alt"} />
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
            <div className='w-full flex justify-center'>
                <CustomLink to={'/blog'}>
                    <PrimaryButton className="mx-auto border border-secondary-alt text-secondary-alt hover:text-secondary-alt hover:border-secondary-alt text-base text-[16px] font-haasRegular hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">SEE ALL</PrimaryButton>
                </CustomLink>
            </div>

        </div>
    )
}
