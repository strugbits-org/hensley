'use client'
import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import parse from 'html-react-parser';
import BannerStructures from './BannerStructures';
// import { DownloadButton } from './DownloadButton';
import ProductSlider from '../Product/ProductSlider';
import ProductSlider_tab from './ProductSlider_tab';
import { AddToQuoteForm } from './AddToQuoteForm';

const ProductTent = ({ productData }) => {
  const { tent, gallery } = productData;

  return (
    <>
      <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px] '>
        <div className='xl:w-1/2 '>
          <ProductSlider product={tent} />
          <ProductSlider_tab product={tent} />
        </div>
        <div className='xl:w-1/2 flex flex-col items-center relative'>
          <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
            <span className='text-secondary-alt 
            lg:text-[16px]
            text-[12px]
            uppercase font-haasLight'>Home/corporate</span>
            <h3 className='uppercase text-secondary-alt font-recklessRegular 
            lg:text-[90px] 
            lg:leading-[85px]
            text-[35px]
            leading-[30px]
            '>{productData?.title}</h3>

            <div className="font-haasRegular lg:text-[16px] lg:leading-[19px] text-[14px] leading-[17px] text-secondary-alt">
              {parse(tent?.description || '')}
            </div>
            <AddToQuoteForm productData={tent} />
          </div>
          <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer">
            <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
            <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
          </div>
        </div>
      </div>
      <div className='w-full min-h-screen bg-secondary-alt pt-[75px] px-[24px]'>
        <BannerStructures data={productData} />
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

        {/* <div className='w-full flex justify-center items-center'>
          <DownloadButton text="DOWNLOAD MASTERCLASS TENTING 101" classes={"lg:!w-[656px] sm:!w-[492px]"} iconTrue={"true"} />
        </div> */}
      </div>
    </>
  )
}

export default ProductTent