import React from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import CartHeading from './CartHeading'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'

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
          <CartNormal />
        </div>
      </div>
      <CustomLink to={"/quote-request"}>
        <AddToQuote text={"request to quote"} onClick={() => { }} />
      </CustomLink>
    </>
  )
}

export default Cart