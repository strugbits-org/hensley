'use client'
import React, { useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import catTab from '@/assets/icons/cat-tab.svg'
import Image from 'next/image'
import chairImage from '@/assets/chair.png'
import FilterMenu from '../common/MenuFilter'
import ProductCard from '../common/ProductCard'
import { Banner } from '../common/Banner'
import BannerImg from '@/assets/banner.png'
import { LoadMoreButton } from '../common/LoadMoreButton'

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
]

export const Listing = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='lg:px-[24px]'>
            <div className='relative flex flex-col justify-center'>
                <h4 className='uppercase color-[#2C2216] font-recklessRegular 
        lg:text-[35px]
        text-center

        '>category</h4>
                <div className=' relative'>
                    <SectionTitle text="subcategory" classes="text-[35px] pt-[40px] pb-[40px] border-none" />

                    <div
                        className={`absolute top-[40px] sm:right-[10%] right-[2%] z-[9999] ${isOpen ? 'min-h-[300px] w-[330px] px-[20px] py-[40px]' : 'h-[55px] w-[55px]'} rounded-[50px] bg-white flex flex-col`}
                    >
                        <div
                            className={`flex flex-1 items-center ${isOpen ? 'justify-end px-4' : 'justify-center'
                                }`}
                        >

                            <Image
                                src={catTab}
                                onClick={toggleList}
                                className={`absolute ${isOpen && 'right-[18px] top-[19px]'}`}
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

            <div className='w-full max-w-[1886px] grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2
            '>
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
                <ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                /><ProductCard
                    imageSrc={chairImage}
                    title="POLTRONA MONTANA"
                    code="MODCH39"
                    dimensions='24”L X 30”W X 37”H'
                    onAddToCart={() => console.log('Added to cart')}
                />
            </div>
            <Banner img={BannerImg} />
            <LoadMoreButton text="load more chairs"/>

        </div>
    )
}
