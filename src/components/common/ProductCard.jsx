import Image from 'next/image';
import React from 'react';
import copyIcon from '@/assets/icons/copy.png';
import arrowIcon from '@/assets/icons/darkrightArrow.svg';
import cartIcon from '@/assets/icons/saveCart.svg';
import cartIconFill from '@/assets/icons/saveCartFill.svg'
import { PrimaryImage } from './PrimaryImage';

function ProductCard({ imageSrc, title, code, dimensions, onAddToCart }) {
    return (
        <div className="group transition-all duration-300 ease-in-out max-w-[450px] border flex flex-col pt-[7px] relative">
            <div className="overflow-hidden h-full w-full">
                <PrimaryImage fit='fit' alt={title} url={imageSrc} customClasses={"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"} />

            </div>

            <div className="lg:pt-[23px] lg:pb-[8px] lg:pl-[23px]">
                <div className="pl-[18px] pt-[15px] pb-[11px] lg:p-0">
                    <span className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt text-center font-haasRegular">
                        {title}
                    </span>
                </div>

                <div className="w-full flex justify-between items-center flex-wrap gap-y-4">
                    <div className="lg:flex justify-center items-center hidden">
                        <span className="text-[12px] text-secondary-alt mr-[8px]">{code}</span>
                        <Image src={copyIcon} className="h-[12px] w-[10px]" alt="Copy Icon" />
                    </div>

                    <span className="text-[12px] text-secondary-alt lg:block hidden">{dimensions}</span>

                    <button
                        className="bg-primary flex items-center lg:justify-evenly gap-2 lg:w-[151px] lg:h-[42px] w-full h-[32px] justify-between
              pl-[25px] pr-[13px] lg:pl-0 lg:pr-0 group/button"
                        onClick={onAddToCart}
                    >
                        <span className="uppercase font-haasRegular text-[12px]">add to cart</span>
                        <Image
                            src={arrowIcon}
                            alt="Arrow Icon"
                            className="w-4 h-4 transition-all duration-300 group-hover/button:w-[20px] group-hover/button:h-[20px]"
                        />
                    </button>
                </div>
            </div>

            <div className="group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] flex items-center justify-center shrink-0 cursor-pointer">
                <Image
                    src={cartIcon}
                    alt="Cart Icon"
                    className="block group-hover/cart:hidden"
                />
                <Image
                    src={cartIconFill}
                    alt="Cart Icon Filled"
                    className="hidden group-hover/cart:block"
                />
            </div>

        </div>
    );
}

export default ProductCard;
