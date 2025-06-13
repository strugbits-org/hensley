"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { CartNormal } from './CartItems'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart, removeProductFromCart, updateProductsQuantityCart } from '@/services/cart/CartApis';
import { calculateTotalCartQuantity, formatTotalPrice, logError } from '@/utils';
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
      const lineItems = response?.lineItems || [];
      setCartItems(lineItems);

      const total = calculateTotalCartQuantity(lineItems);
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

  const handleQuantityChange = useCallback((value, id, disabled) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }

    const updatedLineItems = cartItems.map(item =>
      item._id === id ? { ...item, quantity: numValue } : item
    );

    setCartItems(updatedLineItems);

    if (!disabled) {
      updateProducts(id, numValue, updatedLineItems);
    }
  }, [cartItems]);


  const updateProducts = async (id, quantity, updatedLineItems) => {
    const total = calculateTotalCartQuantity(updatedLineItems || cartItems);
    setCookie("cartQuantity", total, { path: "/" });

    updateProductsQuantity([{ _id: id, quantity }]);
  };

  const updateProductsQuantity = useCallback(
    debounce(async (lineItems) => {
      try {
        await updateProductsQuantityCart(lineItems);
      } catch (error) {
        logError("Error while updating products quantity in cart:", error);
      }
    }, 2000),
    []
  );

  useEffect(() => {
    const total = cartItems.reduce((accumulator, item) => {
      return accumulator + (item.fullPrice.amount * item.quantity);
    }, 0);
    setTotalPrice(formatTotalPrice(total));
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
      <div className='w-full h-[700px] flex lg:flex-row flex-col'>
        <div className='lg:w-[35%] sm:border border-primary-border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
          <PriceDisplay totalPrice={totalPrice} />
        </div>
        <div className='lg:w-[65%] border border-primary-border overflow-y-scroll hide-scrollbar'>
          <h2 className='text-[90px] px-[20px] lg:block hidden text-secondary-alt font-recklessRegular uppercase pt-[25px] pb-[45px]'>your cart</h2>
          <div className='flex flex-col'>
            {cartItems.map((item, index) => (
            <CartNormal key={index} data={item} actions={{ handleQuantityChange, removeProduct, updateProducts }} />
          ))}
          </div>
          {!isLoading && cartItems.length === 0 && <>
            <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>Your cart is empty</div>
          </>}
        </div>
      </div>
      <CustomLink to={"/quote-request"}>
        <AddToQuote classes={'!mt-0'} text={"request to quote"} />
      </CustomLink>
    </>
  )
}

export default Cart