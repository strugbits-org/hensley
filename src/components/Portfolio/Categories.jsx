"use client";
import React from 'react';
import FilterCardSubCategories from '../common/FilterCardSubCategories';
import { PrimaryButton } from '../common/PrimaryButton';
import { PrimaryImage } from '../common/PrimaryImage'
import Image from 'next/image';
import image from '@/assets/search-image-3.png'
import { Button } from './Button';

const Buttons = ({ text, classes }) => {
    return (
        <>
            <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-2`}>{text}</button>
        </>
    )
}


const ProjectCards = () => {
    return (
        <div className="cursor-pointer group border flex flex-col lg:flex-row hover:bg-primary transition-all duration-300 ease-in-out lg:h-[474px] gap-0">
            {/* Image Section */}
            <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] px-[12px] lg:h-auto h-[382px]">
                <div className="overflow-hidden h-full w-full">
                    <Image src={image} alt="Project Image" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 lg:pr-[24px] lg:py-[24px] py-[13px] max-lg:px-[12px]">
                <div className="h-full w-full flex justify-between gap-x-2">
                    <div className="h-full flex flex-col justify-between">
                        <div className='flex flex-col gap-y-[15px]'>
                            <span className='font-haasRegular *:
            text-[12px]
            uppercase
            text-secondary-alt
            block
            '>DEC 28, 2023 – MIRCEA MANEA</span>

                            <span
                                className="font-recklessRegular
              2xl:text-[35px]
              2xl:leading-[35px]
              max-2xl:text-[20px]
              max-2xl:leading-[18px]
              text-[23px]
              leading-[25px]
              uppercase "
                            >
                                GALLOP AND GLAMOUR: HENSLEY EQUESTRIAN EXTRAVAGANZA EVENT DESIGN
                            </span>

                            <div className='w-full flex gap-x-[6px] flex-wrap gap-y-[10px]'>
                                <Buttons text={"corporate"} classes={"!bg-transparent border border-black"} />
                                <Buttons text={"event design and production"} />
                                <Buttons text={"creative services agency"} />
                                <Buttons text={"+3 studios"} />

                            </div>
                            <span className='
                font-haasRegular
                uppercase
                2xl:text-[12px]
                2xl:leading-[16px]
                lg:text-[12px]
                text-secondary-alt
                block
                '>Nestled in the heart of Napa Valley, the Silverado Hotel played <br />  host to an extraordinary outdoor incentive event, meticulously crafted by…</span>
                        </div>

                        <div className='pt-[10px]'>
                            <PrimaryImage
                                url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                                alt="Arrow"
                                customClasses="hidden lg:block arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[70px] group-hover:h-[70px] lg:mb-[12px] group-hover:filter brightness-50"
                            />
                        </div>
                    </div>

                    <PrimaryImage
                        url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                        alt="Arrow"
                        customClasses="lg:hidden arrow w-[25px] h-[25px]"
                    />
                </div>
            </div>
        </div>
    )
}

const Categories = () => {
    return (
        <div className='w-full '>
            <div className='w-full bg-primary-border py-[20px]'>
                <FilterCardSubCategories data={[{ name: "one" }, { name: "two" }, { name: "three" }, { name: "four" }]} />
            </div>

            <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-0 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
                <ProjectCards />
            </div>
            <div className='w-full flex justify-center items-center py-[10px]'>
                <Button text="load more" />
            </div>
        </div>
    );
}

export default Categories;
