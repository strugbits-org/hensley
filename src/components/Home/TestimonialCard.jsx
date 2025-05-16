import React from 'react'
import { PrimaryImage } from '../common/PrimaryImage';

export const TestimonialCard = ({ data, classes }) => {
    const { name, title, feedback, image } = data;
    return (
        <div className={`flex flex-col lg:flex-row group lg:hover:bg-primary bg-primary lg:bg-transparent relative min-h-[499px] lg:h-full w-full lg:border border-primary-border duration-300 ease-in-out max-w-[1240px] flex-shrink-0 ${classes}`}>
            <div className='lg:min-w-[364px] 2xl:min-w-[584px] lg:h-[364px] 2xl:h-[499px] flex justify-center items-center p-3 lg:p-6 group-hover:lg:p-0 transition-all duration-300 ease-in-out'>
                <PrimaryImage timeout={0} url={image} min_h={499} min_w={584} alt={title} customClasses="h-full w-full" />
            </div>
            <div className='grow p-6 flex flex-col'>
                <h2 className='text-center lg:text-start text-[35px] leading-[42px] lg:text-[45px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular mb-2'>{name}</h2>
                <p className="text-center lg:text-start my-[16px] text-[14px] lg:text-[18px] leading-[30px] text-secondary-alt font-haasRegular uppercase">{feedback}</p>
                <span className='mt-auto text-center lg:text-start text-[12px] leading-[42px] lg:text-[12px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular'>{title}</span>
            </div>
        </div>
    )
}