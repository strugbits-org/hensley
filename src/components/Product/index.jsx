"use client";
import React, { useEffect, useState } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToQuote } from './AddtoQuoteButton'
import { PrimaryImage } from '../common/PrimaryImage'

const infoHeaders = [
  {
    title: 'Product',
    setItem: true,
  },
  {
    title: 'Size',
    setItem: false,
  },
  {
    title: 'Price',
    setItem: false,
  },
  {
    title: 'Quantity',
    setItem: false,
  }
]

export const Product = ({ data }) => {
  const { productData } = data;
  const { product } = productData;
  const [productInfoSection, setProductInfoSection] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  console.log("Product data:", productData);

  const setAdditionalInfoSections = () => {
    if (product.productSetItem) {
      const productInfoSection = [
        { product: 'CHARGER', size: '-', price: '$5.80' },
        { product: 'DINNER PLATE', size: '11"', price: '$2.65' },
        { product: 'DINNER PLATE', size: '9"', price: '$2.65' },
        { product: 'RICE BOWL', size: '-', price: '$2.65' },
        { product: 'B&B', size: '-', price: '$2.65' },
        { product: 'MUG', size: '-', price: '$2.65' },
        { product: 'SERVING BOWL', size: '9"', price: '$10.80' },
        { product: 'SERVING PLATTER', size: '12"', price: '$15.75' },
      ]
      setProductInfoSection(productInfoSection);
      return;
    }

    const productSize = product.additionalInfoSections.find((x) => x.title === "Size") || "—";
    const productInfoSection = [
      { size: productSize, price: product.formattedPrice },
    ]
    setProductInfoSection(productInfoSection);
  }

  useEffect(() => {
    setAdditionalInfoSections();
  }, [productData]);

  return (
    <>
      <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px] '>
        <div className='xl:w-1/2 '>
          <ProductSlider />
          <ProductSlider_tab />
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
          lg:mt-[15px]
          lg:mb-[28px]
          sm:mt-[9px]
          sm:mb-[9px]
          '>{product.name}</h3>
            <div className='lg:mb-[48px] sm:mb-[10px] flex lg:justify-end gap-x-[28px]'>
              <span className='text-[35px] text-secondary-alt font-recklessRegular'>{product.formattedPrice}</span>
              <span className='text-[35px] text-secondary-alt font-recklessRegular uppercase'>(total)</span>
            </div>


            <table className="w-full text-left border-separate border-spacing-y-[24px]">
              <thead>
                <tr className="text-xs uppercase text-gray-500 border-b border-black">
                  {infoHeaders.filter(header => (!header.setItem) || (header.setItem && product.productSetItem)).map((header, index) => {
                    return (
                      <td key={index} className={`pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}>
                        {header.title}
                      </td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {productInfoSection.map((item, index) => (
                  <tr key={index}>
                    {product.productSetItem && (<td className="py-2 font-semibold border-b border-black">{item.product}</td>)}
                    <td className={`border-b border-black ${product.productSetItem ? 'text-center' : 'text-left'}`}>{item.size}</td>
                    <td className="text-center border-b border-black">{item.price}</td>
                    <td className="border-b border-black">
                      <div className="flex items-center justify-center gap-x-[30px] font-haasRegular">
                        <button className="text-xl font-light" onClick={() => setProductQuantity(productQuantity - 1)}>-</button>
                        <input className="font-bold bg-transparent max-w-[80px] outline-none text-center" value={productQuantity} onChange={(e) => setProductQuantity(Number(e.target.value))} />
                        <button className="text-xl font-light" onClick={() => setProductQuantity(productQuantity + 1)}>+</button>
                      </div>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>

            <div className='flex flex-col gap-y-[15px]'>
              <span className='text-[16px] text-secondary-alt font-haasLight block'>Description</span>
              <span className='text-[16px] text-secondary-alt font-haasLight block'>{product.description || "lorem ipsum"}</span>
              <button className="flex items-center gap-2 text-sm font-medium text-black text-secondary-alt font-haasBold uppercase">
                Read more
                <svg xmlns="http://www.w3.org/2000/svg" width="12.231" height="13.578" viewBox="0 0 12.231 13.578">
                  <path id="SETA" d="M13.578,6.115,6.458,12.231l-.884-.756L11.2,6.658H0V5.548H11.2L5.574.755,6.458,0Z" transform="translate(12.231) rotate(90)" fill="#2c2216" />
                </svg>
              </button>

            </div>

          </div>
          <AddToQuote text="add to quote" />

          <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer">
            <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
            <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
          </div>

        </div>
      </div>
    </>
  )
}