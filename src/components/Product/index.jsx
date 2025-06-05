"use client";
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToCartButton } from './AddtoQuoteButton'
import ProductDescription from '../common/helpers/ProductDescription';
import { calculateTotalCartQuantity, formatTotalPrice, logError } from '@/utils';
import { SaveProductButton } from '../common/SaveProductButton';
import { AddProductToCart } from '@/services/cart/CartApis';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { useCookies } from 'react-cookie';
import { fetchSavedProductData } from '@/services/products';

const INFO_HEADERS = [
  { title: 'Product', setItem: true },
  { title: 'Size', setItem: false },
  { title: 'Price', setItem: false },
  { title: 'Quantity', setItem: false }
];

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

export const QuantityControls = ({ quantity, onQuantityChange }) => (
  <div className="flex items-center justify-center gap-x-[30px] font-haasRegular">
    <button
      className="select-none text-xl font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity - 1)}
      disabled={quantity <= QUANTITY_LIMITS.MIN}
      aria-label="Decrease quantity"
    >
      -
    </button>
    <input
      className="font-bold bg-transparent max-w-[60px] outline-none text-center appearance-none"
      type="number"
      min={QUANTITY_LIMITS.MIN}
      max={QUANTITY_LIMITS.MAX}
      value={quantity}
      onChange={(e) => onQuantityChange(parseInt(e.target.value) || QUANTITY_LIMITS.MIN)}
      aria-label="Quantity"
    />
    <button
      className="select-none text-xl font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity + 1)}
      disabled={quantity >= QUANTITY_LIMITS.MAX}
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export const Product = ({ data }) => {
  const [cookies, setCookie] = useCookies(["cartQuantity"]);

  const [productSetItems, setProductSetItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [savedProducts, setSavedProducts] = useState([]);

  const redirectWithLoader = useRedirectWithLoader();

  const { productData, productCollectionData } = data;
  const { product } = productData;

  const isProductCollection = productCollectionData?.length > 0;


  useMemo(() => {
    if (!isProductCollection) {
      setProductSetItems([]);
      return;
    }

    const items = productCollectionData.map(set => ({
      id: set.product._id,
      product: set.product.name,
      size: set.product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—",
      formattedPrice: set.product.formattedPrice,
      price: set.product.price,
      quantity: set.quantity
    }));

    setProductSetItems(items);
  }, [isProductCollection, productCollectionData]);

  const productInfoSection = useMemo(() => {
    if (isProductCollection) return [];

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

  const handleQuantityChange = useCallback((value, itemId) => {
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
  }, [isProductCollection]);

  const handleAddToCart = async () => {
    setIsUpdatingCart(true);
    try {
      const product_id = product._id;
      const size = product.additionalInfoSections?.find(x => x.title === "Size")?.value || "—";
      const cartData = {
        lineItems: [
          {
            catalogReference: {
              appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
              catalogItemId: product_id,
              options: {
                customTextFields: {
                  size: size,
                },
              },
            },
            quantity: cartQuantity,
          },
        ],
      };

      await AddProductToCart(cartData);
      const newItems = calculateTotalCartQuantity(cartData.lineItems);
      const total = cookies.cartQuantity ? cookies.cartQuantity + newItems : newItems;
      setCookie("cartQuantity", total, { path: "/" });
      redirectWithLoader("/cart");
    } catch (error) {
      logError("Error while adding item to cart:", error);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const renderTableRows = () => {
    if (isProductCollection) {
      return productSetItems.map((item, index) => (
        <tr key={`${item.product}-${index}`}>
          <td className="py-2 font-semibold border-b border-black">{item.product}</td>
          <td className="border-b border-black font-haasRegular text-center">{item.size}</td>
          <td className="text-center border-b border-black font-haasRegular">{item.formattedPrice}</td>
          <td className="border-b border-black font-haasRegular">
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

  const fetchSavedProducts = async () => {
    try {
      const savedProducts = await fetchSavedProductData();
      setSavedProducts(savedProducts);
    } catch (error) {
      logError("Error while fetching Saved Product", error);
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  return (
    <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px]'>
      <div className='xl:w-1/2'>
        <ProductSlider product={product} />
        <ProductSlider_tab product={product} />
      </div>

      <div className='xl:w-1/2 flex flex-col items-center relative'>
        <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
          <span className='text-secondary-alt lg:text-[16px] text-[12px] uppercase font-haasLight'>
            RENTALS/ Product(Item)
          </span>

          <h1 className='uppercase text-secondary-alt font-recklessRegular lg:text-[90px] lg:leading-[85px] text-[35px] leading-[30px] lg:mt-[15px] lg:mb-[28px] sm:mt-[9px] sm:mb-[9px]'>
            {product.name}
          </h1>

          <div className='lg:mb-[48px] sm:mb-[10px] flex lg:justify-end gap-x-[28px]'>
            <span className='text-[35px] text-secondary-alt font-recklessRegular'>{totalPrice}</span>
            <span className='text-[35px] text-secondary-alt font-recklessRegular uppercase'>(total)</span>
          </div>

          <table className="w-full text-left border-separate border-spacing-y-[24px] mb-20">
            <thead>
              <tr className="text-xs uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th
                    key={header.title}
                    className={`pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'
                      }`}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>

          <ProductDescription text={product.description} />
        </div>

        <AddToCartButton text={isUpdatingCart ? "Adding..." : "Add to Quote"} disabled={isUpdatingCart} onClick={handleAddToCart} />
        <SaveProductButton
          key={product.id}
          productData={productData}
          savedProducts={savedProducts}
          setSavedProducts={setSavedProducts}
        />
      </div>
    </div>
  );
};