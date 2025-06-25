"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import EventHighLight from './EventHighLight'
import FilterCardSubCategories from '../common/FilterCardSubCategories';
import ProjectCard from './ProjectCard';
import { Button } from './Button';
import AutoClickWrapper from '../common/helpers/AutoClickWrapper';
import { useSearchParams } from 'next/navigation';

const Portfolio = ({ data }) => {
    const PAGE_SIZE = 8;
    const [pageLimit, setPageLimit] = useState(PAGE_SIZE);
    const [selectedTags, setSelectedTags] = useState([]);
    const searchParams = useSearchParams();

    const { featuredProject, filteredProjects } = useMemo(() => {
        if (!data?.projects?.length) return { featuredProject: null, filteredProjects: [] };

        const { projects } = data;

        if (selectedTags.length === 0) {
            return {
                featuredProject: projects[0],
                filteredProjects: projects.slice(1)
            };
        }

        const filtered = projects.filter((project) => {
            return selectedTags.some((tag) =>
                project.portfolioCategories?.some?.(category => category._id === tag) ||
                project.markets?.some?.(market => market._id === tag) ||
                project.studios?.some?.(studio => studio._id === tag)
            );
        });

        return {
            featuredProject: filtered[0] || null,
            filteredProjects: filtered.slice(1)
        };
    }, [selectedTags, data]);

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

    useEffect(() => {
        const slug = searchParams.get("market");
        const selectedMarket = (data?.markets || []).find((market) => market.slug === `/${slug}`)?._id;
        if(selectedMarket) setSelectedTags([selectedMarket]);
    }, [searchParams]);

    return (
        <>
            <EventHighLight data={featuredProject} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
            <div className='w-full '>
                <div className='w-full bg-primary-border py-[20px]'>
                    <FilterCardSubCategories data={categoriesMarketStudios} handleFilterChange={handleFilterChange} selectedTags={selectedTags} isPortfolio={true} />
                </div>

                <div className="w-full lg:px-[24px] px-[12px] grid sm:grid-cols-2 grid-cols-1 lg:gap-0 lg:py-[24px] sm:gap-y-[12px] sm:gap-x-[12px] gap-y-[30px] lg:mt-0 mt-[12px]">
                    {filteredProjects.slice(0, pageLimit).map((project, index) => {
                        const isRTL = Math.floor(index / 2) % 2 === 1;
                        return (
                            <ProjectCard key={index} data={project} handleFilterChange={handleFilterChange} selectedTags={selectedTags} isRTL={isRTL} />
                        )
                    })}
                </div>
                {pageLimit < filteredProjects.length && (
                    <div className='w-full flex justify-center items-center py-[10px]'>
                        <AutoClickWrapper onIntersect={handleAutoSeeMore}>
                            <Button onClick={handleAutoSeeMore} text="load more" />
                        </AutoClickWrapper>
                    </div>
                )}
            </div>
        </>
    )
}

export default Portfolio;