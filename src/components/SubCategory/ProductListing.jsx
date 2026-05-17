'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import { ProductsFilterPopup } from '../common/ProductsFilterPopup';
import { ProductBanner } from '../common/ProductBanner';
import Loading from '@/app/loading';
import AutoClickWrapper from '../common/helpers/AutoClickWrapper';
import { logError } from '@/utils';
import { fetchSortedProductsForListing } from '@/services/collections';

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
    const { selectedCategory, sortedProducts, subCategories, collectionIds, productBannersData, productOrder = [] } = data;

    let bannerIndex = -1;
    const pageSize = 12;

    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [bannersDesktop, setBannersDesktop] = useState([]);
    const [bannersMobile, setBannersMobile] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const isLoadingMoreRef = useRef(false);

    const getEntityId = useCallback((item) => item?._id || item?.id, []);

    // DAG-aware descendant walker. Multi-parent collections can be reached via
    // more than one path; the visited set prevents infinite loops and dupes.
    const getCollectionIdsWithDescendants = useCallback((item) => {
        const visited = new Set();
        const stack = [item];
        while (stack.length) {
            const current = stack.pop();
            const id = current?._id || current?.id;
            if (!id || visited.has(id)) continue;
            visited.add(id);
            const subs = Array.isArray(current?.subcategories) ? current.subcategories : [];
            for (const sub of subs) {
                if (sub && typeof sub === 'object') stack.push(sub);
                else if (typeof sub === 'string' && !visited.has(sub)) visited.add(sub);
            }
        }
        return Array.from(visited);
    }, []);

    const fetchProducts = useCallback(async ({ newFilters = selectedFilters, isLoadMore = false, newSkip = 0 }) => {
        const activeCollectionIds = newFilters.length > 0
            ? newFilters.flatMap(getCollectionIdsWithDescendants).filter(Boolean)
            : collectionIds;

        try {
            const newSortedProducts = await fetchSortedProductsForListing({
                collectionIds: activeCollectionIds,
                limit: pageSize,
                skip: newSkip,
                // Use productOrder only when no sub-category filter is active
                productOrder: newFilters.length === 0 ? productOrder : undefined,
            });

            if (isLoadMore) {
                setProducts(prevProducts => [...prevProducts, ...newSortedProducts.items]);
            } else {
                setProducts(newSortedProducts.items);
            }

            setHasMore(newSortedProducts.hasNextPage ?? newSortedProducts.hasNext ?? false);
            return newSortedProducts;
        } catch (error) {
            logError(`Error fetching ${isLoadMore ? 'more' : 'sorted'} products:`, error);
            return null;
        }
    }, [collectionIds, selectedFilters, productOrder, getCollectionIdsWithDescendants]);

    const debouncedFetchForFilters = useDebounce((newFilters) => {
        fetchProducts({ newFilters, isLoadMore: false, newSkip: 0 })
            .finally(() => setIsLoading(false));
    }, 300);

    const handleFilterChange = (filter) => {
        const filterId = getEntityId(filter);
        const isSelected = selectedFilters.some(f => getEntityId(f) === filterId);
        const newFilters = isSelected
            ? selectedFilters.filter(f => getEntityId(f) !== filterId)
            : [...selectedFilters, filter];

        setSelectedFilters(newFilters);
        setIsLoading(true);
        debouncedFetchForFilters(newFilters);
    };

    const handleLoadMore = async () => {
        if (!hasMore || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;
        await fetchProducts({
            isLoadMore: true,
            newSkip: products.length
        });
        isLoadingMoreRef.current = false;
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
        setHasMore(sortedProducts.hasNext ?? false);
        setIsLoading(false);
    }, [sortedProducts, productBannersData]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Remember which category the user was browsing so the product page can
    // render a breadcrumb that reflects the path they took (Home > China >
    // Product) instead of always defaulting to product.collections[0].
    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCategory?.slug) return;
        try {
            sessionStorage.setItem(
                'lastCategoryCrumb',
                JSON.stringify({ slug: selectedCategory.slug, name: selectedCategory.name })
            );
        } catch {
            // sessionStorage unavailable (private mode, etc.) — ignore
        }
    }, [selectedCategory?.slug, selectedCategory?.name]);

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
                        <React.Fragment key={productData._id || productData.id || index}>
                            <li>
                                <ProductCard
                                    key={productData._id || productData.id || index}
                                    data={productData}
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
            {!isLoading && products.length === 0 && (
                <div className='w-full flex flex-col justify-center items-center py-20 gap-y-3'>
                    <h3 className='uppercase text-secondary-alt font-recklessRegular text-[28px] lg:text-[35px] tracking-wider text-center'>No products found</h3>
                    <p className='text-secondary-alt font-haasRegular text-sm lg:text-base text-center max-w-md'>Try adjusting your filters or check back soon.</p>
                </div>
            )}

            {!isLoading && hasMore && (
                <AutoClickWrapper onIntersect={handleLoadMore}>
                    <Loading custom={true} classes='w-full flex justify-center p-6' />
                </AutoClickWrapper>
            )}

            {isLoading && (<Loading custom={true} classes='w-full flex justify-center p-6' />)}
        </div>
    );
};
