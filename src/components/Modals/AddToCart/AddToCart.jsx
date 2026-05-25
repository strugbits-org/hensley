"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { AddToQuoteButton } from './AddtoQuoteButton'
import ProductDescription from '@/components/common/helpers/ProductDescription'
import { QuantityControls } from '@/components/Product'
import { calculateTotalCartQuantity, findProductSize, formatDescriptionLines, formatTotalPrice, HIDE_PRICES, logError, normalizeProductForDisplay } from '@/utils'
import { AddProductToCart, removeProductFromCart } from '@/services/cart/CartApis'
import { useCookies } from 'react-cookie'
import { lightboxActions } from '@/store/lightboxStore'
import { checkProductInCart, fetchProductCollectionData } from '@/services/products'
import { resolveProductRibbon } from '@/components/common/ProductBadge'

const INFO_HEADERS = [
  { title: 'Product', setItem: true },
  { title: 'Size', setItem: false },
  { title: 'Price', setItem: false },
  { title: 'Quantity', setItem: false }
];
const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const AddToCart = ({ data, onClose, allCollections = [] }) => {
  const { productData } = data;
  const product = useMemo(() => normalizeProductForDisplay(productData?.product || {}), [productData?.product]);
  const ribbon = resolveProductRibbon(productData?.product, allCollections);
  
  // bps-core sets `type` on every product, so we can decide locally without
  // a fetch. Bundle products always ship their bundleItems with the product
  // payload — no network round-trip needed before rendering.
  const isPayloadBundle = product?.type === 'bundle';

  const [cartQuantity, setCartQuantity] = useState(1);
  const [productSetItems, setProductSetItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["cartQuantity"]);

  const isProductCollection = isPayloadBundle;

  const productInfoSection = useMemo(() => {
    if (isProductCollection) {
      return [];
    }
    const size = findProductSize(product.additionalInfoSections);
    return [{ size: size, formattedPrice: product.formattedPrice }];
  }, [isProductCollection, product]);

  const totalPrice = useMemo(() => {
    if (isProductCollection) {
      const collectionTotal = productSetItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        return total + (itemPrice * item.quantity);
      }, 0);
      return formatTotalPrice(collectionTotal);
    }
    return formatTotalPrice(product.price * cartQuantity);
  }, [isProductCollection, productSetItems, product.price, cartQuantity]);

  const visibleHeaders = useMemo(() =>
    INFO_HEADERS.filter(header => {
      if (HIDE_PRICES && header.title === 'Price') return false;
      return !header.setItem || isProductCollection;
    }),
    [isProductCollection]
  );

  const renderTableRows = () => {
    if (isProductCollection) {
      return productSetItems.map((item, index) => (
        <tr key={`${item.product}-${index}`}>
          <td className="text-sm py-2 font-bold border-b border-black">{item.product}</td>
          <td className="text-sm border-b border-black font-haasRegular text-center">{item.size}</td>
          {!HIDE_PRICES && (
            <td className="text-sm text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
          )}
          <td className="text-sm border-b border-black font-haasRegular">
            <QuantityControls
              quantity={item.quantity}
              onQuantityChange={(value) => handleQuantityChange(value, item.id)}
              minQuantity={0}
            />
          </td>
        </tr>
      ));
    }

    return productInfoSection.map((item, index) => (
      <tr key={`item-${index}`}>
        <td className="border-b border-black font-haasRegular text-left">{item.size}</td>
        {!HIDE_PRICES && (
          <td className="text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
        )}
        <td className="border-b border-black font-haasRegular">
          <QuantityControls
            quantity={cartQuantity}
            onQuantityChange={handleQuantityChange}
          />
        </td>
      </tr>
    ));
  };

  const handleQuantityChange = useCallback((value, itemId) => {
    if (isLoading) return;
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!Number.isFinite(numValue) || numValue > QUANTITY_LIMITS.MAX) return;

    if (isProductCollection) {
      if (numValue < 0) return;
      setProductSetItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: numValue } : item
        )
      );
    } else {
      if (numValue < QUANTITY_LIMITS.MIN) return;
      setCartQuantity(numValue);
    }
  }, [isProductCollection, isLoading]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const productId = product._id || product.id;
      const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
      let lineItems = [];

      if (isProductCollection) {
        let setItemsData;
        const itemsForQuote = productSetItems.filter((item) => parseInt(item.quantity, 10) > 0);

        if (itemsForQuote.length === 0) {
          setIsLoading(false);
          lightboxActions.setBasicLightBoxDetails({
            title: "No items selected",
            description: "Please set quantity for at least one item before adding to your quote.",
            buttonText: "OK",
            open: true,
          });
          return;
        }

        // Re-fetch cart state to avoid acting on stale productInCart (e.g. user added once then re-submits from the same modal)
        const currentProductInCart = await checkProductInCart(productId, isProductCollection);

        if (currentProductInCart) {
          // Check for new setItems format first, then fall back to string format
          const existingSetItems = currentProductInCart.setItems || [];

          if (existingSetItems.length > 0) {
            // New format - merge with existing setItems and preserve items not touched in this submission
            const newItemNames = new Set(itemsForQuote.map((item) => item.product));
            const preservedExisting = existingSetItems
              .filter((si) => !newItemNames.has(si.productName))
              .map((si) => ({
                product: si.product || null,
                productName: si.productName,
                size: si.size,
                quantity: parseInt(si.quantity, 10),
                unitPrice: parseFloat(si.unitPrice) || 0,
              }));
            const merged = itemsForQuote.map((item) => {
              const existingItem = existingSetItems.find((si) => si.productName === item.product);
              const oldQuantity = existingItem ? parseInt(existingItem.quantity, 10) : 0;
              return {
                product: item.productId || null,
                productName: item.product,
                size: item.size,
                quantity: oldQuantity + parseInt(item.quantity, 10),
                unitPrice: parseFloat(item.price) || 0,
              };
            });
            setItemsData = [...preservedExisting, ...merged];
          } else {
            // Old format - parse from string and convert
            const rawDescriptionLines = currentProductInCart.descriptionLines || currentProductInCart.customTextFieldValues || currentProductInCart.customTextFields || [];
            const descriptionLines = formatDescriptionLines(rawDescriptionLines);
            const existingSet = descriptionLines.find(x => x.title === "Set")?.value || "";

            setItemsData = itemsForQuote.map((item) => {
              const existingItemStr = existingSet.split("; ").find((field) => field.includes(item.product));
              const oldQuantity = existingItemStr ? parseInt(existingItemStr.split("~")[3], 10) : 0;
              return {
                product: item.productId || null,
                productName: item.product,
                size: item.size,
                quantity: oldQuantity + parseInt(item.quantity, 10),
                unitPrice: parseFloat(item.price) || 0,
              };
            });
          }

          await removeProductFromCart([currentProductInCart._id]);
        } else {
          // Create new cart item with structured setItems
          setItemsData = itemsForQuote.map((item) => ({
            product: item.productId || null,
            productName: item.product,
            size: item.size,
            quantity: parseInt(item.quantity, 10),
            unitPrice: parseFloat(item.price) || 0,
          }));
        }

        lineItems = [{
          catalogReference: {
            appId,
            catalogItemId: productId,
            options: {
              customTextFields: {}
            },
          },
          setItems: setItemsData,
          quantity: 1,
          price: product.price || 0,
        }];
      } else {
        const size = findProductSize(product.additionalInfoSections);

        lineItems = [{
          catalogReference: {
            appId,
            catalogItemId: productId,
            options: {
              customTextFields: { size }
            },
          },
          quantity: cartQuantity,
          price: product.price || 0,
        }];
      }

      const cartData = { lineItems };

      await AddProductToCart(cartData);

      const newItems = calculateTotalCartQuantity(cartData.lineItems);
      const total = cookies.cartQuantity ? cookies.cartQuantity + newItems : newItems;
      setCookie("cartQuantity", total, { path: "/" });
      setTimeout(() => {
        lightboxActions.setBasicLightBoxDetails({
          title: "Added to Cart",
          description: "Products added to cart successfully",
          buttonText: "View Cart",
          buttonLink: "/cart",
          secondaryButtonText: "Continue Shopping",
          onSecondaryClick: () => lightboxActions.resetAddToCartModal(),
          open: true,
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      logError("Error while adding item to cart:", error);
      setTimeout(() => {
        lightboxActions.setBasicLightBoxDetails({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          buttonText: "Close",
          open: true,
        });
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    const productId = product._id || product.id;
    if (!productId) return;

    let isCancelled = false;

    const loadBundleItems = async () => {
      if (!isPayloadBundle) return;
      try {
        const collectionData = await fetchProductCollectionData(productId, product);
        if (isCancelled || !collectionData) return;
        const items = collectionData.map(set => ({
          id: set.product._id || set.product.id,
          product: set.product.name || set.product.title,
          size: findProductSize(set.product.additionalInfoSections),
          formattedPrice: set.product.formattedPrice || formatTotalPrice(set.product.price),
          price: set.product.price,
          quantity: set.quantity,
          required: !!set.required,
        }));
        setProductSetItems(items);
      } catch (error) {
        logError("Error while resolving bundle items", error);
      }
    };

    loadBundleItems();

    return () => { isCancelled = true; };
  }, [product._id, product.id, isPayloadBundle]);

  return (
    <div className='relative sm:w-[850px] 3xl:w-[1320px] w-full sm:h-[450px] 3xl:h-[700px] sm:overflow-y-auto overflow-y-scroll hide-scrollbar max-sm:h-[820px] sm:mt-0 sm:flex-row flex-col flex gap-x-[24px] 3xl:gap-x-[40px] sm:px-0 px-[20px] bg-primary-alt z-[999999] box-border'>
      <div className='relative sm:max-w-[45%] w-full sm:h-full flex-shrink-0'>
        <AddToCartSlider data={{ ...productData, product }} isOpen={data.open} noWidthConstraint />
        {ribbon && (
          <span className='absolute top-3 left-3 z-20 bg-[#e8d98b] text-secondary-alt text-[11px] font-haasRegular uppercase px-3 py-1 rounded-full pointer-events-none'>
            {ribbon}
          </span>
        )}
      </div>
      <div className='h-full sm:w-[55%] w-full py-[25px] 3xl:py-[40px] pt-[30px] 3xl:pt-[48px] pr-[20px] 3xl:pr-[32px] relative'>
        <div className='w-full flex flex-col  gap-y-[15px] 3xl:gap-y-[24px] overflow-y-scroll hide-scrollbar sm:h-[320px] 3xl:h-[500px]'>
          <div className='w-full flex justify-between relative pr-8'>
            <span className='
            text-[35px] 3xl:text-[56px]
            leading-[30px] 3xl:leading-[52px]
            text-secondary-alt
            font-recklessRegular
            uppercase
            w-full
            '>{product.name || product.title}</span>
            <button onClick={onClose} className='close-button absolute top-0 right-0'>
              <svg className='3xl:w-[40px] 3xl:h-[40px]' preserveAspectRatio="xMidYMid meet" width="24.707" height="24.707" data-bbox="25.975 25.975 148.05 148.05" xmlns="http://www.w3.org/2000/svg" viewBox="25.975 25.975 148.05 148.05" role="presentation" aria-hidden="true">
                <g>
                  <path d="M172.9 167.6L105.3 100l67.6-67.6c1.5-1.5 1.5-3.8 0-5.3s-3.8-1.5-5.3 0L100 94.7 32.4 27.1c-1.5-1.5-3.8-1.5-5.3 0s-1.5 3.8 0 5.3L94.7 100l-67.6 67.6c-1.5 1.5-1.5 3.8 0 5.3s3.8 1.5 5.3 0l67.6-67.6 67.6 67.6c1.5 1.5 3.8 1.5 5.3 0s1.5-3.8 0-5.3z"></path>
                </g>
              </svg>
            </button>
          </div>
          {!HIDE_PRICES && (
            <div className='w-full flex gap-x-[20px] sm:justify-end justify-start '>
              <span
                className='
        text-[25px] 3xl:text-[40px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        block
        '
              >{totalPrice}</span>
              <span className='text-[25px] 3xl:text-[40px] text-secondary-alt font-recklessRegular block uppercase '>(total)</span>
            </div>
          )}
          <table className="w-full text-left border-separate border-spacing-y-[15px] 3xl:border-spacing-y-[22px] 3xl:text-[24px]">
            <thead>
              <tr className="text-xs max-lg:hidden uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th key={header.title} className={`pb-2 w-1/4 text-[16px] 3xl:text-[26px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
          {isProductCollection && (
            <p className='text-[11px] text-secondary-alt font-haasLight italic -mt-[8px]'>
              Items with quantity 0 will not be added to your quote.
            </p>
          )}
          {product.descriptionText && (
            <div className='py-[10px]'>
              <ProductDescription maxChars={130} text={product.description} />
            </div>
          )}
        </div>
        <AddToQuoteButton classes={"lg:!h-[80px] 3xl:!h-[130px] lg:!mt-0 !mt-0 !text-[14px] 3xl:!text-[24px] "} onClick={handleAddToCart} text={isLoading ? "PLEASE WAIT..." : "ADD TO QUOTE"} disabled={isLoading} />

      </div>
    </div>
  )
}

export default AddToCart;