import React from 'react'
import {CartCollection, CartTent} from './CartTent'
import CartHeading from './CartHeading'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'

const Cart = () => {
  return (
    <>
    <div className='w-full min-h-screen flex lg:flex-row flex-col'>
        <div className='lg:w-[30%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
            <PriceDisplay />
        </div>
        <div className='lg:w-[70%] border'>
            <CartHeading />
            <CartTent />
            <CartCollection />
        </div>
    </div>
    <AddToQuote text={"request to quote"}/>
    </>
  )
}

export default Cart