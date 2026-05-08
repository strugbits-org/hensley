'use client'
import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import { SaveProductButton } from '../common/SaveProductButton';
import BannerStructures from '../Product-Tent/BannerStructures';
import ProductSlider from '../Product/ProductSlider';
import ProductSlider_tab from '../Product/ProductSlider_tab';
import { AddToQuoteForm } from './AddToQuoteForm';
import { resolveProductRibbon } from '../common/ProductBadge';

const ProductPoolCover = ({ productData, matchedProducts = [], allCollections = [] }) => {
  const { covers, mediagallery } = productData;
  const ribbon = resolveProductRibbon(covers, allCollections);

  return (
    <>
      <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] lg:h-[900px] '>
        <div className='xl:w-1/2 '>
          <ProductSlider product={covers} />
          <ProductSlider_tab product={covers} />
        </div>
        <div className='xl:w-1/2 flex flex-col items-center relative'>
          {ribbon && (
            <div className='w-full mb-3 lg:max-w-[656px] sm:max-w-[492px]'>
              <span className='inline-block bg-[#e8d98b] text-secondary-alt text-[11px] font-haasRegular uppercase px-3 py-1 rounded-full'>
                {ribbon}
              </span>
            </div>
          )}
          <AddToQuoteForm title={productData?.title} productData={covers} matchedProducts={matchedProducts} />
          <SaveProductButton
            key={productData._id}
            productData={{ ...productData.productData, product: covers }}
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