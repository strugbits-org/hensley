"use client";
import React, { useEffect, useState } from 'react'
import OurMarkets from './OurMarkets'
import RelatedProducts from './RelatedProducts'
import TentTypes from './TentTypes'
import RelatedProjects from './RelatedProjects'
import { HensleyNews } from '../common/HensleyNews'
import { useSearchParams } from 'next/navigation'
import { searchData } from '@/services/search'

const SearchResult = () => {

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);

    const searchParams = useSearchParams();

    const setInitialValues = async () => {
        const query = searchParams.get('query');
        const data = await searchData(query);
        console.log("The data is-: ",data);
        const { markets, tents, projects, blogs } = data;
        setMarketsData(markets);
        setBlogsData(blogs);
        setProjectsData(projects);
        setTentsData(tents);
    };

    useEffect(() => {
        setInitialValues();
    }, [searchParams]);

    return (
        <>
            <OurMarkets data={marketsData} />
            {/* <RelatedProducts /> */}
            <HensleyNews data={blogsData} pageDetails={{ hensleyNewsTitle: "POSTS RELATED TO YOUR SEARCH" }} />
            {/* <TentTypes /> */}
            {/* <RelatedProjects /> */}
        </>
    )
}

export default SearchResult