import Image from 'next/image'
import React from 'react'
import image from '@/assets/chair.png'
import copyIcon from '@/assets/icons/copy.png'
import arrowIcon from '@/assets/icons/darkrightArrow.svg'
import cartIcon from '@/assets/icons/saveCart.svg'

function ProductCard() {
    return (
        <div className='group transition-all duration-300 ease-in-outmax-w-[450px] border flex flex-col px-[7px] pt-[7px] pb-[2x] relative'>
            <div className="overflow-hidden h-full w-full">
                           <Image
                             src={image}
                             className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                         </div>

            <div className='lg:py-[23px] lg:pl-[23px]'>
                <div className='pl-[18px] pt-[15px] pb-[11px] lg:p-0'>
                    <span className='uppercase lg:text-[18px] lg:leading-[20px] text-[#2C2216] text-center font-haasRegular '>
                        POLTRONA MONTANA
                    </span>
                </div>
                <div className='w-full flex justify-between items-center flex-wrap gap-y-4'>
                    <div className='lg:flex  justify-center items-center hidden'>
                        <span className='text-[12px] text-[#2C2216] mr-[8px]'>MODCH39</span>
                        <Image src={copyIcon} className='h-[12px] w-[10px]' />
                    </div>
                    <span className='text-[12px] text-[#2C2216] lg:block hidden'>24”L X 30”W X 37”H</span>
                    <button className='bg-[#F0DEA2] flex items-center lg:justify-evenly gap-2 lg:w-[151px] lg:h-[42px] w-full h-[32px] justify-between
                    pl-[25px] pr-[13px] lg:pl-0 lg:pr-0
                    group/button 
                    '>
                        <span className='uppercase font-haasRegular  text-[12px] '>add to cart</span>
                        <Image src={arrowIcon} alt="Arrow Icon" className="w-4 h-4 transition-all duration-300 group-hover/button:w-[20px] group-hover/button:h-[20px]" />
                    </button>

                </div>
            </div>
            <div className="absolute right-[24px] top-[23px] border border-black rounded-full py-[18px] px-[18px]">
                <Image src={cartIcon} alt="Cart Icon" />
            </div>

        </div>

    )
}

export default ProductCard