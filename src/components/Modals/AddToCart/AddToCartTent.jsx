"use client"
import React from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { AddToQuoteFormInline } from '@/components/Product-Tent/AddToQuoteFormInline'

const AddToCartTent = ({ data, onClose }) => {
  const { productData } = data;
  const { product } = productData;

  return (
    <div className='relative w-full sm:w-[850px] h-[700px] sm:h-[450px] sm:mt-0 sm:flex-row flex-col flex gap-x-[24px] sm:px-0 px-[20px] bg-primary-alt z-[999] box-border'>
      <AddToCartSlider data={productData} isOpen={data.open} isTent={true} />
      <div className='h-full sm:w-[55%] w-full py-[25px] pt-[30px] pr-[20px] overflow-y-auto hide-scrollbar'>
        <AddToQuoteFormInline title={productData?.title} productData={product} />
      </div>
    </div>
  )
}

export default AddToCartTent;