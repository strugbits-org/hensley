import React from 'react'
import { PrimaryImage } from './PrimaryImage';

export const SaveProductButton = () => {
  return (
    <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition-colors">
        <PrimaryImage
            url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg"
            alt="Not Saved Icon"
            customClasses="block group-hover/cart:hidden"
        />
        <PrimaryImage
            url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg"
            alt="Saved Icon"
            customClasses="hidden group-hover/cart:block"
        />
    </div>  )
};