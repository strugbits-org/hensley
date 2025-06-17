"use client";
import React, { useEffect, useState } from 'react'
import OurMarkets from './OurMarkets'
import RelatedProducts from './RelatedProducts'
import TentTypes from './TentTypes'
import RelatedProjects from './RelatedProjects'
import { useSearchParams } from 'next/navigation'
import { searchData } from '@/services/search'
import { loaderActions } from '@/store/loaderStore';
import { HensleyNewsSearch } from '../common/HensleyNewsSearch';

const SearchResult = () => {

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();

    const setInitialValues = async () => {
        const query = searchParams.get('query');
        const data = await searchData(query);
        const { markets, tents, projects, blogs } = data;
        setMarketsData(markets);
        setBlogsData(blogs);
        setProjectsData(projects);
        setTentsData(tents);
        loaderActions.hide();
        setLoading(false);
    };

    useEffect(() => {
        setInitialValues();
    }, [searchParams]);

    return (
        <>
            {!marketsData.length && !blogsData.length && !projectsData.length && !tentsData.length && (
                <div className='h-screen flex justify-center items-center'><span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>{loading ? `Searching for results...` : "No results found"}</span></div>
            )}
            {marketsData.length > 0 && <OurMarkets data={marketsData} />}
            {/* <RelatedProducts /> */}
            {tentsData.length > 0 && <TentTypes data={tentsData} />}
            {blogsData.length > 0 && <HensleyNewsSearch data={blogsData} pageDetails={{ hensleyNewsTitle: "POSTS RELATED TO YOUR SEARCH" }} />}
            {projectsData.length > 0 && <RelatedProjects data={projectsData} />}
        </>
    )
}

export default SearchResult