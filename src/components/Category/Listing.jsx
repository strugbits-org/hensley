'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import FilterMenu from '../common/MenuFilter'
import FilterCardSubCategories from '../common/FilterCardSubCategories'
import { ProductBanner } from '../common/ProductBanner'
import BannerImg from '@/assets/banner.png'
import Loading from '@/app/loading'
import AutoClickWrapper from '../common/helpers/AutoClickWrapper'
import { fetchSortedProducts } from '@/services/collections'
import { logError } from '@/utils'
import { ProductsFilterPopup } from '../common/ProductsFilterPopup'

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
  const { selectedCategory, sortedProducts, subCategories, collectionIds, sortIndex } = data;

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Extract common fetch logic into a reusable function
  const fetchProducts = useCallback(async ({ newFilters = selectedFilters, isLoadMore = false, newSkip = 0 }) => {
    const activeCollectionIds = newFilters.length > 0
      ? newFilters.map(f => f._id)
      : collectionIds;

    try {
      const newSortedProducts = await fetchSortedProducts({
        collectionIds: activeCollectionIds,
        limit: 12,
        skip: newSkip,
        sortIndex
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
    setProducts(sortedProducts.items);
    setHasMore(sortedProducts.hasNext);
    setIsLoading(false);
  }, [sortedProducts]);

  return (
    <>
      <div className='w-full relative'>
        <SectionTitle text={selectedCategory?.name} classes="text-[35px] pt-[40px] pb-[40px] border-none" />
        <ProductsFilterPopup
          selectedCategory={selectedCategory}
          subCategories={subCategories}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
        />
      </div>

      <FilterCardSubCategories data={subCategories} />

      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:px-0 px-[12px]">
        <div className="lg:w-1/4 w-full lg:h-screen pl-[24px] lg:block hidden">
          <FilterMenu
            selectedCategory={selectedCategory}
            items={subCategories}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>
        <div className="w-full lg:w-3/4 min-h-screen pr-6 lg:pb-[28px] lg:pt-[28px] sm:pt-[12px] sm:pb-[12px] pb-[12px] lg:border-t lg:border-b border-primary-border">
          <div className="grid sm:grid-cols-3 grid-cols-2 lg:gap-x-[24px] sm:gap-x-[12px] lg:gap-y-[31px] gap-y-[13px] gap-x-[12px] sm:gap-y-[12px]">
            {products.map((productData, index) => {
              return (
                <ProductCard
                  key={productData._id}
                  data={productData}
                  onAddToCart={() => console.log('Added to cart')}
                />
              );
            })}
          </div>

          {!isLoading && hasMore && (
            <AutoClickWrapper onIntersect={handleLoadMore}>
              <Loading custom={true} classes='w-full flex justify-center p-6' />
            </AutoClickWrapper>
          )}

          {isLoading && (<Loading custom={true} classes='w-full flex justify-center p-6' />)}
          <ProductBanner img={BannerImg} />
        </div>
      </div>
    </>
  );
}

export default Listing;