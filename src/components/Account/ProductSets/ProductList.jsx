'use client'
import React, { useState } from 'react'
import { PrimaryImage } from '@/components/common/PrimaryImage';
import { Tag } from '@/components/common/helpers/Tag';


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

const ProductList = ({ data, handleSearch, toggleToUpdate, setActiveProduct, addProdToggle }) => {

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px]'>
            <span className='block font-haasRegular uppercase text-[25px] text-secondary-alt'>manage your sets below</span>
            <button onClick={() => { addProdToggle() }} className='tracking-[3px] hover:tracking-[5px] hover:bg-primary hover:font-haasBold transform transition-all duration-300 border border-secondary-alt h-[45px] lg:w-[292px] w-full text-secondary-alt uppercase text-[12px] font-haasRegular'>
                create a new set
            </button>
            <InputField id="search" placeholder="SEARCH SETS" onChange={handleSearch} borderColor="secondary-alt" classes={"self-start w-[280px]"} />

            <div className='w-full flex flex-col gap-y-4'>
                {data.map((set, index) => {
                    const product = set.product;
                    const setOfProduct = set.setOfProduct;
                    return (
                        <div onClick={() => { toggleToUpdate(set) }} key={product._id + index} className='w-full flex gap-y-[10px] gap-x-[20px] py-[15px] px-[15px] cursor-pointer border border-primary-border hover:bg-primary transform transition-all duration-30'>
                            <div className=' bg-white w-[100px] h-[100px] p-2 flex-shrink-0'>
                                <PrimaryImage url={product.mainMedia} alt='testing' customClasses='h-full w-full object-cover' />
                            </div>
                            <div className='w-full text-left flex flex-col gap-y-[10px]'>
                                <span className='font-recklessLight text-secondary-alt uppercase text-[20px] block'>
                                    {product.name}
                                </span>
                                <span className='font-haasLight text-secondary-alt uppercase text-[16px] block '>
                                    set of products:
                                </span>
                                <div className='w-full flex gap-x-[6px] flex-wrap gap-y-[10px]'>
                                    {setOfProduct.map(({ product }) => (
                                        <Tag key={product._id} text={product.name} classes={"font-haasLight text-[14px] leading-[15px] p-2 text-secondary-alt"} />
                                    ))}
                                </div>

                            </div>
                        </div>
                    )
                })}
                {data.length === 0 && <span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>{"no sets found"}</span>}
            </div>
        </div>
    );
};

export default ProductList