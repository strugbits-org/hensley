'use client'
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import image from '@/assets/portfolio-1.png'
import Image from 'next/image'
import FilterCardSubCategories from '../common/FilterCardSubCategories'

const Buttons = ({ text, classes }) => {
    return (
        <>
            <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-2`}>{text}</button>
        </>
    )
}

const EventHighLight = () => {
    return (
        <div className='w-full'>
            <SectionTitle
                text="our projects"
                classes={
                    "lg:bg-primary-alt pt-[36px] pb-[44px]"
                }
            />
            <div className='w-full border ' >
                <div className='lg:h-[686px] h-[730px] flex sm:justify-end justify-start w-full bg-no-repeat bg-center bg-[length:100%_100%]
                lg:pr-[186px]
                lg:pt-[202px]
                sm:pr-[55px]
                sm:pt-[104px]
                px-[22px]
                py-[31px]
                overflow-hidden
                 transition-all duration-500 ease-in-out hover:bg-[length:110%_110%]
                ' style={{ backgroundImage: `url(${image.src})` }}>
                    <div className='group flex lg:flex-row flex-col items-start mt-[20px] gap-x-[27px] gap-y-[15px]'>
                        <Image
                            className='order-2 lg:order-1 z-10 lg:w-[176px] lg:h-[176px] w-[34px] h-[34px] lg:group-hover:w-[342px] lg:group-hover:h-[342px] transition-all duration-300 ease-in-out'
                            height={176}
                            width={176}
                            src={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                        />

                        <div className='order-1 lg:order-2 flex flex-col  gap-y-[15px]'>
                            <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                text-white
                block
                '>DEC 28, 2023 – Treasure Island</span>

                            <span className='
                uppercase
                text-secondary-alt
                text-[35px]
                text-white
                leading-[32px]
                font-recklessRegular
                block
                '>
                                GALLOP AND GLAMOUR: <br /> HENSLEY EQUESTRIAN <br /> EXTRAVAGANZA EVENT <br /> DESIGN
                            </span>

                            <div className='w-full flex gap-x-[10px]'>
                                <Buttons text="corporate" classes={"!bg-transparent border border-white text-white"} />
                                <Buttons text="event design and production" />
                                <Buttons text="+3 Studios" />
                            </div>
                            <span className='
                font-haasRegular
                uppercase
                text-[16px]
                text-white
                leading-[20px]
                text-secondary-alt
                block
                '>Nestled in the heart of Napa Valley, the Silverado <br /> Hotel played host to an extraordinary outdoor <br /> incentive event, meticulously crafted by…</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EventHighLight