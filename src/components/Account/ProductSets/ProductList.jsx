'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import image from '@/assets/product-set-1.png'


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


const Buttons = ({ text, classes }) => {
    return (
        <>
            <button className={`${classes} border uppercase bg-white font-haasLight text-[14px] leading-[15px] p-2`}>{text}</button>
        </>
    )
}


const ProductCards = ({ data, toggle }) => {
    return (
        <div className='w-full flex gap-y-[10px] gap-x-[20px] py-[15px] px-[15px] cursor-pointer border hover:bg-primary transform transition-all duration-30' onClick={() => { toggle() }}>
            <div className=' bg-white w-[100px] h-[90px] '>
                <Image src={image} alt='testing' className='h-full w-full object-contain' />
            </div>
            <div className='w-full text-left flex flex-col gap-y-[10px]'>
                <span className='font-haasRegular text-secondary-alt uppercase text-[20px] block'>
                    {data.title}
                </span>
                <span className='
                font-haasRegular
                text-secondary-alt
                uppercase
                text-[16px]
                block
                '>
                    set of products:
                </span>
                <div className='w-full flex gap-x-[6px] flex-wrap gap-y-[10px]'>
                    <Buttons text={"corporate"} />
                    <Buttons text={"event design and production"} />
                    <Buttons text={"creative services agency"} />
                    <Buttons text={"+3 studios"} />

                </div>

            </div>
        </div>
    );
};


const ProductList = ({ toggle, data, setCurrentProd, addProdToggle }) => {
    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px]'>
            <span className='block font-haasRegular uppercase text-[25px] text-secondary-alt'>manage your sets below</span>
            <button onClick={() => { addProdToggle() }} className='tracking-[3px] hover:tracking-[5px] hover:bg-primary hover:font-haasBold transform transition-all duration-300 border border-secondary-alt h-[45px] lg:w-[292px] w-full text-secondary-alt uppercase text-[12px] font-haasRegular'>
                create a new set
            </button>
            <InputField id="search" placeholder="SEARCH SETS" borderColor="secondary-alt" classes={"self-start w-[280px]"} />

            {data.map((dt) => (
                <ProductCards data={dt} toggle={toggle} />
            ))}
        </div>
    );
};

export default ProductList