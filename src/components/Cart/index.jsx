"use client";
import React, { useEffect, useState } from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import CartHeading from './CartHeading'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart } from '@/services/cart/CartApis';
import { calculateTotalCartQuantity } from '@/utils';
import { useCookies } from 'react-cookie';

const Cart = () => {
  const [_cookies, setCookie] = useCookies(["cartQuantity"]);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await getProductsCart();
      setCartItems(response);

      const total = calculateTotalCartQuantity(response);
      setCookie("cartQuantity", total > 0 ? String(total) : "0", { path: "/" });
      console.log("cart", response);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
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