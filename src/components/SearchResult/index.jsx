"use client";
import React, { useEffect, useState } from 'react'
import OurMarkets from './OurMarkets'
import RelatedProducts from './RelatedProducts'
import TentTypes from './TentTypes'
import RelatedProjects from './RelatedProjects'
import { useSearchParams } from 'next/navigation'
import { searchMarkets, searchOtherData, searchProducts } from '@/services/search'
import { loaderActions } from '@/store/loaderStore';
import { HensleyNewsSearch } from '../common/HensleyNewsSearch';

const SearchResult = ({ pageDetails, allCollections = [] }) => {

    const { relatedPostTitle, tentsTypeTitle, ourMarketsTitle, relatedProductTitle, relatedProjectTitle } = pageDetails;

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageSize = 24;

    const searchParams = useSearchParams();
    const searchTerm = (searchParams.get('query') || '').trim();

    // Re-fires whenever the URL's query string changes, even when the
    // resolved term is identical to the previous render (re-submitting the
    // same term from the modal would otherwise leave the global loader
    // stuck on, because no state changed and no effect re-ran).
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
                const [markets, products, otherData] = await Promise.all([
                    searchMarkets(searchTerm),
                    searchProducts({ term: searchTerm, pageLimit: pageSize }),
                    searchOtherData(searchTerm),
                ]);
                if (cancelled) return;
                const { tents, projects, blogs } = otherData;
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
    }, [searchParams]);

    const hasResults = productsData.length || marketsData.length || blogsData.length || projectsData.length || tentsData.length;
    const emptyMessage = loading
        ? 'Searching for results...'
        : !searchTerm
            ? 'Enter a search term'
            : `No results found for "${searchTerm}"`;

    return (
        <>
            {!hasResults && (
                <div className='h-screen flex justify-center items-center'><span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>{emptyMessage}</span></div>
            )}
            {marketsData.length > 0 && <OurMarkets pageTitle={ourMarketsTitle} data={marketsData} />}
            {productsData.length > 0 && <RelatedProducts pageTitle={relatedProductTitle} data={productsData} term={searchTerm} pageSize={pageSize} allCollections={allCollections} />}
            {tentsData.length > 0 && <TentTypes pageTitle={tentsTypeTitle} data={tentsData} />}
            {blogsData.length > 0 && <HensleyNewsSearch data={blogsData} pageDetails={{ hensleyNewsTitle: relatedPostTitle }} />}
            {projectsData.length > 0 && <RelatedProjects pageTitle={relatedProjectTitle} data={projectsData} />}
        </>
    )
}

export default SearchResult