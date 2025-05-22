import React from 'react'
import { CartTent,CartCollection,CartNormal } from './CartItems'
import PriceDisplay from './PriceDisplay'
import CartHeading from './CartHeading'

const QuoteSummary = () => {
  return (
      <div className='w-full flex lg:flex-row flex-col'>
        <div className='lg:w-[30%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
            <PriceDisplay />
        </div>
        <div className='lg:w-[70%] border'>
            <CartTent />
            <CartCollection />
            <CartNormal />
        </div>
    </div>
  )
}

export default QuoteSummary