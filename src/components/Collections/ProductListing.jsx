'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import FilterMenu from '../common/MenuFilter'
import { ProductBanner } from '../common/ProductBanner'
import Loading from '@/app/loading'
import AutoClickWrapper from '../common/helpers/AutoClickWrapper'
import { fetchSortedProducts } from '@/services/collections'
import { findSortIndexByCategory, logError } from '@/utils'
import { ProductsFilterPopup } from '../common/ProductsFilterPopup'
import { fetchSavedProductData } from '@/services/products';
import ProductFilterCardSubCategories from '../common/ProductFilterCardSubCategories';

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

function Listing({ data }) {
  const { selectedCategory, sortedProducts, subCategories, collectionIds, sortIndex, categoriesSortData, productBannersData } = data;
  let bannerIndex = -1;
  const pageSize = 16;

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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <div className='w-full relative flex items-center py-10'>
        <SectionTitle text={selectedCategory?.name} classes="text-[35px] border-none" />
        <ProductsFilterPopup
          selectedCategory={selectedCategory}
          subCategories={subCategories}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
        />
      </div>

      <ProductFilterCardSubCategories data={subCategories} />

      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:px-0 px-[12px]">
        {subCategories.length > 0 && (<div className="lg:w-1/4 w-full lg:h-screen pl-[24px] lg:block hidden">
          <FilterMenu
            selectedCategory={selectedCategory}
            items={subCategories}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>)}
        <div className={`w-full min-h-screen lg:pb-[28px] lg:pt-[28px] sm:pt-[12px] sm:pb-[12px] pb-[12px] lg:border-t lg:border-b border-primary-border ${subCategories.length > 0 ? 'lg:w-3/4 lg:pr-6' : 'lg:w-full px-6'}`}>
          <ul className={`grid grid-cols-2 md:grid-cols-3 lg:gap-x-[24px] sm:gap-x-[12px] lg:gap-y-[31px] gap-y-[13px] gap-x-[12px] sm:gap-y-[12px] ${subCategories.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
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
                    <li className={`col-span-2 md:col-span-3 ${subCategories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                      <ProductBanner
                        key={banners[bannerIndex]._id} data={banners[bannerIndex]} />
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
      </div>
    </>
  );
}

export default Listing;