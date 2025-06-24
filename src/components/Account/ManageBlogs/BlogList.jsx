'use client'
import React, { useState } from 'react'


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

const List = ({ data, toggle }) => {
    const { title, authorName, studios, markets } = data;
    return (
        <div className='w-full px-[10px] gap-y-[25px] flex flex-col justify-center items-center py-[20px] bg-[#FFFDF9] '>
            <div className='w-full gap-y-[30px] grid sm:grid-cols-[40%_1fr_1fr_1fr] grid-cols-1'>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        blog title
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-recklessRegular'
                    >
                        {title}
                    </span>
                </div>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        Author name
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-recklessRegular'
                    >
                        {authorName}
                    </span>
                </div>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        studios
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt font-recklessRegular'
                    >
                        {studios}
                    </span>
                </div>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        markets
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt  font-recklessRegular'
                    >
                        {markets}
                    </span>
                </div>
            </div>
            <button 
            onClick={()=>{toggle()}}
            className={`
        sm:w-[400px]
        w-full
        h-[40px]
         bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
        relative
        `}>
                <span
                    className='
             font-haasLight uppercase
        lg:text-[16px] 
        group-hover:font-haasBold
            '
                >Manage Data</span>


            </button>
        </div>
    )
}

const blogs = [
    {
        title: 'Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach',
        authorName: 'Carolina Ortiz',
        studios: 'Custom Furniture, Event Design & Production, Specialty Rentals',
        markets: 'social'
    },
    {
        title: 'Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach',
        authorName: 'Carolina Ortiz',
        studios: 'Custom Furniture, Event Design & Production, Specialty Rentals',
        markets: 'social'
    },
    {
        title: 'Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach',
        authorName: 'Carolina Ortiz',
        studios: 'Custom Furniture, Event Design & Production, Specialty Rentals',
        markets: 'social'
    },
    {
        title: 'Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach',
        authorName: 'Carolina Ortiz',
        studios: 'Custom Furniture, Event Design & Production, Specialty Rentals',
        markets: 'social'
    },
    {
        title: 'Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach',
        authorName: 'Carolina Ortiz',
        studios: 'Custom Furniture, Event Design & Production, Specialty Rentals',
        markets: 'social'
    },

]

const BlogList = ({ toggle, data, setCurrentProd, addProdToggle }) => {
    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px]'>

            <div className='w-full flex flex-col justify-center items-center'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                    Search Blog
                </label>
                <InputField id="search" placeholder="ENTER A BLOG TITLE..." borderColor="secondary-alt" classes={'w-[350px]'} />
            </div>
            <div className='w-full flex flex-col gap-y-[30px]'>
                {blogs.map((dt) => (
                    <List data={dt} toggle={toggle} />
                ))}
            </div>
        </div>
    );
};

export default BlogList