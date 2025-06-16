"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { AddToQuoteButton } from './AddtoQuoteButton'
import ProductDescription from '@/components/common/helpers/ProductDescription'
import { QuantityControls } from '@/components/Product'
import { calculateTotalCartQuantity, formatDescriptionLines, formatTotalPrice, logError } from '@/utils'
import { AddProductToCart, removeProductFromCart } from '@/services/cart/CartApis'
import { useCookies } from 'react-cookie'
import { lightboxActions } from '@/store/lightboxStore'
import Loading from '@/app/loading'
import { checkProductInCart, fetchProductCollectionData } from '@/services/products'

const INFO_HEADERS = [
  { title: 'Product', setItem: true },
  { title: 'Size', setItem: false },
  { title: 'Price', setItem: false },
  { title: 'Quantity', setItem: false }
];
const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const AddToCart = ({ data, onClose }) => {
  const { productData } = data;
  const { product, isProductCollection = false } = productData;
  const [cartQuantity, setCartQuantity] = useState(1);
  const [productSetItems, setProductSetItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [productInCart, setProductInCart] = useState();
  const [cookies, setCookie] = useCookies(["cartQuantity"]);

  const productInfoSection = useMemo(() => {
    if (isProductCollection) {
      return [];
    }

    const productSize = product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—";
    return [{ size: productSize, formattedPrice: product.formattedPrice }];
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
    INFO_HEADERS.filter(header => !header.setItem || isProductCollection),
    [isProductCollection]
  );

  const renderTableRows = () => {
    if (isProductCollection) {
      return productSetItems.map((item, index) => (
        <tr key={`${item.product}-${index}`}>
          <td className="text-sm py-2 font-bold border-b border-black">{item.product}</td>
          <td className="text-sm border-b border-black font-haasRegular text-center">{item.size}</td>
          <td className="text-sm text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
          <td className="text-sm border-b border-black font-haasRegular">
            <QuantityControls
              quantity={item.quantity}
              onQuantityChange={(value) => handleQuantityChange(value, item.id)}
            />
          </td>
        </tr>
      ));
    }

    return productInfoSection.map((item, index) => (
      <tr key={`item-${index}`}>
        <td className="border-b border-black font-haasRegular text-left">{item.size}</td>
        <td className="text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
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
    const numValue = typeof value === 'string' ? parseInt(value) || QUANTITY_LIMITS.MIN : value;
    if (numValue < QUANTITY_LIMITS.MIN || numValue > QUANTITY_LIMITS.MAX) return;

    if (isProductCollection) {
      setProductSetItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: numValue } : item
        )
      );
    } else {
      setCartQuantity(numValue);
    }
  }, [isProductCollection, isLoading]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const productId = product._id;
      const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
      let lineItems = [];

      if (isProductCollection) {
        let setData;

        if (productInCart) {
          const descriptionLines = formatDescriptionLines(productInCart.descriptionLines);
          const existingSet = descriptionLines.find(x => x.title === "Set")?.value;

          setData = productSetItems.map((item) => {
            const existingItem = existingSet.split("; ").find((field) => field.includes(item.product));
            const oldQuantity = existingItem ? parseInt(existingItem.split("~")[3]) : 0;
            return `${item.product}~${item.size}~${item.price}~${oldQuantity + parseInt(item.quantity)}`;
          }).join("; ");

          await removeProductFromCart([productInCart._id]);
        } else {
          setData = productSetItems.map((item) =>
            `${item.product}~${item.size}~${item.price}~${item.quantity}`
          ).join("; ");
        }

        lineItems = [{
          catalogReference: {
            appId,
            catalogItemId: productId,
            options: {
              customTextFields: { "Set": setData }
            },
          },
          quantity: 1,
        }];
      } else {
        const size = product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—";

        lineItems = [{
          catalogReference: {
            appId,
            catalogItemId: productId,
            options: {
              customTextFields: { size }
            },
          },
          quantity: cartQuantity,
        }];
      }

      const cartData = { lineItems };

      await AddProductToCart(cartData);

      const newItems = calculateTotalCartQuantity(cartData.lineItems);
      const total = cookies.cartQuantity ? cookies.cartQuantity + newItems : newItems;
      setCookie("cartQuantity", total, { path: "/" });
      setTimeout(() => {
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

  const setInitialData = async () => {
    try {
      if (!isProductCollection) return;

      setIsLoadingCollections(true);
      const productId = product._id;

      const collectionData = await fetchProductCollectionData(productId);

      if (!collectionData) return;

      const items = collectionData.map(set => ({
        id: set.product._id,
        product: set.product.name,
        size: set.product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—",
        formattedPrice: set.product.formattedPrice,
        price: set.product.price,
        quantity: set.quantity
      }));

      setProductSetItems(items);
      setIsLoadingCollections(false);

      checkProductInCart(productId, isProductCollection)
        .then(existInCart => {
          setProductInCart(existInCart);
        })
        .catch(error => {
          logError("Error while checking product in cart", error);
        });

    } catch (error) {
      logError("Error while fetching product data", error);
      setIsLoadingCollections(false);
    }
  };

  useEffect(() => {
    setInitialData();
  }, [isProductCollection]);

  return (
    <div className='sm:w-[850px] w-full sm:h-[450px] sm:overflow-y-auto overflow-y-scroll hide-scrollbar max-sm:h-[820px] sm:mt-0 sm:flex-row flex-col flex gap-x-[24px] sm:px-0 px-[20px] bg-primary-alt z-[999999] box-border'>
      {isLoadingCollections && (
        <div className='absolute inset-x-4 inset-y-0 bg-secondary-alt opacity-30 z-[999] flex justify-center items-center'>
          <Loading custom={true} classes='absolute' />
        </div>
      )}
      <AddToCartSlider data={productData} isOpen={data.open} />
      <div className='h-full sm:w-[55%] w-full py-[20px] pr-[20px] relative'>
        <div className='w-full flex flex-col gap-y-[15px] overflow-y-scroll hide-scrollbar sm:h-[320px]'>
          <div className='w-full flex justify-between relative '>
            <span className='
            text-[35px]
            leading-[30px]
            text-secondary-alt
            font-recklessRegular
            uppercase
            '>{product.name}</span>
            <button onClick={onClose} className='close-button'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                  <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                  <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                </g>
              </svg>

            </button>
          </div>
          <div className='w-full flex gap-x-[20px] sm:justify-end justify-start '>
            <span
              className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        block
        '
            >{totalPrice}</span>
            <span
              className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        block
        uppercase
        '
            >(total)</span>
          </div>
          <table className="w-full text-left border-separate border-spacing-y-[15px]">
            <thead>
              <tr className="text-xs max-lg:hidden uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th key={header.title} className={`pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
          <div className='py-[10px] '>
            <ProductDescription maxChars={130} text={product.description} />
          </div>
        </div>
        <AddToQuoteButton classes={"lg:!h-[80px] lg:!mt-0 !mt-0 !text-[14px] "} onClick={handleAddToCart} text={isLoading ? "PLEASE WAIT..." : "ADD TO QUOTE"} disabled={isLoading} />

      </div>
    </div>
  )
}

export default AddToCart;