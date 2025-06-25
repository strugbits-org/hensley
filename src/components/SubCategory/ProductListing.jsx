'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import { ProductsFilterPopup } from '../common/ProductsFilterPopup';
import { ProductBanner } from '../common/ProductBanner';
import Loading from '@/app/loading';
import AutoClickWrapper from '../common/helpers/AutoClickWrapper';
import { findSortIndexByCategory, logError } from '@/utils';
import { fetchSortedProducts } from '@/services/collections';
import { fetchSavedProductData } from '@/services/products';

// Debounce utility function
const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
};

export const ProductListing = ({ data }) => {
    const { selectedCategory, sortedProducts, subCategories, collectionIds, sortIndex, categoriesSortData, productBannersData } = data;

    let bannerIndex = -1;
    const pageSize = 12;

    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [bannersDesktop, setBannersDesktop] = useState([]);
    const [bannersMobile, setBannersMobile] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const fetchProducts = useCallback(async ({ newFilters = selectedFilters, isLoadMore = false, newSkip = 0 }) => {
        const activeCollectionIds = newFilters.length > 0
            ? newFilters.map(f => f._id)
            : collectionIds;

        try {
            const newSortIndex = newFilters.length === 1 ? findSortIndexByCategory(categoriesSortData, newFilters[0]._id) : sortIndex;
            const newSortedProducts = await fetchSortedProducts({
                collectionIds: activeCollectionIds,
                limit: pageSize,
                skip: newSkip,
                sortIndex: newSortIndex
            });

            if (isLoadMore) {
                setProducts(prevProducts => [...prevProducts, ...newSortedProducts.items]);
            } else {
                setProducts(newSortedProducts.items);
            }

            setHasMore(newSortedProducts.hasNext);
            return newSortedProducts;
        } catch (error) {
            logError(`Error fetching ${isLoadMore ? 'more' : 'sorted'} products:`, error);
            return null;
        }
    }, [collectionIds, selectedFilters, sortIndex]);

    const debouncedFetchForFilters = useDebounce((newFilters) => {
        fetchProducts({ newFilters, isLoadMore: false, newSkip: 0 })
            .finally(() => setIsLoading(false));
    }, 300);

    const handleFilterChange = (filter) => {
        const isSelected = selectedFilters.some(f => f._id === filter._id);
        const newFilters = isSelected
            ? selectedFilters.filter(f => f._id !== filter._id)
            : [...selectedFilters, filter];

        setSelectedFilters(newFilters);
        setIsLoading(true);
        debouncedFetchForFilters(newFilters);
    };

    const handleLoadMore = async () => {
        if (!hasMore) return;
        await fetchProducts({
            isLoadMore: true,
            newSkip: products.length
        });
    };

    useEffect(() => {
        if (Array.isArray(productBannersData)) {
            setBannersDesktop(
                productBannersData
                    .filter(item => item.isDesktop)
                    .toSorted((a, b) => a.orderDesktop - b.orderDesktop)
            );
            setBannersMobile(
                productBannersData
                    .filter(item => item.isMobile)
                    .toSorted((a, b) => a.orderMobile - b.orderMobile)
            );
        } else {
            setBannersDesktop([]);
            setBannersMobile([]);
        }
        setProducts(sortedProducts.items);
        setHasMore(sortedProducts.hasNext);
        setIsLoading(false);
    }, [sortedProducts, productBannersData]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchSavedProducts = async () => {
        try {
            const savedProducts = await fetchSavedProductData();
            setSavedProducts(savedProducts);
        } catch (error) {
            logError("Error while fetching Saved Product", error);
        }
    };

    useEffect(() => {
        fetchSavedProducts();
    }, []);

    return (
        <div className='flex flex-col items-center lg:px-[24px] px-[12px]'>
            {/* Title Section */}
            <div className='w-full relative flex flex-col justify-center pt-[55px] pb-[23px] lg:gap-y-0 gap-y-[10px]'>
                <h4 className='uppercase text-center color-secondary-alt lg:font-recklessRegular font-recklessLight lg:text-[35px]'>{selectedCategory?.name}</h4>

                <div className='relative lg:block flex flex-col justify-center items-center lg:gap-y-0 gap-y-[10px]'>
                    <SectionTitle text={selectedCategory?.name} classes="xl:text-[200px] lg:text-[95px] border-none" />
                    <ProductsFilterPopup
                        hidden={subCategories.length === 0}
                        type={"subCategory"}
                        selectedCategory={selectedCategory}
                        subCategories={subCategories}
                        onFilterChange={handleFilterChange}
                        selectedFilters={selectedFilters}
                    />
                </div>
            </div>

            <hr className='hidden lg:block border border-primary-border my-8 w-full' />

            <ul className='w-full grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2
      lg:gap-x-[31px] sm:gap-x-[12px] gap-x-[10px]
      lg:gap-y-[20px] sm:gap-y-[12px] gap-y-[20px]'>
                {products.map((productData, index) => {
                    const banners = isMobile ? bannersMobile : bannersDesktop;
                    const shouldInsertBanner = (index + 1) % pageSize === 0 && banners.length > 0;

                    const isLastProduct = index === products.length - 1;
                    const forceInsertBanner = isLastProduct &&
                        bannerIndex === -1 &&
                        products.length < pageSize &&
                        banners.length > 0;

                    if (shouldInsertBanner || forceInsertBanner) bannerIndex = (bannerIndex + 1) % banners.length;

                    return (
                        <React.Fragment key={productData._id}>
                            <li>
                                <ProductCard
                                    key={productData._id}
                                    data={productData}
                                    savedProducts={savedProducts}
                                    setSavedProducts={setSavedProducts}
                                />
                            </li>
                            {(shouldInsertBanner || forceInsertBanner) && (
                                <li className={`col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-4`}>
                                    <ProductBanner key={banners[bannerIndex]._id} data={banners[bannerIndex]} />
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ul>
            {!isLoading && hasMore && (
                <AutoClickWrapper onIntersect={handleLoadMore}>
                    <Loading custom={true} classes='w-full flex justify-center p-6' />
                </AutoClickWrapper>
            )}

            {isLoading && (<Loading custom={true} classes='w-full flex justify-center p-6' />)}
        </div>
    );
};
