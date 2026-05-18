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
import Loading from '@/app/loading';

const SearchResult = ({ pageDetails, allCollections = [] }) => {

    const { relatedPostTitle, tentsTypeTitle, ourMarketsTitle, relatedProductTitle, relatedProjectTitle } = pageDetails;

    const searchParams = useSearchParams();
    const queryTerm = (searchParams.get('query') || '').trim();

    const [marketsData, setMarketsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [tentsData, setTentsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(queryTerm);
    const [loading, setLoading] = useState(!!queryTerm);
    const pageSize = 24;

    const setInitialValues = async () => {
        const [markets, products, otherData] = await Promise.all([
            searchMarkets(searchTerm),
            searchProducts({ term: searchTerm, pageLimit: pageSize }),
            searchOtherData(searchTerm)
        ]);

        const { tents, projects, blogs } = otherData;

        setMarketsData(markets);
        setProductsData(products);
        setBlogsData(blogs);
        setProjectsData(projects);
        setTentsData(tents);

        setLoading(false);
        loaderActions.hide();
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            setInitialValues();
        } else {
            loaderActions.hide();
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const term = (searchParams.get('query') || '').trim();
        if (term) {
            setLoading(true);
            setMarketsData([]);
            setProductsData([]);
            setBlogsData([]);
            setProjectsData([]);
            setTentsData([]);
        }
        setSearchTerm(term);
    }, [searchParams]);

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