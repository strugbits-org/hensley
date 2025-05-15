import React from 'react'
import { CustomLink } from '../common/CustomLink';
import { PrimaryImage } from '../common/PrimaryImage';

export const TestimonialCard = ({ data }) => {
    const { name, title, feedback, image } = data;
    return (
        <div className={"group hover:bg-primary relative min-h-[499px] lg:h-full w-full lg:border border-primary-border duration-300 ease-in-out max-w-[1240px]"}>
            <div className="absolute font-semibold inset-0 lg:inset-6 group-hover:scale-[1.3] transition-[transform] duration-300 ease-in-out w-1/2">
                <PrimaryImage timeout={0} url={image} alt={title} fit='fit' customClasses="h-full w-full object-contain object-left" />
            </div>
            <div className='ml-auto w-2/5 p-6 flex flex-col h-full'>
                <h2 className='text-[45px] leading-[45px] lg:text-[45px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular mb-2'>{name}</h2>
                <p className="my-[16px] text-[12px] lg:text-[18px] leading-[30px] text-secondary-alt font-haasRegular uppercase">{feedback}</p>
                <span className='mt-auto text-[45px] leading-[45px] lg:text-[12px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular'>{title}</span>
            </div>
        </div>
    )
}
