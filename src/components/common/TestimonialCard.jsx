import React from 'react'
import { PrimaryImage } from '../common/PrimaryImage';

export const TestimonialCard = ({ data, classes }) => {
    const { name, title, feedback, image } = data;
    return (
        <div className={`flex flex-col lg:flex-row group lg:hover:bg-primary bg-primary lg:bg-transparent relative min-h-[499px] lg:h-full w-full lg:border border-primary-border duration-300 ease-in-out max-w-[1240px] flex-shrink-0 ${classes}`}>
            <div className='w-full lg:w-1/2 max-h-[364px] lg:max-h-none h-full relative flex p-3 lg:p-6 group-hover:lg:p-0 transition-all duration-300 ease-in-out'>
                <PrimaryImage url={image} alt={title} customClasses="grow" max_h={600} />
            </div>
            <div className='w-full lg:w-1/2 p-6 flex flex-col'>
                <h2 className='text-center lg:text-start text-[35px] leading-[42px] lg:text-[45px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular mb-2'>{name}</h2>
                <p className="text-center lg:text-start my-[16px] text-[14px] lg:text-[18px] leading-[30px] text-secondary-alt font-haasRegular uppercase">{feedback}</p>
                <span className='mt-auto text-center lg:text-start text-[12px] leading-[42px] lg:text-[12px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular'>{title}</span>
            </div>
        </div>
    )
}