'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import SectionTitle from '../common/SectionTitle'
import catTab from '@/assets/icons/cat-tab.svg'
import FilterMenu from '../common/MenuFilter'
import ProductCard from '../common/ProductCard'
import BannerImg from '@/assets/banner.png'
import { LoadMoreButton } from '../common/LoadMoreButton'
import { ProductBanner } from '../common/ProductBanner'

// Static image link from Wix
const chairImage = "wix:image://v1/339f77_1bf80cddc0bd48d78d7c221389c03cc9~mv2.jpg/file.jpg#originWidth=3089&originHeight=4633";

// Filter categories
const filterData = [
    {
        title: "Tents",
        children: [
            { label: "Chargers" },
            { label: "Tension tents" },
            { label: "Frame tents" },
        ],
    },
    {
        title: "Lighting",
        children: [
            { label: "String Lights" },
            {
                title: "LED Options",
                children: [
                    { label: "White LEDs" },
                    { label: "RGB LEDs" },
                ],
            },
        ],
    },
];

export const Listing = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleList = () => setIsOpen(!isOpen);

    return (
        <div className='lg:px-[24px] px-[12px]'>
            {/* Title Section */}
            <div className='relative flex flex-col justify-center pt-[55px] pb-[23px] lg:gap-y-0 gap-y-[10px]'>
                <h4 className='uppercase text-center color-secondary-alt lg:font-recklessRegular font-recklessLight lg:text-[35px]'>category</h4>

                <div className='relative lg:block flex flex-col justify-center items-center lg:gap-y-0 gap-y-[10px]'>
                    <SectionTitle text="subcategory" classes="xl:text-[200px] lg:text-[95px] border-none" />

                    {/* Filter Menu Floating Button */}
                    <div
                        className={`lg:absolute relative bottom-0 sm:right-[1%] right-[2%] z-[9999] 
              ${isOpen ? 'min-h-[300px] w-[330px] px-[20px] py-[40px]' : 'h-[55px] w-[55px]'}
              rounded-[50px] bg-white flex flex-col transition-all duration-300`}
                    >
                        <div className={`flex flex-1 items-center ${isOpen ? 'justify-end px-4' : 'justify-center'}`}>
                            <Image
                                src={catTab}
                                alt="Toggle filter"
                                onClick={toggleList}
                                className={`absolute cursor-pointer transition-all duration-300 ${isOpen ? 'right-[18px] top-[19px]' : ''}`}
                            />
                        </div>

                        {isOpen && (
                            <div>
                                <FilterMenu items={filterData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Grids */}
            <div className='w-full max-w-[1886px] grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2
      lg:gap-x-[31px] sm:gap-x-[12px] gap-x-[10px]
      lg:gap-y-[20px] sm:gap-y-[12px] gap-y-[20px]'>
                {products.map((productData, index) => (
                    <ProductCard
                        key={index}
                        data={productData}
                        onAddToCart={() => console.log('Added to cart')}
                    />
                ))}
            </div>

            {/* Banner */}
            <ProductBanner img={BannerImg} />
            {/* 
            {/* More Products */}
            {/* <ProductGrid count={8} /> */}

            {/* Load More Button */}
            <div className='w-full flex justify-center'>
                <LoadMoreButton text="load more chairs" classes="lg:mb-[78px] lg:mt-[30px] sm:mt-[33px] sm:mb-[89px] mt-[51px] mb-[131px]" />
            </div>
        </div>
    );
};
