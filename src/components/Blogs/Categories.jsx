"use client";
import React from 'react';
import FilterCardSubCategories from '../common/FilterCardSubCategories';
import BlogCard from './BlogCard';
import { PrimaryButton } from '../common/PrimaryButton';

const staticBlogData = {
    title: "Sample Blog Post Title",
    coverImage: "https://via.placeholder.com/528x528.png?text=Cover+Image",
    publishedDate: "2024-05-27",
    authorNickname: "John Doe",
    markets: [
        { category: "Luxury" },
        { category: "Events" }
    ],
    studios: [
        { name: "Studio A" },
        { name: "Studio B" }
    ]
};

const Categories = () => {
    return (
        <div className='w-full '>
            <div className='w-full bg-primary-border py-[20px]'>
                <FilterCardSubCategories data={[{ name: "one" }, { name: "two" }, { name: "three" }, { name: "four" }]} />
            </div>

            <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-[24px] sm:px-[24px] px-[12px] py-[12px]'>
                {/* Pass static data into BlogCard */}
                <BlogCard data={staticBlogData} />
                <BlogCard data={staticBlogData} />
                <BlogCard data={staticBlogData} />
                <BlogCard data={staticBlogData} />
            </div>
            <div className='w-full flex justify-center items-center pb-[90px]'>
                             <PrimaryButton
                                        className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
                                          max-h-[60px] 
                                          lg:w-[608px]
                                          w-[198px]
                                          p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
                                      >
                                        load more
                                      </PrimaryButton>
                        </div>
        </div>
    );
}

export default Categories;
