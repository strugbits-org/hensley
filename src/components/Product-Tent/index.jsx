'use client'
import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import BannerStructures from './BannerStructures';
import ProductSlider from '../Product/ProductSlider';
import { AddToQuoteForm } from './AddToQuoteForm';
import { SaveProductButton } from '../common/SaveProductButton';
import ProductSlider_tab from '../Product/ProductSlider_tab';
import { DownloadButton } from '../common/DownloadButton';
import { resolveProductRibbon } from '../common/ProductBadge';

const ProductTent = ({ productData, masterClassTentingURL, matchedProducts = [], allCollections = [] }) => {
  const { tent, gallery = [] } = productData;
  const ribbon = resolveProductRibbon(tent, allCollections);

  // Build a slider-compatible product object from the tent data
  const sliderProduct = {
    ...tent,
    mainMedia: tent?.mainMedia,
    mediaItems: tent?.mainMedia ? [{ id: 'main-media', src: tent.mainMedia, alt: tent?.name || '' }] : [],
  };

  return (
    <>
      <div className='w-full flex lg:flex-row lg:items-start flex-col gap-x-[24px] 3xl:gap-x-[40px] px-[24px] 3xl:px-[40px] py-[24px] 3xl:py-[40px] pb-0 lg:gap-y-0 gap-y-[30px]'>
        <div className='xl:w-1/2 lg:sticky lg:top-[110px] 3xl:top-[160px] lg:h-[calc(100vh-110px)] 3xl:h-[calc(100vh-160px)]'>
          <ProductSlider product={sliderProduct} />
          <ProductSlider_tab product={sliderProduct} productData={{ ...productData.productData, product: tent }} />
        </div>
        <div className='xl:w-1/2 flex flex-col items-center relative lg:min-h-[calc(100vh-110px)] 3xl:min-h-[calc(100vh-160px)]'>
          {ribbon && (
            <div className='w-full mb-3 lg:max-w-[656px] sm:max-w-[492px] 3xl:max-w-[1400px]'>
              <span className='inline-block bg-[#e8d98b] text-secondary-alt text-[11px] 3xl:text-[16px] font-haasRegular uppercase px-3 py-1 3xl:px-4 3xl:py-1.5 rounded-full'>
                {ribbon}
              </span>
            </div>
          )}
          <AddToQuoteForm title={productData?.title} productData={tent} matchedProducts={matchedProducts} />
          <SaveProductButton
            key={productData._id}
            productData={{ ...productData.productData, product: tent }}
            className="absolute right-3 top-3 md:right-[24px] md:top-[23px] hidden lg:flex"
          />
        </div>
      </div>
      <div className='w-full min-h-screen bg-secondary-alt pt-[75px] 3xl:pt-[120px] px-[24px] 3xl:px-[40px]'>
        <BannerStructures title={productData?.title} data={tent} />
        <div className="w-full grid gap-[24px] 3xl:gap-[40px] mt-6 3xl:mt-12 lg:grid-cols-[2fr_1fr] grid-cols-1">
          {gallery.map((item, index) => {
            const position = index % 3;
            const colSpanClass =
              position === 0 ? 'col-span-1' :
                position === 1 ? 'col-span-1' :
                  'col-span-1 lg:col-span-2';

            return (
              <div key={item.id || index} className={`${colSpanClass} min-h-[600px] lg:min-h-0 3xl:min-h-[800px]`}>
                <PrimaryImage url={item.src} size="tablet" alt={item.alt || `tent-${index}`} customClasses="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        <div className='w-full flex justify-center items-center'>
          <DownloadButton link={masterClassTentingURL} text="DOWNLOAD MASTERCLASS TENTING 101" classes={"lg:!w-[656px] sm:!w-[492px] 3xl:!w-[1000px]"} iconTrue={"true"} />
        </div>
      </div>
    </>
  )
}

export default ProductTent