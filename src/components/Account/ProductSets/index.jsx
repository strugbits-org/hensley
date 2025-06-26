"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ProductListUpdate from './ProductListUpdate';
import ProductListAdd from './ProductListAdd';
import ProductList from './ProductList';

// Enum for view states to prevent typos and improve maintainability
const VIEW_STATES = {
  LIST: 'list',
  UPDATE: 'update',
  ADD: 'add'
};

function ProductSets({ data, products = [] }) {
  const [viewState, setViewState] = useState(VIEW_STATES.LIST);
  const [activeProduct, setActiveProduct] = useState(null);
  const [productSets, setProductSets] = useState([]);

  const toggleToUpdate = useCallback((productId = null) => {
    setActiveProduct(productId);
    setViewState(VIEW_STATES.UPDATE);
  }, []);

  const toggleToAdd = useCallback(() => {
    setActiveProduct(null);
    setViewState(VIEW_STATES.ADD);
  }, []);

  const toggleToList = useCallback(() => {
    setActiveProduct(null);
    setViewState(VIEW_STATES.LIST);
  }, []);

  useEffect(() => {
    setProductSets(data);
  }, []);

  const handleSearch = useCallback((term = '') => {
    const filteredData = data.filter((item) => item.searchContent.toLowerCase().includes(term.toLowerCase()));
    setProductSets(filteredData);
  }, []);


  const currentComponent = useMemo(() => {
    switch (viewState) {
      case VIEW_STATES.ADD:
        return (
          <ProductListAdd
            toggleToList={toggleToList}
            productOptions={products}
          />
        );
      case VIEW_STATES.UPDATE:
        return (
          <ProductListUpdate
            toggleToList={toggleToList}
            activeProduct={activeProduct}
            productOptions={products}
          />
        );
      case VIEW_STATES.LIST:
      default:
        return (
          <ProductList
            data={productSets}
            handleSearch={handleSearch}
            toggleToAdd={toggleToAdd}
            toggleToUpdate={toggleToUpdate}
            setActiveProduct={setActiveProduct}
          />
        );
    }
  }, [viewState, activeProduct, productSets, toggleToAdd, toggleToUpdate, toggleToList]);

  return (
    <div className='MyAccount w-full max-lg:mb-[85px]'>
      <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
        <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
          {"product sets"}
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