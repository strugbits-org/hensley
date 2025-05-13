"use client";
import React, { useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryButton } from '../common/PrimaryButton'
import ProductCard from '../common/ProductCard'
import { CustomLink } from '../common/CustomLink'
import { PrimaryImage } from '../common/PrimaryImage'
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md'
import { useKeenSlider } from 'keen-slider/react'

export const BestSellers = ({ data }) => {
    console.log("Best Sellers Data: ", data);

    const sliderInstance = useRef();

    const [sliderRef] = useKeenSlider(
        {
            loop: true,
            mode: "free-snap",
            slides: {
                origin: "center",
                perView: 4,
                spacing: 4,
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

    return (
        <div className='bg-secondary-alt w-full'>
            <div className='sm:px-0 px-[12px] pb-12 flex items-center flex-col'>
                <SectionTitle text={"best sellers"} classes="!text-primary py-[40px] lg:border-none md:mt-6 lg:mt-0 border-t border-b" />
                <PrimaryButton className="border border-primary text-primary hover:text-secondary-alt hover:border-secondary-alt text-base hover:bg-primary max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">SEE ALL</PrimaryButton>
            </div>
            <div className="p-6">
                <div ref={sliderRef} className="keen-slider mt-[20px] ">
                    {data.map(({ product }, index) => {
                        return (
                            <CustomLink
                                to={"/"}
                                key={index}
                                className={`keen-slider__slide  flex flex-col md:p-[10px]`}
                            >
                                <div className="h-[325px] lg:h-[448px] relative">
                                    <ProductCard
                                        imageSrc={product.mainMedia}
                                        title="POLTRONA MONTANA"
                                        code="MODCH39"
                                        dimensions='24”L X 30”W X 37”H'
                                        onAddToCart={() => console.log('Added to cart')}
                                    />
                                </div>
                            </CustomLink>
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
