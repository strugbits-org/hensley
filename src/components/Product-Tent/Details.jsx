"use client";
import React, { useState } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToQuote } from './AddtoQuoteButton'
import { PrimaryImage } from '../common/PrimaryImage'
import CheckBox from './CheckBox';

export const Details = ({ data }) => {
    return (
        <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px] '>
            <div className='xl:w-1/2 '>
                <ProductSlider />
                <ProductSlider_tab />
            </div>
            <div className='xl:w-1/2 flex flex-col items-center relative'>
                <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
                    <span className='text-secondary-alt 
          lg:text-[16px]
          text-[12px]
          uppercase font-haasLight'>Home/corporate</span>
                    <h3 className='uppercase text-secondary-alt font-recklessRegular 
          lg:text-[90px] 
          lg:leading-[85px]
          text-[35px]
          leading-[30px]
          '>Structures</h3>
                    <p className='
            font-haasRegular
            lg:text-[16px]
            lg:leading-[19px]
            text-[14px]
            leading-[17px]
            text-secondary-alt
            '>Over the past 43 years, Hensley Event Resources has tented nearly every landmark and venue throughout the San Francisco Bay Area and beyond. From Union Square to Treasure Island to Stanford University, to backyards throughout the region, we build unique environments, one structure at a time. Hensley Event Resources owns the largest tent structures in Northern California. We are committed to building upon our tenting inventory with new structures added regularly.​</p>

                    <form action="" className='w-full grid lg:grid-cols-4 grid-cols-2 justify-between gap-x-[24px] gap-y-[39px] mt-[20px]'>
                        <span className='lg:col-span-4 
                            col-span-2
                            uppercase
                                                        font-recklessRegular
                text-[30px] 
                leading-[30px] 
                text-secondary-alt'>​​Please fill the bellow RFP form & A tenting Specialist will provide a custom quote</span>
                        <div className='lg:col-span-4 col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Event Name</label>
                            <input
                                type={"text"}
                                className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>

                        <div className='lg:col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Event Date</label>
                            <input
                                type={"date"}
                                className="datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>

                        <div className='lg:col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Removal Date</label>
                            <input
                                type={"date"}
                                className="datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>

                        <div className='lg:col-span-4 col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">tent size (if known)</label>
                            <input
                                type={"text"}
                                className="datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>

                        <CheckBox data={{ label: "event type", options: ["RECEPTION", "SIT DOWN DINNER", "OTHER"] }} classes="lg:col-span-2" />
                        <div className='lg:col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">NUMBER OF GUESTS*</label>
                            <input
                                type={"text"}
                                className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>

                        <CheckBox data={{ label: "are the install/removal dates flexible", options: ["yes", "no"] }} />
                        <CheckBox data={{ label: "tent type", options: ["white walls", "no walls", "transparent"] }} />
                        <CheckBox data={{ label: "heating", options: ["yes", "no"] }} />
                        <CheckBox data={{ label: "heating", options: ["yes", "no"] }} />

                        <CheckBox data={{ label: "CEILLING TREATMENT", options: ["FULL SWAG", "PARTIAL SWAG", "CROWN RAFTER", "I AM NOT SURE"] }} />
                        <CheckBox data={{ label: "WALL TREATMENT", options: ["FULL PLEAT", "MINIMAL PLEAT", "WALL POLE DRAPE", "OTHER"] }} />
                        <CheckBox data={{ label: "LIGHTING NEEDED", options: ["yes", "no", "i don't know"] }} />
                        <CheckBox data={{ label: "ABLE TO STAKE", options: ["yes", "no"] }} />

                        <CheckBox data={{ label: "TENT SURFACE", options: ["dirt", "grass", "Concrete", "astfalt", "other"] }} />
                        <CheckBox data={{ label: "level surface", options: ["yes", "no"] }} />
                        <CheckBox data={{ label: "do you need a floor", options: ["yes", "no"] }} />


                        <div className='lg:col-span-4 col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">CARPET / ASTROTURF COLOR</label>
                            <input
                                type={"text"}
                                className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>
                        <div className='lg:col-span-4 col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">DISTANCE FROM TRUCK TO SITE</label>
                            <input
                                type={"text"}
                                className=" w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                            />
                        </div>
                        <div className='lg:col-span-4 col-span-2'>
                            <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">PLEASE PROVIDE ANY OTHER ADDICIONAL INFO</label>
                            <textarea
                                className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                                rows={4}
                            ></textarea>

                        </div>
                    </form>

                </div>
                <AddToQuote text="add to quote" />

                <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer">
                    <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
                    <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
                </div>

            </div>
        </div>
    )
}