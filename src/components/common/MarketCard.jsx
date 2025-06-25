import React from 'react'
import { PrimaryImage } from './PrimaryImage'
import { CustomLink } from './CustomLink';

export const MarketCard = ({ data, size, classes }) => {
    const { title, image1 } = data;
    return (
        <CustomLink to={`/market${data.slug}`} className={`relative group w-full border border-white min-h-[382px] lg:min-h-[608px] overflow-hidden ${size === "large" ? "lg:w-1/2" : "lg:w-1/3"} ${classes}`}>
            <div className='absolute inset-0 p-6 group-hover:p-0 transition-all duration-300 ease-in-out'>
                <PrimaryImage timeout={0} url={image1} alt={title} customClasses='h-full w-full object-cover' />
            </div>
            <div className='flex items-end absolute inset-6 p-4'>
                <div className='arrow hidden lg:block'>
                    <PrimaryImage url={"https://static.wixstatic.com/shapes/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"} alt={"Arrow"} customClasses={`absolute fill-primary-alt left-6 w-[34px] h-[34px] transition-all duration-500 ease-in-out group-hover:w-[90%] ${size === "large" ? "bottom-20 group-hover:h-[75%]" : "bottom-8 group-hover:h-[90%]"}`} />
                    <PrimaryImage url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"} alt={"Arrow"} customClasses="absolute fill-primary-alt left-6 bottom-8 w-[34px] h-[34px] group-hover:invisible" />
                </div>
                <h2 className="ml-4 lg:ml-12 xl:ml-16 text-[28px] lg:text-[30px] xl:text-[45px] lg:leading-[42px] xl:leading-[70px] tracking-[-0.30px] font-recklessRegular text-primary-alt uppercase text-center lg:text-start w-full">
                    {title}
                </h2>
            </div>
        </CustomLink>
    )
}
