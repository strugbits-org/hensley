
"use client";
import React, { useRef, useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryButton } from '../common/PrimaryButton'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'
import MatchedProductCard from './MatchedProductCard';
import Loading from '@/app/loading';

export const MatchProducts = ({ data, pageDetails, loop = true, origin = "center", classes, headingClasses, buttonHide = false, allCollections = [] }) => {
    const { matchProductsTitle } = pageDetails;
    const [isSliderReady, setIsSliderReady] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderInstance = useRef();

    const [sliderRef] = useKeenSlider(
        {
            loop: loop && data?.length > 1,
            mode: "free-snap",
            slides: {
                origin,
                perView: 4,
                spacing: 4,
            },
            created(slider) {
                sliderInstance.current = slider;
                setIsSliderReady(true);
            },
            detailsChanged(slider) {
                setCurrentSlide(slider.track.details);
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: { perView: 1.2, spacing: 5, origin: "auto" },
                },
                "(min-width: 768px) and (max-width: 1024px)": {
                    slides: { perView: 3, spacing: 4, origin: "center" },
                },
                "(min-width: 1025px) and (max-width: 1280px)": {
                    slides: { perView: 3.5, spacing: 4, origin: "center" },
                },
                "(min-width: 2561px)": {
                    slides: { origin, perView: 5, spacing: 8 },
                },
            },
        },
        []
    );

    return (
        data && data.length > 0 && <div className={`${classes} bg-secondary-alt w-full py-20 lg:py-6`}>
            <div className='sm:px-0 px-[12px] pb-12 flex items-center flex-col'>
                <SectionTitle text={matchProductsTitle} classes={`lg:!text-[200px] lg:!leading-[160px] 3xl:!text-[360px] 3xl:!leading-[300px] sm:!text-[55px] sm:!leading-[50px] lg:!py-[30px] max-sm:!text-[55px] max-sm:!leading-[50px] ${headingClasses}`} />
                {!buttonHide && <PrimaryButton className="border border-primary text-primary hover:text-secondary-alt hover:border-secondary-alt text-base 3xl:text-xl hover:bg-primary max-h-[60px] 3xl:max-h-[90px] max-w-[280px] 3xl:max-w-[420px] px-8 py-4 3xl:px-12 3xl:py-6 hover:[letter-spacing:4px]">SEE ALL</PrimaryButton>}
            </div>
            <div className="p-6">
                {!isSliderReady && (
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Loading custom type='secondary' />
                    </div>
                )}
                <div ref={sliderRef} className={`keen-slider ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
                    {data.map((productData, index) => {
                        return (
                            <div
                                key={index}
                                className={`keen-slider__slide flex flex-col px-2`}
                            >
                                <MatchedProductCard
                                    type='slider'
                                    data={productData}
                                    allCollections={allCollections}
                                />
                            </div>
                        );
                    })}
                    {(data.length > 1) && (
                        <>
                            {(loop || currentSlide?.rel > 0) && <button
                                onClick={() => sliderInstance.current?.prev()}
                                className="hidden absolute top-1/2 left-8 transform -translate-y-1/2 w-[60px] h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                            >
                                <MdOutlineChevronLeft className="w-[20px] h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                            </button>}

                            {(loop || currentSlide?.rel !== currentSlide?.maxIdx) && <button
                                onClick={() => sliderInstance.current?.next()}
                                className="hidden absolute top-1/2 right-8 transform -translate-y-1/2 w-[60px] h-[60px] 3xl:w-[96px] 3xl:h-[96px] rounded-full bg-white shadow-md lg:flex items-center justify-center z-10"
                            >
                                <MdOutlineChevronRight className="w-[20px] h-[20px] 3xl:w-[34px] 3xl:h-[34px]" />
                            </button>}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
