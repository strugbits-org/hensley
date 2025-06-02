import React, { useEffect, useState } from 'react'
import { formatTotalPrice } from '@/utils';
import { CartNormal } from '../Cart/CartItems';

const QuoteSummary = ({ data }) => {

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = data.lineItems.reduce((accumulator, item) => {
      const product = item.product;
      return accumulator + (product.fullPrice.amount * product.quantity);
    }, 0);
    setTotalPrice(formatTotalPrice(total));
  }, [data]);

  return (
    <div className='w-full flex lg:flex-row flex-col'>
      <div className='lg:w-[30%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
        <div className='lg:block hidden'>
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
        </div>

        <div className='lg:hidden w-full text-center flex flex-col gap-y-[15px] py-[34px]'>
          <span className='text-[14px] leading-[18px] font-haasRegular block text-secondary-alt uppercase'>total purchase amount is</span>
          <span className='text-[35px] leading-[45px] text-secondary-alt uppercase font-recklessRegular'>{totalPrice}</span>
        </div>
      </div>
      <div className='lg:w-[70%] border'>
        {data.lineItems.map((item, index) => {
          const product = item.product;
          return (
            <CartNormal key={index} data={product} readOnly={true} />
          )})}
        {data.lineItems.length === 0 && <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>Your cart is empty</div>}
      </div>
    </div>
  )
}

export default QuoteSummary