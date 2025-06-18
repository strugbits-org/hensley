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
                    <PrimaryImage
                        url={"https://static.wixstatic.com/shapes/0e0ac5_f1017d455dba40f4bde5d1d54c65b3ca.svg"}
                        alt="Arrow"
                        customClasses="group-hover:invisible absolute left-6 bottom-8 h-[20px] w-[20px] xl:h-[34px] xl:w-[34px] group-hover:h-full group-hover:w-full transition-[height] transition-[width] duration-300 ease-in-out"
                    />
                    <PrimaryImage
                        url={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                        alt="Arrow"
                        customClasses="invisible group-hover:visible absolute left-6 bottom-8 h-[20px] w-[20px] xl:h-[34px] xl:w-[34px] group-hover:h-[90%] group-hover:w-[90%] transition-[height] transition-[width] duration-300 ease-in-out"
                    />
                </div>
                <h2 className="ml-4 lg:ml-12 xl:ml-16 text-[28px] lg:text-[30px] xl:text-[45px] lg:leading-[42px] xl:leading-[70px] tracking-[-0.30px] font-recklessRegular text-primary-alt uppercase text-center lg:text-start w-full">
                    {title}
                </h2>
            </div>
        </CustomLink>
    )
}
