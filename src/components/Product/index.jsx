"use client";
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToCartButton } from './AddtoQuoteButton'
import ProductDescription from '../common/helpers/ProductDescription';
import { calculateTotalCartQuantity, findProductSize, formatDescriptionLines, formatTotalPrice, logError, normalizeProductForDisplay } from '@/utils';
import { SaveProductButton } from '../common/SaveProductButton';
import { AddProductToCart, removeProductFromCart } from '@/services/cart/CartApis';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { useCookies } from 'react-cookie';
import { checkProductInCart } from '@/services/products';
import { BreadCrumbs } from '../common/BreadCrumbs';
import { ProductBadge, resolveProductRibbon } from '../common/ProductBadge';

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

export const Product = ({ data, matchedProducts = [], allCollections = [] }) => {
  const [cookies, setCookie] = useCookies(["cartQuantity"]);

  const [productSetItems, setProductSetItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [productInCart, setProductInCart] = useState();

  const redirectWithLoader = useRedirectWithLoader();

  const { productData, productCollectionData } = data;
  const product = useMemo(() => normalizeProductForDisplay(productData?.product || {}), [productData?.product]);
  const ribbon = resolveProductRibbon(productData?.product, allCollections);

  const isProductCollection = productData?.isProductCollection || false;

  useEffect(() => {
    if (!isProductCollection || !productCollectionData) {
      setProductSetItems([]);
      return;
    }

    const items = productCollectionData.map(set => ({
      id: set.product._id || set.product.id,
      product: set.product.name || set.product.title,
      size: findProductSize(set.product.additionalInfoSections),
      formattedPrice: set.product.formattedPrice || formatTotalPrice(set.product.price),
      price: set.product.price,
      quantity: set.quantity
    }));

    setProductSetItems(items);
  }, [isProductCollection, productCollectionData]);

  const productInfoSection = useMemo(() => {
    if (isProductCollection) return [];

    const productSize = findProductSize(product.additionalInfoSections);
    return [{ size: productSize, formattedPrice: product.formattedPrice }];
  }, [isProductCollection, product]);

  const [referringCollection, setReferringCollection] = useState(null);

  // Pick the breadcrumb category from the referring page when available, so
  // the crumb reflects the path the user actually took (e.g. /subcategory/china
  // → "HOME / CHINA") instead of always defaulting to product.collections[0].
  // Only honor referrers that point to a collection this product belongs to.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const collections = productData?.product?.collections || [];

    // Prefer sessionStorage (set by the listing pages on click-through — works
    // for Next.js client-side nav where document.referrer is empty).
    let candidateSlug = null;
    try {
      const raw = sessionStorage.getItem('lastCategoryCrumb');
      if (raw) {
        const parsed = JSON.parse(raw);
        candidateSlug = parsed?.slug || null;
      }
    } catch {
      // sessionStorage unavailable — fall through to referrer
    }

    // Fallback: document.referrer (works for full page loads / hard nav).
    if (!candidateSlug && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === window.location.origin) {
          const match = refUrl.pathname.match(/^\/(?:subcategory|collections)\/([^/]+)\/?$/);
          if (match) {
            candidateSlug = decodeURIComponent(match[1]);
          }
        }
      } catch {
        // malformed referrer — ignore
      }
    }

    if (!candidateSlug) return;

    const lower = candidateSlug.toLowerCase();
    const hit = collections.find((c) => (c?.slug || '').toLowerCase() === lower);

    if (hit?.slug && hit?.name) {
      setReferringCollection({ name: hit.name, slug: hit.slug });
    } else {
      // Stored crumb doesn't belong to this product — drop it and evict it
      // from sessionStorage so it can't leak into the next product view.
      try { sessionStorage.removeItem('lastCategoryCrumb'); } catch {}
    }
  }, [productData?.product?.collections]);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Home', to: '/' }];

    if (referringCollection) {
      items.push({ label: referringCollection.name });
    } else {
      items.push({ label: product.name || product.title || 'Product' });
    }

    return items;
  }, [referringCollection, product.name, product.title]);

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
      const productId = product._id;
      const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
      let lineItems = [];

      if (isProductCollection) {
        let setItemsData;

        if (productInCart) {
          // Update existing cart item - check for new setItems format first, then fall back to string format
          const existingSetItems = productInCart.setItems || [];
          
          if (existingSetItems.length > 0) {
            // New format - merge with existing setItems
            setItemsData = productSetItems.map((item) => {
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
          } else {
            // Old format - parse from string and convert
            const rawDescriptionLines = productInCart.descriptionLines || productInCart.customTextFieldValues || productInCart.customTextFields || [];
            const descriptionLines = formatDescriptionLines(rawDescriptionLines);
            const existingSet = descriptionLines.find(x => x.title === "Set")?.value || "";

            setItemsData = productSetItems.map((item) => {
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

          await removeProductFromCart([productInCart._id]);
        } else {
          // Create new cart item with structured setItems
          setItemsData = productSetItems.map((item) => ({
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
        // Single product
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

      // Update cart quantity cookie
      const newItems = calculateTotalCartQuantity(cartData.lineItems);
      const total = (cookies.cartQuantity || 0) + newItems;
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

  const setInitialData = async () => {
    try {
      const existInCart = await checkProductInCart(product._id, isProductCollection);
      setProductInCart(existInCart);
    } catch (error) {
      logError("Error while fetching product data", error);
    }
  };

  useEffect(() => {
    setInitialData();
  }, [product._id, isProductCollection]);

  return (
    <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] lg:h-[900px]'>

      <div className='xl:w-1/2 relative'>
        <ProductSlider product={product} />
        <ProductSlider_tab product={product} />
        <SaveProductButton
          key={product._id}
          productData={productData}
        />
      </div>

      <div className='xl:w-1/2 flex flex-col items-center relative'>
        <div className='lg:max-w-[656px] sm:max-w-[492px] h-full overflow-y-scroll hide-scrollbar'>
          <div className='w-full flex items-center my-8'>
            <BreadCrumbs items={breadcrumbItems} />
          </div>

          {ribbon && (
            <div className='mb-3'>
              <span className='inline-block bg-[#e8d98b] text-secondary-alt text-[11px] font-haasRegular uppercase px-3 py-1 rounded-full'>
                {ribbon}
              </span>
            </div>
          )}
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

        <AddToCartButton classes={'lg:!h-[200px] lg:!mt-3'} text={isUpdatingCart ? "Please wait..." : "Add to Quote"} disabled={isUpdatingCart} onClick={handleAddToCart} />
      </div>
    </div>
  );
};