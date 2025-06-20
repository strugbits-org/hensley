"use client";
import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import { PrimaryButton } from '../common/PrimaryButton';
import ProductCard from '../common/ProductCard';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import { useKeenSlider } from 'keen-slider/react';
import { fetchSavedProductData } from '@/services/products';
import { logError } from '@/utils';
import Loading from '@/app/loading';

export const BestSellers = ({
    data,
    pageDetails,
    loop = true,
    origin = "center",
    classes,
    headingClasses,
    buttonHide = false,
}) => {
    const { bestSellerTitle } = pageDetails;
    const [savedProducts, setSavedProducts] = useState([]);
    const sliderInstance = useRef();
    const [isSliderReady, setIsSliderReady] = useState(false);

    const [sliderRef] = useKeenSlider(
        {
            loop,
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
            breakpoints: {
                "(max-width: 768px)": {
                    slides: { perView: 1.5, spacing: 5, origin: "center" },
                },
                "(min-width: 768px) and (max-width: 1024px)": {
                    slides: { perView: 3, spacing: 4, origin: "center" },
                },
                "(min-width: 1025px) and (max-width: 1280px)": {
                    slides: { perView: 3.5, spacing: 4, origin: "center" },
                },
            },
        },
        []
    );

    const fetchSavedProducts = async () => {
        try {
            const savedProducts = await fetchSavedProductData();
            setSavedProducts(savedProducts);
        } catch (error) {
            logError("Error while fetching Saved Product", error);
        }
    };

    useEffect(() => {
        fetchSavedProducts();
    }, []);

    if (!data || data.length === 0) return null;

    return (
        <div className={`${classes} bg-secondary-alt w-full py-20 lg:py-[85px]`}>
            <div className="sm:px-0 px-[12px] pb-12 flex items-center flex-col">
                <SectionTitle
                    text={bestSellerTitle}
                    classes={`!text-primary py-[20px] md:mt-6 lg:mt-0 ${headingClasses}`}
                />
                {!buttonHide && (
                    <PrimaryButton className="border border-primary text-primary hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
                        SEE ALL
                    </PrimaryButton>
                )}
            </div>

            <div className="p-6 relative">
                {!isSliderReady && (
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Loading custom type='secondary' />
                    </div>
                )}

                <div ref={sliderRef} className={`keen-slider transition-opacity duration-300 ${isSliderReady ? "opacity-100 visible" : "opacity-0 invisible max-h-[20vh]"}`}>
                    {data.map((productData, index) => (
                        <div
                            key={index}
                            className="keen-slider__slide flex flex-col px-2"
                        >
                            <ProductCard
                                type="slider"
                                data={productData}
                                savedProducts={savedProducts}
                                setSavedProducts={setSavedProducts}
                                btnClass="border border-black"
                            />
                        </div>
                    ))}

                    {/* Navigation Buttons */}
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
    );
};
