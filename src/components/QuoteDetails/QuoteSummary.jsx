import React, { useEffect, useState } from 'react'
import { calculateCartTotalPrice, formatDescriptionLines, formatTotalPrice } from '@/utils';
import { CartNormal, CartCollection } from '../Cart/CartItems';
import { CartTent } from './CartItems';
import PriceDisplay from './PriceDisplay';

const QuoteSummary = ({ data }) => {

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const total = calculateCartTotalPrice(data.lineItems.map(item => item.product));
    setTotalPrice(formatTotalPrice(total));
  }, [data]);

  return (
    <div className='w-full flex lg:flex-row flex-col'>
      <div className='lg:w-[35%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
        {/* <div className='lg:block hidden'>
          <span className='
        text-[50px]
        leading-[55px]
        font-haasLight
        uppercase
        block
        '>
            total purchase amount is
          </span>
          <span className='
        font-recklessBold
        text-[90px]
        uppercase
        mt-[20px]
        block
        '>{totalPrice}</span>
        </div> */}

        <PriceDisplay totalPrice={totalPrice} />
      </div>
      <div className='lg:w-[70%] border'>

        {data.lineItems.map((item, index) => {
          const product = item.product;
          const descriptionLines = product.descriptionLines ? formatDescriptionLines(product.descriptionLines) : product.customTextFields;
          const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
          const isTentItem = false;

          if (productCollection) {
            const productSetItems = productCollection.split("; ");
            const lineItemData = { ...product, productSetItems };
            return (
              <CartCollection key={index} data={lineItemData} readOnly={true} />
            )
          } else if (isTentItem) {
            return (
              <CartTent key={index} data={product} readOnly={true} />
            )
          } else {
            return (
              <CartNormal key={index} data={product} readOnly={true} />
            )
          };
        })}
        {data.lineItems.length === 0 && <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>No Items</div>}
      </div>
    </div>
  )
}

export default QuoteSummary