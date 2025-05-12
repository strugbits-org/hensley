'use client'
import React, { useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import catTab from '@/assets/icons/cat-tab.svg'
import Image from 'next/image'

import FilterMenu from '../common/MenuFilter'

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
        <>
            <div className='relative flex'>
                <h4 className='uppercase color-[#2C2216] font-recklessRegular 
        lg:text-[35px]
        lg:leading-[160px]

        '>category</h4>
               <div>
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
        </>
    )
}
