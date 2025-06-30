'use client'
import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import BannerStructures from './BannerStructures';
import ProductSlider from '../Product/ProductSlider';
import { AddToQuoteForm } from './AddToQuoteForm';
import { SaveProductButton } from '../common/SaveProductButton';
import ProductSlider_tab from '../Product/ProductSlider_tab';
import { DownloadButton } from '../common/DownloadButton';

const ProductTent = ({ productData, masterClassTentingURL, matchedProducts = [] }) => {
  const { tent, gallery } = productData;

  return (
    <>
      <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] lg:h-[900px] '>
        <div className='xl:w-1/2 '>
          <ProductSlider product={tent} />
          <ProductSlider_tab product={tent} />
        </div>
        <div className='xl:w-1/2 flex flex-col items-center relative'>
          <AddToQuoteForm title={productData?.title} productData={tent} matchedProducts={matchedProducts} />
          <SaveProductButton
            key={productData._id}
            productData={{ ...productData.productData, product: tent }}
          />
        </div>
      </div>
      <div className='w-full min-h-screen bg-secondary-alt pt-[75px] px-[24px]'>
        <BannerStructures title={productData?.title} data={productData?.tent} />
        <div className="w-full grid gap-[24px] mt-6 lg:grid-cols-[2fr_1fr] grid-cols-1">
          {gallery.map((item, index) => {
            const position = index % 3;
            const colSpanClass =
              position === 0 ? 'col-span-1' :
                position === 1 ? 'col-span-1' :
                  'col-span-2';

            return (
              <div key={index} className={`${colSpanClass}`}>
                <PrimaryImage url={item.src} alt={`tent-${index}`} customClasses="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        <div className='w-full flex justify-center items-center'>
          <DownloadButton link={masterClassTentingURL} text="DOWNLOAD MASTERCLASS TENTING 101" classes={"lg:!w-[656px] sm:!w-[492px]"} iconTrue={"true"} />
        </div>
      </div>
    </>
  )
}

export default ProductTent