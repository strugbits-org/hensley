"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FilterCardSubCategories from '../common/FilterCardSubCategories';
import BlogCard from './BlogCard';
import { PrimaryButton } from '../common/PrimaryButton';
import EventHighLight from './EventHighLight';

const Blogs = ({ data }) => {
    const PAGE_SIZE = 8;
    const [pageLimit, setPageLimit] = useState(PAGE_SIZE);
    const [selectedTags, setSelectedTags] = useState([]);

    const { featuredBlog, filteredBlogs } = useMemo(() => {
        if (!data?.blogs?.length) {
            return { featuredBlog: null, filteredBlogs: [] };
        }

        const { blogs } = data;

        if (selectedTags.length === 0) {
            return {
                featuredBlog: blogs[0],
                filteredBlogs: blogs.slice(1)
            };
        }

        const filtered = blogs.filter((blog) => {
            return selectedTags.some((tag) =>
                blog.blogCategories?.some?.(category => category._id === tag) ||
                blog.markets?.some?.(market => market._id === tag) ||
                blog.studios?.some?.(studio => studio._id === tag)
            );
        });

        return {
            featuredBlog: filtered[0] || null,
            filteredBlogs: filtered.slice(1)
        };
    }, [selectedTags, data]);

    const visibleBlogs = useMemo(() => {
        return filteredBlogs.slice(0, pageLimit);
    }, [filteredBlogs, pageLimit]);

    const categoriesMarketStudios = useMemo(() => {
        return data?.categoriesMarketStudios || [];
    }, [data?.categoriesMarketStudios]);

    const handleAutoSeeMore = useCallback(() => {
        setPageLimit((prev) => prev + PAGE_SIZE);
    }, [PAGE_SIZE]);

    const handleFilterChange = useCallback((id) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(id)) {
                return prevTags.filter((tag) => tag !== id);
            }
            return [...prevTags, id];
        });
        setPageLimit(PAGE_SIZE);
    }, [PAGE_SIZE]);

    useEffect(() => {
        setPageLimit(PAGE_SIZE);
    }, [selectedTags, PAGE_SIZE]);

    if (!data?.blogs?.length) {
        return <div className="w-full p-8 text-center">No blogs available</div>;
    }

    return (
        <div className="w-full">
            {featuredBlog && <EventHighLight data={featuredBlog} handleFilterChange={handleFilterChange} />}

            <div className="w-full bg-primary-border py-5">
                <FilterCardSubCategories
                    data={categoriesMarketStudios}
                    handleFilterChange={handleFilterChange}
                    selectedTags={selectedTags}
                />
            </div>

            <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 sm:px-6 px-3 py-3">
                {visibleBlogs.map((item, index) => (
                    <BlogCard
                        key={item._id || item.id || index}
                        data={item}
                        selectedTags={selectedTags}
                    />
                ))}
            </div>

            {pageLimit < filteredBlogs.length && (
                <div className="w-full flex justify-center items-center pb-[90px]">
                    <PrimaryButton
                        onClick={handleAutoSeeMore}
                        className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt max-h-[60px] lg:w-[608px] w-[198px] p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
                    >
                        Load More
                    </PrimaryButton>
                </div>
            )}

            {(pageLimit < filteredBlogs.length || featuredBlog) && filteredBlogs.length === 0 && selectedTags.length > 0 && (
                <div className='h-screen flex justify-center items-center'><span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>No blogs found for the selected filters.</span></div>

            )}
        </div>
    );
};

export default Blogs;