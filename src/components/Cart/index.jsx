"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import CartHeading from './CartHeading'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart, removeProductFromCart } from '@/services/cart/CartApis';
import { calculateTotalCartQuantity } from '@/utils';
import { useCookies } from 'react-cookie';
import { debounce } from 'lodash';
import { lightboxActions } from '@/store/lightboxStore';
import { loaderActions } from '@/store/loaderStore';

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const Cart = () => {
  const [_cookies, setCookie] = useCookies(["cartQuantity"]);
  const [cartItems, setCartItems] = useState([]);
  const [trashList, setTrashList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartItems = async () => {
    try {
      const response = await getProductsCart();
      console.log("response", response);

      setCartItems(response);

      const total = calculateTotalCartQuantity(response);
      setCookie("cartQuantity", total > 0 ? String(total) : "0", { path: "/" });

    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
      loaderActions.hide();
      lightboxActions.hideAllLightBoxes();
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = useCallback((value, itemId) => {
    const numValue = typeof value === 'string' ? parseInt(value) || QUANTITY_LIMITS.MIN : value;

    if (numValue < QUANTITY_LIMITS.MIN || numValue > QUANTITY_LIMITS.MAX) return;
    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity: numValue } : item
      )
    );

  }, []);

  useEffect(() => {
    console.log("cartItems", cartItems);
    
    // setTotalPrice(total);
  }, [cartItems]);

  const removeProduct = async (ids) => {
    const newCartItems = cartItems.filter((item) => !ids.includes(item._id));
    const total = calculateTotalCartQuantity(newCartItems);
    setCookie("cartQuantity", total, { path: "/" });
    setCartItems(newCartItems);
    setTrashList((prevTrashList) => prevTrashList.concat(ids.filter(id => !prevTrashList.includes(id))));
  };

  useEffect(() => {
    if (!trashList.length) return;
    const removeProductsDelayed = debounce(async () => {
      try {
        await removeProductFromCart(trashList);
        setTrashList([]);
      } catch (error) {
        logError("Error while while removing products from cart:", error);
      }
    }, 1000);

    removeProductsDelayed(trashList);

    return () => removeProductsDelayed.cancel();
  }, [trashList])

  return (
    <>
      <div className='w-full min-h-screen flex lg:flex-row flex-col'>
        <div className='lg:w-[30%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
          <PriceDisplay />
        </div>
        <div className='lg:w-[70%] border'>
          <CartHeading />
          {/* <CartTent />
          <CartCollection /> */}
          {cartItems.map((item, index) => (
            <CartNormal key={index} data={item} actions={{ handleQuantityChange, removeProduct }} />
          ))}
          {!isLoading && cartItems.length === 0 && <>
            <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>Your cart is empty</div>
          </>}
        </div>
      </div>
      <CustomLink to={"/quote-request"}>
        <AddToQuote text={"request to quote"} onClick={() => { }} />
      </CustomLink>
    </>
  )
}

export default Cart