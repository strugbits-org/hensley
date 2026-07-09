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

        // Navigation loader is shown by redirectWithLoader / CustomLink, but
        // LoaderProvider never auto-hides on /search-results. Clear it here and
        // rely on the page-local spinner so re-searches can't stick forever.
        loaderActions.hide();

        if (!searchTerm) {
            setMarketsData([]);
            setProductsData([]);
            setBlogsData([]);
            setProjectsData([]);
            setTentsData([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const run = async () => {
            try {
                const { markets, products, tents, projects, blogs } = await searchAll(searchTerm, {
                    productLimit: pageSize,
                    otherLimit: 50,
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
            loaderActions.hide();
        };
    }, [searchTerm]);

    const hasResults = productsData.length || marketsData.length || blogsData.length || projectsData.length || tentsData.length;
    const emptyMessage = !searchTerm
        ? 'Enter a search term'
        : `No results found for "${searchTerm}"`;

    return (
        <>
            {loading && (
                <div className='h-screen flex justify-center items-center'>
                    <Loading custom type='secondary' />
                </div>
            )}
            {!loading && !hasResults && (
                <div className='h-screen flex justify-center items-center'>
                    <span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>
                        {emptyMessage}
                    </span>
                </div>
            )}
            {!loading && marketsData.length > 0 && <OurMarkets pageTitle={ourMarketsTitle} data={marketsData} />}
            {!loading && productsData.length > 0 && <RelatedProducts pageTitle={relatedProductTitle} data={productsData} term={searchTerm} pageSize={pageSize} allCollections={allCollections} />}
            {!loading && tentsData.length > 0 && <TentTypes pageTitle={tentsTypeTitle} data={tentsData} />}
            {!loading && blogsData.length > 0 && <HensleyNewsSearch data={blogsData} pageDetails={{ hensleyNewsTitle: relatedPostTitle }} />}
            {!loading && projectsData.length > 0 && <RelatedProjects pageTitle={relatedProjectTitle} data={projectsData} />}
        </>
    )
}

export default SearchResult
