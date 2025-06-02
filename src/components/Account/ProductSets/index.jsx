"use client"
import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductListUpdate from './ProductListUpdate';



function ProductSets() {

    const data = {
        heading: "product sets",
        email: "gabriel@petrikor.design"
    };

  

    return (
        <div className='MyAccount w-full max-lg:mb-[85px] '>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px]  font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {data.heading}
                </h2>
            </div>
            <div className='px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
            <div className='max-w-[900px] w-full mx-auto '>
                {/* <ProductList /> */}
                <ProductListUpdate />
                </div>
            </div>
        </div>
    );
}

export default ProductSets;
