"use client"
import React, { useCallback, useMemo, useState } from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { AddToQuoteButton } from './AddtoQuoteButton'
import ProductDescription from '@/components/common/helpers/ProductDescription'
import { QuantityControls } from '@/components/Product'
import { formatTotalPrice } from '@/utils'

const INFO_HEADERS = [
  { title: 'Product', setItem: true },
  { title: 'Size', setItem: false },
  { title: 'Price', setItem: false },
  { title: 'Quantity', setItem: false }
];
const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const AddToCart = ({ data, onClose }) => {
  const { product } = data;
  const isProductCollection = false;
  const [cartQuantity, setCartQuantity] = useState(1);
  const [productSetItems, setProductSetItems] = useState([]);

  const productInfoSection = useMemo(() => {
    if (isProductCollection) return [];

    const productSize = product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—";
    return [{ size: productSize, formattedPrice: product.formattedPrice }];
  }, [isProductCollection, product]);

  const totalPrice = useMemo(() => {
    if (isProductCollection) {
      const collectionTotal = productSetItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        return total + (itemPrice * item.quantity);
      }, 0);
      return formatTotalPrice(collectionTotal);
    }
    return formatTotalPrice(product.price * cartQuantity);
  }, [isProductCollection, productSetItems, product.price, cartQuantity]);

  const visibleHeaders = useMemo(() =>
    INFO_HEADERS.filter(header => !header.setItem || isProductCollection),
    [isProductCollection]
  );

  const renderTableRows = () => {
    if (isProductCollection) {
      return productSetItems.map((item, index) => (
        <tr key={`${item.product}-${index}`}>
          <td className="py-2 font-semibold border-b border-black">{item.product}</td>
          <td className="border-b border-black font-haasRegular text-center">{item.size}</td>
          <td className="text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
          <td className="border-b border-black font-haasRegular">
            <QuantityControls
              quantity={item.quantity}
              onQuantityChange={(value) => handleQuantityChange(value, item.id)}
            />
          </td>
        </tr>
      ));
    }

    return productInfoSection.map((item, index) => (
      <tr key={`item-${index}`}>
        <td className="border-b border-black font-haasRegular text-left">{item.size}</td>
        <td className="text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
        <td className="border-b border-black font-haasRegular">
          <QuantityControls
            quantity={cartQuantity}
            onQuantityChange={handleQuantityChange}
          />
        </td>
      </tr>
    ));
  };

  const handleQuantityChange = useCallback((value, itemId) => {
    const numValue = typeof value === 'string' ? parseInt(value) || QUANTITY_LIMITS.MIN : value;
    if (numValue < QUANTITY_LIMITS.MIN || numValue > QUANTITY_LIMITS.MAX) return;

    if (isProductCollection) {
      setProductSetItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: numValue } : item
        )
      );
    } else {
      setCartQuantity(numValue);
    }
  }, [isProductCollection]);
  return (
    <div className='w-[850px] sm:flex-row flex-col flex gap-x-[24px] sm:px-0 px-[20px] bg-primary-alt z-[999999] box-border'>
      <div className=' h-full sm:max-w-[45%] w-full'>
        <AddToCartSlider data={data} />
      </div>
      <div className=' h-full sm:w-[55%] w-full py-[20px] pr-[20px] '>
        <div className='w-full flex flex-col gap-y-[15px]'>
          <div className='w-full flex justify-between relative '>
            <span className='
            text-[35px]
            leading-[30px]
            text-secondary-alt
            font-recklessRegular
            uppercase
            '>{product.name}</span>
            <button onClick={onClose} className='close-button'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                  <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                  <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                </g>
              </svg>

            </button>
          </div>
          <div className='w-full flex gap-x-[20px] justify-end '>
            <span
              className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        block
        '
            >{totalPrice}</span>
            <span
              className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        block
        uppercase
        '
            >(total)</span>
          </div>
          <table className="w-full text-left border-separate border-spacing-y-[15px]">
            <thead>
              <tr className="text-xs max-lg:hidden uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th key={header.title} className={`pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
          <ProductDescription maxChars={130} text={product.description} />

          <AddToQuoteButton text="add to quote" classes={"!mt-0 !p-0 !h-[70px] !text-[14px]"} />
        </div>
      </div>
    </div>
  )
}

export default AddToCart