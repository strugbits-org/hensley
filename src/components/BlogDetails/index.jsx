"use client";
import React from 'react'
import EventHighLight from './EventHighLight'
import { convertToHTMLBlog } from '@/utils/renderRichText';
import { FeaturedProducts } from '../Product/FeaturedProducts';
import { HensleyNews } from '../common/HensleyNews';

const BlogDetails = ({ data }) => {

    const { blog, otherBlogs } = data;
    const { storeProducts = [] } = blog;

    return (
        <>
            <EventHighLight data={blog} />
            <div className='px-[24px] w-full'>
                {convertToHTMLBlog({
                    content: blog.blogRef.richContent,
                    class_heading: "text-secodary-alt font-haasRegular text-3xl lg:text-[32px] leading-tight text-left",
                    class_p: "text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-8",
                    class_ul: "list-disc pl-6 text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-8 space-y-2",
                    class_ol: "list-decimal pl-6 text-secondary-alt font-haasRegular text-sm lg:text-base text-left mb-8 space-y-2",
                })}
            </div>
            <FeaturedProducts classes={'z-10'} data={storeProducts.map((product) => ({ product }))} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="start" />
            <HensleyNews data={otherBlogs} pageDetails={{ hensleyNewsTitle: "Other Posts" }} loop={false} origin="start" titleType='secondary' />
        </>
    )
}

export default BlogDetails;