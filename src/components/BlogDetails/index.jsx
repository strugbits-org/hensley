"use client";
import React from 'react'
import EventHighLight from './EventHighLight'
import { convertToHTMLRichContent } from '@/utils/renderRichText';
import { FeaturedProducts } from '../Product/FeaturedProducts';
import { HensleyNews } from '../common/HensleyNews';

const BlogDetails = ({ data }) => {
    const { blog, otherBlogs } = data;
    const { storeProducts = [] } = blog;
    const { featuredProductTitle, hensleyNewsTitle } = data;

    return (
        <>
            <EventHighLight data={blog} />
            <div className='px-[24px] w-full border-b border-primary-border mb-10'>
                {convertToHTMLRichContent({
                    content: blog.blogRef.richContent,
                    class_heading: "text-secodary-alt font-haasRegular text-3xl lg:text-[32px] leading-tight text-left",
                    class_p: "text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-4",
                    class_ul: "list-disc pl-6 text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-8 space-y-2",
                    class_ol: "list-decimal pl-6 text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-8 space-y-2",
                    class_gallery_item: "w-full flex",
                    class_image: "w-full h-full object-cover object-center",
                })}
            </div>
            <FeaturedProducts classes={'z-10'} data={storeProducts.map((product) => ({ product }))} pageDetails={{ featuredProjectTitle: featuredProductTitle || "PRODUCTS FEATURED IN THIS POST ENTRY:" }} loop={false} origin="auto" />
            <HensleyNews data={otherBlogs} pageDetails={{ hensleyNewsTitle: hensleyNewsTitle || "Other Posts" }} loop={false} origin="auto" titleType='secondary' />
        </>
    )
}

export default BlogDetails;