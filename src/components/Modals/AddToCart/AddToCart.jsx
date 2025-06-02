"use client"
import React from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { NormalCart } from './CartItems'


const AddToCart = () => {
  return (
    <div className='sm:h-[500px] w-[850px] sm:flex-row flex-col flex gap-x-[24px] sm:px-0 px-[20px] bg-primary-alt z-[999999] box-border'>
      <div className=' h-full sm:max-w-[45%] w-full'>
        <AddToCartSlider />
      </div>
      <div className=' h-full sm:w-[55%] w-full py-[20px] pr-[20px] '>
       <NormalCart />
      </div>
    </div>
  )
}

export default AddToCart