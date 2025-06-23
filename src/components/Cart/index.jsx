"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart, removeProductFromCart, updateProductInCart, updateProductsQuantityCart } from '@/services/cart/CartApis';
import { calculateCartTotalPrice, calculateTotalCartQuantity, formatDescriptionLines, formatTotalPrice, logError } from '@/utils';
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
      logError(error.message);
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

    const total = calculateTotalCartQuantity(updatedLineItems || cartItems);
    setCookie("cartQuantity", total, { path: "/" });
    updateProductsQuantity([{ _id: id, quantity: numValue }]);
  }, [cartItems]);

  const handleCollectionQuantityChange = useCallback((data, value, id, disabled) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }
    const updatedSet = data.productSetItems.map(item => {
      const set = item.split("~");
      if (set[0] === id) {
        return `${set[0]}~${set[1]}~${set[2]}~${numValue}`;
      }
      return item;
    }).join("; ");

    data.catalogReference.options.customTextFields.Set = updatedSet;
    data.descriptionLines = data.descriptionLines.map(line => {
      if (line.name.original === "Set") {
        const plainText = {
          translated: updatedSet,
          original: updatedSet
        };

        return { ...line, plainText };
      }
      return line;
    });

    delete data.productSetItems;
    const updatedLineItems = cartItems.map(item =>
      item._id === data._id ? data : item
    );
    setCartItems(updatedLineItems);
    updateCollectionProducts(data);
  }, [cartItems]);

  const updateCollectionProducts = useCallback(
    debounce(async (data, id, quantity) => {
      try {
        if (id) {
          handleCollectionQuantityChange(data, quantity, id);
          return;
        }
        const cartData = {
          lineItems: [
            {
              catalogReference: data.catalogReference,
              quantity: 1,
            }
          ]
        };
        await updateProductInCart(data._id, cartData);
      } catch (error) {
        logError("Error while updating products quantity in cart:", error);
      }
    }, 1500), []);

  const updateProductsQuantity = useCallback(
    debounce(async (lineItems) => {
      try {
        await updateProductsQuantityCart(lineItems);
      } catch (error) {
        logError("Error while updating products quantity in cart:", error);
      }
    }, 1500),
    []
  );

  useEffect(() => {
    const totalQuantity = calculateTotalCartQuantity(cartItems);
    setCookie("cartQuantity", totalQuantity, { path: "/" });

    const total = calculateCartTotalPrice(cartItems);
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
      <div className='w-full h-[75vh] flex lg:flex-row flex-col'>
        <div className='lg:w-[35%] sm:border border-primary-border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
          <PriceDisplay totalPrice={totalPrice} />
        </div>
        <div className='lg:w-[65%] border border-primary-border overflow-y-scroll hide-scrollbar'>
          <h2 className='text-[90px] px-[20px] lg:block hidden text-secondary-alt font-recklessRegular uppercase pt-[25px] pb-[45px]'>your cart</h2>
          <div className='flex flex-col '>
            {cartItems.map((item) => {
              const descriptionLines = item.descriptionLines ? formatDescriptionLines(item.descriptionLines) : item.customTextFields;
              const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
              const isTentItem = descriptionLines.find(x => x.title === "TENT TYPE" || x.title === "POOLCOVER")?.value;

              if (productCollection) {
                const productSetItems = productCollection.split("; ");
                const data = { ...item, productSetItems };
                return (
                  <CartCollection key={item._id} data={data} actions={{ handleQuantityChange: (value, id, disabled) => handleCollectionQuantityChange(data, value, id, disabled), removeProduct }} />
                )
              } else if (isTentItem) {
                return (
                  <CartTent key={item._id} data={item} descriptionLines={descriptionLines} actions={{ removeProduct }} />
                )
              } else {
                return (
                  <CartNormal key={item._id} data={item} actions={{ handleQuantityChange, removeProduct }} />
                )
              };
            })}
          </div>
          {!isLoading && cartItems.length === 0 && <>
            <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>Your cart is empty</div>
          </>}

          <div className='spacer h-10'></div>
        </div>
      </div>
      {!isLoading && cartItems.length > 0 && (
        <CustomLink to={"/quote-request"}>
          <AddToQuote classes={'!mt-0'} text={"request for quote"} />
        </CustomLink>
      )}
    </>
  )
}

export default Cart