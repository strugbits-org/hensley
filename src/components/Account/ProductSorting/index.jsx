'use client'
import React, { useState } from 'react'
import Listing from './Listing';


const data = {
    heading: "Product Sorting",
    email: "gabriel@petrikor.design",
    productSetsData: [
        {
            id: 1,
            title: "vintage - dance floor",
            tags: ["corporate", "event design and production", "creative services agency", "+3 studios"],
            image: "/product-set-1.png"
        },
        {
            id: 2,
            title: "modern - stage decor",
            tags: ["wedding", "lighting", "custom build"],
            image: "/product-set-1.png"
        },
        {
            id: 3,
            title: "boho - lounge area",
            tags: ["furniture", "rugs", "pillows"],
            image: "/product-set-1.png"
        }
    ]
};

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

const categoires = ["additional products", "aruba", "banquet tables", "banquettes", "bars & backbars", "barstools", "barware"]

const Categories = ({ text, toggle }) => {
    return (
        <>

            <button onClick={toggle} className='text-[24px] bg-white px-[15px] py-[10px] rounded text-secondary-alt uppercase font-haasRegular text-left'>
                {text}
            </button>
        </>
    )
}



const ProductSorting = () => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(prev => !prev);
    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {data.heading}
                </h2>
            </div>
            <div className='px-[50px] sm:py-[20px] flex flex-col gap-y-[15px] max-lg:mt-3 '>

                <div className='w-full mx-auto'>

                    {(
                        open ? (
                            <Listing />
                        ) : (
                            <>
                                <div className='w-full flex flex-col gap-y-[15px]'>
                                   <div className='flex justify-between w-full'>
                                     <span
                                        className='text-[30px] block text-secondary-alt uppercase font-haasBold'
                                    >
                                        categories
                                    </span>
                                    <InputField id="search" placeholder="SEARCH CATEGORIES" borderColor="secondary-alt" classes={'w-[350px]'} />
                                   </div>
                             
                                <div className='w-full grid grid-cols-3 gap-[15px]'>
                                    {categoires.map((dt) => (
                                        <Categories text={dt} toggle={toggle} />
                                    ))}
                                </div>
                                   </div>
                            </>
                        )
                    )}

                </div>

            </div>
        </div>
    );
};

export default ProductSorting