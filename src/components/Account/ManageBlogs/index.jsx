"use client"
import React, { useState } from 'react';
import BlogsListUpdate from './BlogsListUpdate';
import BlogsList from './BlogsList';

function ManageBlogs({ data }) {
    const { blogsData, productsData, marketsData, studiosData } = data;
    const [activeBlog, setActiveBlog] = useState(null);
    const [open, setOpen] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState(blogsData);

    const handleSearch = (term = '') => {
        const filteredData = blogsData.filter((item) => item.titleAndDescription.toLowerCase().includes(term.toLowerCase()));
        setFilteredBlogs(filteredData);
    };

    const handleSelectedBlog = (item) => {
        if (item) {
            setActiveBlog(item);
            setOpen(true);
        } else {
            setActiveBlog(null);
            setOpen(false);
        }
    }

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    Manage Blogs
                </h2>
            </div>
            <div className='xl:px-[150px] px-[50px] max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
                <div className='w-full mx-auto'>

                    {(
                        open ? (
                            <BlogsListUpdate data={activeBlog} productsData={productsData} studiosData={studiosData} marketsData={marketsData} handleSelectedBlog={handleSelectedBlog} setFilteredBlogs={setFilteredBlogs} />
                        ) : (
                            <BlogsList data={filteredBlogs} products={productsData} handleSearch={handleSearch} handleSelectedBlog={handleSelectedBlog} />
                        )
                    )}

                </div>
            </div>
        </div>
    );
}

export default ManageBlogs;
