"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ProductListUpdate from './ProductListUpdate';
import ProductListAdd from './ProductListAdd';
import ProductList from './ProductList';
import { fetchProductSetsData } from '@/services/admin';
import { mapProductSetItems } from '@/utils';

// Constants moved outside component to prevent recreation on each render
const STATIC_DATA = {
  heading: "product sets",
  email: "gabriel@petrikor.design",
  productSetsData: [
    {
      id: 1,
      title: "vintage - dance floor",
      tags: ["corporate", "event design and production", "creative services agency", "+3 studios"],
      image: "/product-set-1.png"
    },
    {
      id: 2,
      title: "modern - stage decor",
      tags: ["wedding", "lighting", "custom build"],
      image: "/product-set-1.png"
    },
    {
      id: 3,
      title: "boho - lounge area",
      tags: ["furniture", "rugs", "pillows"],
      image: "/product-set-1.png"
    }
  ]
};

// Enum for view states to prevent typos and improve maintainability
const VIEW_STATES = {
  LIST: 'list',
  UPDATE: 'update',
  ADD: 'add'
};

function ProductSets() {
  // Consolidated state management
  const [viewState, setViewState] = useState(VIEW_STATES.LIST);
  const [currentProd, setCurrentProd] = useState(null);
  const [productSets, setProductSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized toggle functions to prevent unnecessary re-renders
  const toggleToUpdate = useCallback((productId = null) => {
    setCurrentProd(productId);
    setViewState(VIEW_STATES.UPDATE);
  }, []);

  const toggleToAdd = useCallback(() => {
    setCurrentProd(null);
    setViewState(VIEW_STATES.ADD);
  }, []);

  const toggleToList = useCallback(() => {
    setCurrentProd(null);
    setViewState(VIEW_STATES.LIST);
  }, []);

  // Optimized data fetching with error handling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchProductSetsData();

      // Process data more efficiently
      const processedData = response.map(item => {
        mapProductSetItems(item);
        const { setOfProduct, product, searchContent } = item;
        return { product, setOfProduct, searchContent };
      });

      setProductSets(processedData);
      console.log("Processed data:", processedData);
    } catch (err) {
      console.error("Error fetching product sets:", err);
      setError(err.message || "Failed to fetch product sets");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect with proper cleanup
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized current component to prevent unnecessary re-renders
  const currentComponent = useMemo(() => {
    switch (viewState) {
      case VIEW_STATES.ADD:
        return (
          <ProductListAdd
            addProdToggle={toggleToList}
            toggle={toggleToUpdate}
          />
        );
      case VIEW_STATES.UPDATE:
        return (
          <ProductListUpdate
            toggle={toggleToList}
            data={STATIC_DATA.productSetsData}
            currentProd={currentProd}
          />
        );
      case VIEW_STATES.LIST:
      default:
        return (
          <ProductList
            data={productSets}
            addProdToggle={toggleToAdd}
            toggle={toggleToUpdate}
            setCurrentProd={setCurrentProd}
            loading={loading}
            error={error}
          />
        );
    }
  }, [viewState, currentProd, productSets, loading, error, toggleToAdd, toggleToUpdate, toggleToList]);

  if (loading && productSets.length === 0) {
    return (
      <div className='MyAccount w-full max-lg:mb-[85px]'>
        <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
          <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
            {STATIC_DATA.heading}
          </h2>
        </div>
        <div className='px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
          <div className='max-w-[900px] w-full mx-auto flex justify-center items-center py-8'>
            <span className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>{loading ? `Loading Product Sets...` : "No product sets found"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='MyAccount w-full max-lg:mb-[85px]'>
      <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
        <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
          {STATIC_DATA.heading}
        </h2>
      </div>
      <div className='px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
        <div className='max-w-[900px] w-full mx-auto'>
          {currentComponent}
        </div>
      </div>
    </div>
  );
}

export default ProductSets;