'use client'
import React, { useState } from 'react'

const InputField = ({ id, label, placeholder, classes, borderColor = 'secondary-alt', type = "text", onChange }) => {
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
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm bg-gray-100
                    border-b 
                    border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}
                    hover:border-b-2
                    outline-none transition-all duration-300 uppercase
                `}
            />
        </div>
    );
};

const Card = ({ data, handleSelectedBlog }) => {
    const { author, blogRef, studios, markets } = data;
    const marketsString = markets.map((market) => market?.category || market?.title).join(', ');
    const studiosString = studios.map((studio) => studio.name).join(', ');
    const authorName = author ? (author?.nickname || author?.firstName + ' ' + author?.lastName) : 'N/A';

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
                        {blogRef?.title}
                    </span>
                </div>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        Author Name
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt font-recklessRegular uppercase'
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
                        className='text-[16px] block text-secondary-alt font-recklessRegular uppercase'
                    >
                        {studiosString || 'N/A'}
                    </span>
                </div>
                <div className='flex flex-col sm:gap-y-[20px] gap-y-[10px]'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        markets
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt  font-recklessRegular uppercase'
                    >
                        {marketsString || 'N/A'}
                    </span>
                </div>
            </div>
            <button
                onClick={handleSelectedBlog}
                className={`sm:w-[400px] w-full h-[40px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative`}>
                <span className='font-haasLight uppercase lg:text-[16px] group-hover:font-haasBold'>Manage Data</span>
            </button>
        </div>
    )
}

const BlogsList = ({ data = [], handleSelectedBlog, handleSearch }) => {

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px]'>

            <div className='w-full flex flex-col justify-center items-center'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                    Search Blogs
                </label>
                <InputField id="search" placeholder="SEARCH BLOGS" onChange={handleSearch} borderColor="secondary-alt" classes={"self-center w-[280px]"} />
            </div>
            <div className='w-full flex flex-col gap-y-[30px]'>
                {data.map((item) => (
                    <Card key={item._id} data={item} handleSelectedBlog={() => handleSelectedBlog(item)} />
                ))}
                {data.length === 0 && <p className='text-secondary-alt text-[20px] font-haasRegular uppercase'>No blogs found</p>}
            </div>
        </div>
    );
};

export default BlogsList;