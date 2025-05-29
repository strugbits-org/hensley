"use client";
import React, { useEffect, useState } from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import CartHeading from './CartHeading'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart } from '@/services/cart/CartApis';
import { storeActions } from '@/store';
import { calculateCartTotalQuantity } from '@/utils';

const Cart = () => {

  const [cartItems, setCartItems] = useState([]);

  const getCartItems = async () => {
    try {
      const cart = await getProductsCart();
      setCartItems(cart);

      const cartQuantity = calculateCartTotalQuantity(cart);
      storeActions.setCartQuantity(cartQuantity);
      console.log("cart", cart);
      console.log("cartQuantity", cartQuantity);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);
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