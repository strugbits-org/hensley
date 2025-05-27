"use client";
import React, { useMemo, useState, useCallback } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToQuote } from './AddtoQuoteButton'
import { PrimaryImage } from '../common/PrimaryImage'
import ProductDescription from '../common/helpers/ProductDescription';
import { formatTotalPrice } from '@/utils';

const INFO_HEADERS = [
  { title: 'Product', setItem: true },
  { title: 'Size', setItem: false },
  { title: 'Price', setItem: false },
  { title: 'Quantity', setItem: false }
];

const DEFAULT_PRODUCT_SET = [
  { product: 'CHARGER', size: '-', price: '$5.80' },
  { product: 'DINNER PLATE', size: '11"', price: '$2.65' },
  { product: 'DINNER PLATE', size: '9"', price: '$2.65' },
  { product: 'RICE BOWL', size: '-', price: '$2.65' },
  { product: 'B&B', size: '-', price: '$2.65' },
  { product: 'MUG', size: '-', price: '$2.65' },
  { product: 'SERVING BOWL', size: '9"', price: '$10.80' },
  { product: 'SERVING PLATTER', size: '12"', price: '$15.75' },
];

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const PriceDisplay = ({ price }) => (
  <div className='lg:mb-[48px] sm:mb-[10px] flex lg:justify-end gap-x-[28px]'>
    <span className='text-[35px] text-secondary-alt font-recklessRegular'>{price}</span>
    <span className='text-[35px] text-secondary-alt font-recklessRegular uppercase'>(total)</span>
  </div>
);

const QuantityControls = ({ quantity, onQuantityChange }) => (
  <div className="flex items-center justify-center gap-x-[30px] font-haasRegular">
    <button
      className="text-xl font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity - 1)}
      disabled={quantity <= QUANTITY_LIMITS.MIN}
      aria-label="Decrease quantity"
    >
      -
    </button>
    <input
      className="font-bold bg-transparent max-w-[60px] outline-none text-center appearance-none"
      type="number"
      min={QUANTITY_LIMITS.MIN}
      max={QUANTITY_LIMITS.MAX}
      value={quantity}
      onChange={(e) => onQuantityChange(parseInt(e.target.value) || QUANTITY_LIMITS.MIN)}
      aria-label="Quantity"
    />
    <button
      className="text-xl font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity + 1)}
      disabled={quantity >= QUANTITY_LIMITS.MAX}
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

const CartIcon = () => (
  <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition-colors">
    <PrimaryImage
      url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg"
      alt="Cart Icon"
      customClasses="block group-hover/cart:hidden"
    />
    <PrimaryImage
      url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg"
      alt="Cart Icon"
      customClasses="hidden group-hover/cart:block"
    />
  </div>
);

export const Product = ({ data }) => {
  console.log("data", data);

  const { productData, productCollectionData, featuredProjectsData, matchedProducts } = data;
  const { product } = productData;

  const isProductCollection = productCollectionData?.productSetItems.length > 0 || false;
  console.log("isProductCollection", isProductCollection);


  const [cartQuantity, setCartQuantity] = useState(1);

  const productInfoSection = useMemo(() => {
    if (isProductCollection) {
      return DEFAULT_PRODUCT_SET;
    }

    const productSize = product.additionalInfoSections?.find((x) => x.title === "Size")?.value || "—";
    return [{ size: productSize, price: product.formattedPrice }];
  }, [isProductCollection, product.additionalInfoSections, product.formattedPrice]);

  const totalPrice = useMemo(() => {
    return formatTotalPrice(product.price * cartQuantity);
  }, [product.price, cartQuantity]);

  const visibleHeaders = useMemo(() => {
    return INFO_HEADERS.filter(header => !header.setItem || isProductCollection);
  }, [isProductCollection]);

  const handleQuantityChange = useCallback((value) => {
    const numValue = typeof value === 'string' ? parseInt(value) || QUANTITY_LIMITS.MIN : value;
    if (numValue >= QUANTITY_LIMITS.MIN && numValue <= QUANTITY_LIMITS.MAX) {
      setCartQuantity(numValue);
    }
  }, []);

  return (
    <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px]'>
      <div className='xl:w-1/2'>
        <ProductSlider product={product} />
        <ProductSlider_tab product={product} />
      </div>

      <div className='xl:w-1/2 flex flex-col items-center relative'>
        <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
          <span className='text-secondary-alt lg:text-[16px] text-[12px] uppercase font-haasLight'>
            RENTALS/ Product(Item)
          </span>

          <h1 className='uppercase text-secondary-alt font-recklessRegular lg:text-[90px] lg:leading-[85px] text-[35px] leading-[30px] lg:mt-[15px] lg:mb-[28px] sm:mt-[9px] sm:mb-[9px]'>
            {product.name}
          </h1>

          <PriceDisplay price={totalPrice} />

          <table className="w-full text-left border-separate border-spacing-y-[24px] mb-20">
            <thead>
              <tr className="text-xs uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th
                    key={header.title}
                    className={`pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'
                      }`}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productInfoSection.map((item, index) => (
                <tr key={`${item.product || 'item'}-${index}`}>
                  {isProductCollection && (
                    <td className="py-2 font-semibold border-b border-black">
                      {item.product}
                    </td>
                  )}
                  <td className={`border-b border-black ${isProductCollection ? 'text-center' : 'text-left'}`}>
                    {item.size}
                  </td>
                  <td className="text-center border-b border-black">
                    {item.price}
                  </td>
                  <td className="border-b border-black">
                    <QuantityControls
                      quantity={cartQuantity}
                      onQuantityChange={handleQuantityChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ProductDescription text={product.description} />
        </div>

        <AddToQuote text="add to quote" />

        <CartIcon />
      </div>
    </div>
  );
};