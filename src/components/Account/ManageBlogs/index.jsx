"use client"
import React, { useState } from 'react';
import BlogList from './BlogList';
import BlogListUpdate from './BlogListUpdate';

function ManageBlogs() {
    const [open, setOpen] = useState(false);
    const [addProdOpen, setAddProdOpen] = useState(false);
    const [currentProd, setCurrentProd] = useState('');

    // Toggle functions
    const toggle = () => setOpen(prev => !prev);
    const addProdToggle = () => setAddProdOpen(prev => !prev);

    const data = {
        heading: "Manage Blogs",
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

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {data.heading}
                </h2>
            </div>
            <div className='xl:px-[150px] px-[50px] max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
                <div className='w-full mx-auto'>

                    {(
                        open ? (
                            <BlogListUpdate toggle={toggle} />
                        ) : (
                            <BlogList toggle={toggle} />
                        )
                    )}

                </div>
            </div>
        </div>
    );
}

export default ManageBlogs;
