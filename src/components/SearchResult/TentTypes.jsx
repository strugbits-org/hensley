import React from 'react'
import Image from 'next/image'
import image from '@/assets/search-image-2.png'
import SectionTitle from '../common/SectionTitle'


const TentCards = () => {
    return (
        <div className="group p-[24px] h-[973px] border overflow-hidden ">
            <div className="w-full border h-full flex lg:flex-col lg:justify-between justify-center sm:px-[50px] px-[20px] lg:py-[24px] py-[44px] relative">
                <Image
                    src={image}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className='z-10 w-full'>
                    <span className='
                            text-white
                            text-[70px]
                            leading-[55px]
                            uppercase
                            font-recklessRegular
                            w-full break-words
                            '>structures</span>
                    <div className='mt-[21px] flex flex-col gap-y-[10px] border-t border-b border-white py-7'>
                        <span className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                            <b>“Clear span” -Kedered beams </b> <br />
                            Curved beam or A-frame style <br />
                            50’, 60’, 70’, 80’, 100’ & 120’ widths</span>

                        <span className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                            <b>STRUCTURES – ATRIUM </b> <br />
                            Currently 50’ (30’ middles & 10’ wings) <br />
                            Rental companies outside CA can purchase
                        </span>
                    </div>
                </div>

                {/* <svg xmlns="http://www.w3.org/2000/svg" width="34.737" height="34.736" className='z-10 self-start lg:block hidden' viewBox="0 0 34.737 34.736">
                            <g id="Group_3706" data-name="Group 3706" transform="translate(0.354 0.383)">
                                <g id="Group_2072" data-name="Group 2072" transform="translate(0 0)">
                                    <path id="Path_3283" data-name="Path 3283" d="M.354.5H34.121V34.268" transform="translate(-0.238 -0.383)" fill="none" stroke="#e0d6ca" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_13" data-name="Line 13" x1="34" y2="34" fill="none" stroke="#e0d6ca" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_14" data-name="Line 14" x1="34" y2="34" fill="none" stroke="#e0d6ca" stroke-miterlimit="10" strokeWidth="1" />
                                </g>
                            </g>
                        </svg> */}

                <Image
                    className='z-10 self-start lg:block hidden group-hover:w-[123px] group-hover:h-[123px] transition-all duration-300 ease-in-out'
                    height={34}
                    width={34}
                    src={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                />

            </div>
        </div>
    )
}

const TentTypes = () => {
    return (
        <div className='lg:px-[24px] px-[12px] w-full h-full'>
            <SectionTitle text="PRODUCTS RELATED TO YOUR SEARCH" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
            <div className='w-full h-full grid lg:grid-cols-3 sm:grid-cols-1 gap-x-[24px] lg:gap-y-[20px] gap-y-[13px]'>
                <TentCards />
                <TentCards />
                <TentCards />

            </div>
        </div>
    )
}

export default TentTypes