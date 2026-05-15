"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || "";

const toAbsoluteMediaUrl = (source) => {
  if (!source) return "";
  if (/^(https?:)?\/\//.test(source) || source.startsWith("wix:")) return source;

  if (source.startsWith("/")) {
    if (CORE_API_BASE_URL) {
      return `${CORE_API_BASE_URL.replace(/\/$/, "")}${source}`;
    }

    if (typeof window !== "undefined") {
      return `${window.location.origin}${source}`;
    }
  }

  return source;
};

const resolveCartItemMediaSrc = (item) => {
  const product = typeof item?.product === "object" ? item.product : null;
  const firstMediaItem = Array.isArray(product?.mediaItems) ? product.mediaItems[0] : null;

  return toAbsoluteMediaUrl(
    item?.image ||
    item?.mediaItem?.src ||
    product?.mainMedia?.url ||
    product?.mainMedia ||
    product?.featuredImage?.url ||
    product?.featuredImage?.sizes?.thumbnail?.url ||
    firstMediaItem?.url ||
    firstMediaItem?.src ||
    firstMediaItem?.media?.url ||
    product?.media?.url ||
    ""
  );
};

const normalizeCartLineItem = (item) => {
  const product = typeof item?.product === "object" ? item.product : null;
  const mediaSrc = resolveCartItemMediaSrc(item);

  return {
    ...item,
    _id: item?._id || item?.id,
    id: item?.id || item?._id,
    productId: item?.productId || product?.id || item?.product,
    name: item?.name || product?.name || product?.title,
    price: item?.price || item?.priceAtAdd || product?.price || 0,
    quantity: Number(item?.quantity || 1),
    customTextFields:
      item?.customTextFields ||
      item?.customTextFieldValues ||
      [],
    mediaItem: item?.mediaItem || { src: mediaSrc },
  };
};

const Cart = () => {
  const [_cookies, setCookie] = useCookies(["cartQuantity"]);
  const [cartItems, setCartItems] = useState([]);
  const [trashList, setTrashList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const pendingQuantityUpdatesRef = useRef({});

  const fetchCartItems = async () => {
    try {
      const response = await getProductsCart();
      const lineItems = (response?.lineItems || []).map(normalizeCartLineItem);
      // console.log("lineItems", lineItems);
      
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

  const flushQuantityUpdates = useCallback(
    debounce(async () => {
      const updates = Object.values(pendingQuantityUpdatesRef.current);
      pendingQuantityUpdatesRef.current = {};
      if (!updates.length) return;
      try {
        await updateProductsQuantityCart(updates);
      } catch (error) {
        logError("Error while updating products quantity in cart:", error);
      }
    }, 1500),
    []
  );

  const handleQuantityChange = useCallback((value, id) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }

    setCartItems(prev => prev.map(item =>
      item._id === id ? { ...item, quantity: numValue } : item
    ));

    pendingQuantityUpdatesRef.current[id] = { _id: id, quantity: numValue };
    flushQuantityUpdates();
  }, [flushQuantityUpdates]);

  const handleCollectionQuantityChange = useCallback((data, value, id, disabled) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }

    let updatedData = { ...data };

    // Check for new setItems format first
    if (data.setItems && Array.isArray(data.setItems) && data.setItems.length > 0) {
      updatedData = {
        ...data,
        setItems: data.setItems.map(item =>
          (item.productName === id || item.product === id)
            ? { ...item, quantity: numValue }
            : item
        ),
      };
    } else if (data.productSetItems) {
      // Fall back to old string format
      const updatedSet = data.productSetItems.map(item => {
        const set = item.split("~");
        if (set[0] === id) {
          return `${set[0]}~${set[1]}~${set[2]}~${numValue}`;
        }
        return item;
      }).join("; ");

      // Support both Wix format (catalogReference, descriptionLines) and Payload format (customTextFieldValues/customTextFields)
      if (data.catalogReference) {
        // Wix format
        updatedData = {
          ...data,
          catalogReference: {
            ...data.catalogReference,
            options: {
              ...data.catalogReference.options,
              customTextFields: {
                ...data.catalogReference.options.customTextFields,
                Set: updatedSet,
              },
            },
          },
          descriptionLines: data.descriptionLines
            ? data.descriptionLines.map(line =>
                line.name?.original === "Set"
                  ? { ...line, plainText: { translated: updatedSet, original: updatedSet } }
                  : line
              )
            : data.descriptionLines,
        };
      } else {
        // Payload format - update customTextFieldValues or customTextFields
        const updateField = (fields) => {
          if (!Array.isArray(fields)) return fields;
          return fields.map(field =>
            field.title === "Set" ? { ...field, value: updatedSet } : field
          );
        };

        updatedData = {
          ...data,
          customTextFieldValues: data.customTextFieldValues ? updateField(data.customTextFieldValues) : data.customTextFieldValues,
          customTextFields: data.customTextFields ? updateField(data.customTextFields) : data.customTextFields,
        };
        delete updatedData.productSetItems;
      }
    }

    const updatedLineItems = cartItems.map(item =>
      item._id === updatedData._id ? updatedData : item
    );
    setCartItems(updatedLineItems);
    updateCollectionProducts(updatedData);
  }, [cartItems]);

  const updateCollectionProducts = useCallback(
    debounce(async (data) => {
      try {
        let lineItem;

        if (data.setItems && Array.isArray(data.setItems) && data.setItems.length > 0) {
          const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
          lineItem = {
            catalogReference: {
              appId,
              catalogItemId: data.productId || data.product?.id || data.product,
              options: { customTextFields: {} },
            },
            setItems: data.setItems,
            quantity: 1,
          };
        } else if (data.catalogReference) {
          lineItem = {
            catalogReference: data.catalogReference,
            quantity: 1,
          };
        } else {
          const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
          const customTextFields = (data.customTextFieldValues || data.customTextFields || [])
            .reduce((acc, { title, value }) => {
              acc[title] = value;
              return acc;
            }, {});
          lineItem = {
            catalogReference: {
              appId,
              catalogItemId: data.productId || data.product?.id || data.product,
              options: { customTextFields },
            },
            quantity: 1,
          };
        }

        const cartData = { lineItems: [lineItem] };
        await updateProductInCart(data._id, cartData);
      } catch (error) {
        logError("Error while updating bundle in cart:", error);
      }
    }, 1500), []);

  useEffect(() => {
    const totalQuantity = calculateTotalCartQuantity(cartItems);
    setCookie("cartQuantity", totalQuantity, { path: "/" });

    const total = calculateCartTotalPrice(cartItems);
    setTotalPrice(formatTotalPrice(total));
  }, [cartItems]);

  const removeProduct = useCallback((ids) => {
    setCartItems(prev => prev.filter(item => !ids.includes(item._id)));
    setTrashList(prev => {
      const newIds = ids.filter(id => !prev.includes(id));
      return newIds.length ? [...prev, ...newIds] : prev;
    });
  }, []);

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
        <div className='lg:w-[65%] overflow-y-scroll hide-scrollbar'>
          <h2 className='text-[90px] px-[20px] lg:block hidden text-secondary-alt font-recklessRegular uppercase pt-[25px] pb-[45px]'>your cart</h2>
          <div className='flex flex-col border-t border-primary-border'>
            {cartItems.map((item) => {
              const descriptionLines = item.descriptionLines
                ? (formatDescriptionLines(item.descriptionLines) || [])
                : (Array.isArray(item.customTextFields) ? item.customTextFields : []);
              
              // Check for new itemType/setItems format first, then fall back to old string format
              const isProductSet = item.itemType === "set" || (item.setItems && Array.isArray(item.setItems) && item.setItems.length > 0);
              const productCollectionString = descriptionLines.find(x => x?.title === "Set")?.value;
              const isProductCollection = isProductSet || Boolean(productCollectionString);
              
              const isTentItem = item.itemType === "tent" || item.itemType === "pool_cover" || descriptionLines.find(x => x?.title === "TENT TYPE" || x?.title === "POOLCOVER")?.value;

              if (isProductCollection) {
                // Use new setItems if available, otherwise parse old string format
                const productSetItems = productCollectionString ? productCollectionString.split("; ") : [];
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