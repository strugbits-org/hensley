'use client'
import React, { useState } from 'react'
import { MatchFeatureSlider } from './MatchFeatureSlide'
import image from '@/assets/plate-2.png'
import Image from 'next/image';


const products = [
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
    {
        image,
        name: '12 Bonze floor fan'
    },
]


const InputField = ({ id, label, placeholder, classes, borderColor = 'black', type = "text" }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm
                    border-b 
                    border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}
                    hover:border-b-2
                    outline-none transition-all duration-300
                `}
            />
        </div>
    );
};

const Cards = ({ data }) => {
    return (
        <div className='w-full group border border-primary-border pb-6 px-[5px] pt-[5px] relative'>
            <div className='w-full'>
                <Image src={data.image} className='h-full w-full object-contain' />
            </div>
            <span
                className='text-[12px] mt-2 block text-secondary-alt uppercase font-recklessRegular'
            >
                {data.name}
            </span>
            <div className='w-full px-[15px] hidden group-hover:block absolute sm:top-5 top-11 left-1/2 transform -translate-x-1/2'>
                <button className={`
                rounded-full
        w-full
        sm:my-[33px]
        p-2
         bg-white tracking-[3px] group transform transition-all duration-300 hover:bg-primary 
        relative
        `}>
                    <span
                        className='
             font-haasLight uppercase 
        lg:text-[12px] 
        group-hover:font-haasBold
            '
                    >Add</span>


                </button>
            </div>
        </div>
    )
}

const MatchFeature = () => {
    return (
        <div className='sm:w-[650px] sm:h-[800px] pt-[20px] pb-[80px] w-[600px] max-sm:h-[700px] hide-scrollbar sm:mt-0 mt-[50px] overflow-y-scroll flex-col flex gap-x-[24px] gap-y-[20px]  px-[20px] bg-primary-alt z-[999999] box-border'>
            <div className='w-full text-center'>
                <span
                    className='text-[25px] text-secondary-alt uppercase font-recklessRegular'
                >
                    match it with
                </span>
            </div>
            <div className='w-full min-h-[220px]'>
                <MatchFeatureSlider />
            </div>
            <div className='w-full'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                    Search
                </label>
                <InputField id="search" placeholder="ENTER A PRODUCT NAME" borderColor="secondary-alt" classes={'w-[50%]'} />
            </div>
            <div className='w-full grid sm:grid-cols-4 grid-cols-2 gap-[16px] overflow-y-scroll hide-scrollbar'>
                {products.map((dt) => {
                    return <Cards data={dt} />
                })}
            </div>
        </div>
    )
}

export default MatchFeature