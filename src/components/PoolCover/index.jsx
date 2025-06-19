'use client'
import React, { useEffect, useState } from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import { fetchSavedProductData } from '@/services/products';
import { SaveProductButton } from '../common/SaveProductButton';
import BannerStructures from '../Product-Tent/BannerStructures';
import ProductSlider from '../Product/ProductSlider';
import ProductSlider_tab from '../Product/ProductSlider_tab';
import { AddToQuoteForm } from './AddToQuoteForm';

const ProductPoolCover = ({ productData }) => {
  const { covers, mediagallery } = productData;
  const [savedProducts, setSavedProducts] = useState([]);

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
    <>
      <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] lg:h-[900px] '>
        <div className='xl:w-1/2 '>
          <ProductSlider product={covers} />
          <ProductSlider_tab product={covers} />
        </div>
        <div className='xl:w-1/2 flex flex-col items-center relative'>
          <AddToQuoteForm title={productData?.title} productData={covers} />
          <SaveProductButton
            key={productData._id}
            productData={{ ...productData.productData, product: covers }}
            savedProducts={savedProducts}
            setSavedProducts={setSavedProducts}
          />
        </div>
      </div>
      <div className='w-full min-h-screen bg-secondary-alt pt-[75px] px-[24px]'>
        <BannerStructures title={productData.title} data={productData.covers} />
        <div className="w-full grid gap-[24px] mt-6 lg:grid-cols-[2fr_1fr] grid-cols-1">
          {mediagallery.map((item, index) => {
            const position = index % 3;
            const colSpanClass =
              position === 0 ? 'col-span-1' :
                position === 1 ? 'col-span-1' :
                  'col-span-2';

            return (
              <div key={index} className={`${colSpanClass}`}>
                <PrimaryImage url={item.src} alt={`covers-${index}`} customClasses="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        {/* <div className='w-full flex justify-center items-center'>
          <DownloadButton text="DOWNLOAD MASTERCLASS TENTING 101" classes={"lg:!w-[656px] sm:!w-[492px]"} iconTrue={"true"} />
        </div> */}
      </div>
    </>
  )
}

export default ProductPoolCover;