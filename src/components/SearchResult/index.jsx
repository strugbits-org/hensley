"use client";
import React, { useEffect, useState } from 'react'
import OurMarkets from './OurMarkets'
import RelatedProducts from './RelatedProducts'
import TentTypes from './TentTypes'
import RelatedProjects from './RelatedProjects'
import { useSearchParams } from 'next/navigation'
import { searchAll } from '@/services/search'
import { loaderActions } from '@/store/loaderStore';
import { HensleyNewsSearch } from '../common/HensleyNewsSearch';
import Loading from '@/components/common/Loading';

const SearchResult = ({ pageDetails, allCollections = [] }) => {

    const { relatedPostTitle, tentsTypeTitle, ourMarketsTitle, relatedProductTitle, relatedProjectTitle } = pageDetails;

    const searchParams = useSearchParams();
    const searchTerm = (searchParams.get('query') || '').trim();

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(!!searchTerm);
    const pageSize = 24;

    useEffect(() => {
        let cancelled = false;

        if (!searchTerm) {
            setMarketsData([]);
            setProductsData([]);
            setBlogsData([]);
            setProjectsData([]);
            setTentsData([]);
            setLoading(false);
            loaderActions.hide();
            return;
        }

        setLoading(true);

        const run = async () => {
            try {
                const { markets, products, tents, projects, blogs } = await searchAll(searchTerm, {
                    limits: {
                        products: pageSize,
                        tents: 50,
                        blogs: 50,
                        projects: 50,
                        markets: 50,
                    },
                });
                if (cancelled) return;
                setMarketsData(markets);
                setProductsData(products);
                setBlogsData(blogs);
                setProjectsData(projects);
                setTentsData(tents);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    loaderActions.hide();
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [searchTerm]);

    const hasResults = productsData.length || marketsData.length || blogsData.length || projectsData.length || tentsData.length;
    const emptyMessage = !searchTerm
        ? 'Enter a search term'
        : `No results found for "${searchTerm}"`;

    if (loading) {
        return (
            <div className='h-screen flex justify-center items-center bg-primary-alt'>
                <Loading custom type='secondary' />
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className='h-screen flex justify-center items-center bg-primary-alt'>
                <span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>
                    {emptyMessage}
                </span>
            </div>
        );
    }

    return (
        <>
            {marketsData.length > 0 && <OurMarkets pageTitle={ourMarketsTitle} data={marketsData} />}
            {productsData.length > 0 && <RelatedProducts pageTitle={relatedProductTitle} data={productsData} term={searchTerm} pageSize={pageSize} allCollections={allCollections} />}
            {tentsData.length > 0 && <TentTypes pageTitle={tentsTypeTitle} data={tentsData} />}
            {blogsData.length > 0 && <HensleyNewsSearch data={blogsData} pageDetails={{ hensleyNewsTitle: relatedPostTitle }} />}
            {projectsData.length > 0 && <RelatedProjects pageTitle={relatedProjectTitle} data={projectsData} />}
        </>
    )
}

export default SearchResult
