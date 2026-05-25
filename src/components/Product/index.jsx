"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import ProductSlider from "./ProductSlider";
import ProductSlider_tab from "./ProductSlider_tab";
import { AddToCartButton } from "./AddtoQuoteButton";
import ProductDescription from "../common/helpers/ProductDescription";
import {
  calculateTotalCartQuantity,
  findProductSize,
  formatDescriptionLines,
  formatTotalPrice,
  HIDE_PRICES,
  logError,
  normalizeProductForDisplay,
} from "@/utils";
import { SaveProductButton } from "../common/SaveProductButton";
import {
  AddProductToCart,
  removeProductFromCart,
} from "@/services/cart/CartApis";
import useRedirectWithLoader from "@/hooks/useRedirectWithLoader";
import { useCookies } from "react-cookie";
import { checkProductInCart } from "@/services/products";
import { lightboxActions } from "@/store/lightboxStore";
import { BreadCrumbs } from "../common/BreadCrumbs";
import { ProductBadge, resolveProductRibbon } from "../common/ProductBadge";

const INFO_HEADERS = [
  { title: "Product", setItem: true },
  { title: "Size", setItem: false },
  { title: "Price", setItem: false },
  { title: "Quantity", setItem: false },
];

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

export const QuantityControls = ({
  quantity,
  onQuantityChange,
  minQuantity = QUANTITY_LIMITS.MIN,
}) => (
  <div className="flex items-center justify-center gap-x-[30px] 3xl:gap-x-[44px] font-haasRegular 3xl:text-[26px]">
    <button
      className="select-none text-xl 3xl:text-[32px] font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity - 1)}
      disabled={quantity <= minQuantity}
      aria-label="Decrease quantity"
    >
      -
    </button>
    <input
      className="font-bold bg-transparent max-w-[60px] 3xl:max-w-[90px] outline-none text-center appearance-none"
      type="number"
      min={minQuantity}
      max={QUANTITY_LIMITS.MAX}
      value={quantity}
      onChange={(e) => {
        const parsed = parseInt(e.target.value, 10);
        onQuantityChange(Number.isFinite(parsed) ? parsed : minQuantity);
      }}
      aria-label="Quantity"
    />
    <button
      className="select-none text-xl 3xl:text-[32px] font-light hover:opacity-70 transition-opacity"
      onClick={() => onQuantityChange(quantity + 1)}
      disabled={quantity >= QUANTITY_LIMITS.MAX}
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export const Product = ({
  data,
  matchedProducts = [],
  allCollections = [],
}) => {
  const [cookies, setCookie] = useCookies(["cartQuantity"]);

  const [productSetItems, setProductSetItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const redirectWithLoader = useRedirectWithLoader();

  const { productData, productCollectionData } = data;
  const product = useMemo(
    () => normalizeProductForDisplay(productData?.product || {}),
    [productData?.product],
  );
  const ribbon = resolveProductRibbon(productData?.product, allCollections);

  const isProductCollection = productData?.isProductCollection || false;

  useEffect(() => {
    if (!isProductCollection || !productCollectionData) {
      setProductSetItems([]);
      return;
    }

    const items = productCollectionData.map((set) => ({
      id: set.product._id || set.product.id,
      product: set.product.name || set.product.title,
      size: findProductSize(set.product.additionalInfoSections),
      formattedPrice:
        set.product.formattedPrice || formatTotalPrice(set.product.price),
      price: set.product.price,
      quantity: set.quantity,
      required: !!set.required,
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
    if (typeof window === "undefined") return;

    const collections = productData?.product?.collections || [];

    // Prefer sessionStorage (set by the listing pages on click-through — works
    // for Next.js client-side nav where document.referrer is empty).
    let candidateSlug = null;
    try {
      const raw = sessionStorage.getItem("lastCategoryCrumb");
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
          const match = refUrl.pathname.match(
            /^\/(?:subcategory|collections)\/([^/]+)\/?$/,
          );
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
    const hit = collections.find(
      (c) => (c?.slug || "").toLowerCase() === lower,
    );

    if (hit?.slug && hit?.name) {
      setReferringCollection({ name: hit.name, slug: hit.slug });
    } else {
      // Stored crumb doesn't belong to this product — drop it and evict it
      // from sessionStorage so it can't leak into the next product view.
      try {
        sessionStorage.removeItem("lastCategoryCrumb");
      } catch {}
    }
  }, [productData?.product?.collections]);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Home", to: "/" }];

    if (referringCollection) {
      items.push({ label: referringCollection.name });
    } else {
      items.push({ label: product.name || product.title || "Product" });
    }

    return items;
  }, [referringCollection, product.name, product.title]);

  const totalPrice = useMemo(() => {
    if (isProductCollection) {
      const collectionTotal = productSetItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        return total + itemPrice * item.quantity;
      }, 0);
      return formatTotalPrice(collectionTotal);
    }
    return formatTotalPrice(product.price * cartQuantity);
  }, [isProductCollection, productSetItems, product.price, cartQuantity]);

  const visibleHeaders = useMemo(
    () =>
      INFO_HEADERS.filter((header) => {
        if (HIDE_PRICES && header.title === "Price") return false;
        return !header.setItem || isProductCollection;
      }),
    [isProductCollection],
  );

  const handleQuantityChange = useCallback(
    (value, itemId) => {
      const numValue = typeof value === "string" ? parseInt(value, 10) : value;
      if (!Number.isFinite(numValue) || numValue > QUANTITY_LIMITS.MAX) return;

      if (isProductCollection) {
        if (numValue < 0) return;
        setProductSetItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: numValue } : item,
          ),
        );
      } else {
        if (numValue < QUANTITY_LIMITS.MIN) return;
        setCartQuantity(numValue);
      }
    },
    [isProductCollection],
  );

  const handleAddToCart = async () => {
    setIsUpdatingCart(true);
    try {
      const productId = product._id;
      const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
      let lineItems = [];

      if (isProductCollection) {
        let setItemsData;
        const itemsForQuote = productSetItems.filter(
          (item) => parseInt(item.quantity, 10) > 0,
        );

        if (itemsForQuote.length === 0) {
          lightboxActions.setBasicLightBoxDetails({
            title: "No items selected",
            description:
              "Please set quantity for at least one item before adding to your quote.",
            buttonText: "OK",
            open: true,
          });
          return;
        }

        // Re-fetch cart state to avoid acting on stale productInCart (e.g. user added once then re-submits from the same page)
        const currentProductInCart = await checkProductInCart(
          productId,
          isProductCollection,
        );

        if (currentProductInCart) {
          // Update existing cart item - check for new setItems format first, then fall back to string format
          const existingSetItems = currentProductInCart.setItems || [];

          if (existingSetItems.length > 0) {
            // New format - merge with existing setItems and preserve items not touched in this submission
            const newItemNames = new Set(
              itemsForQuote.map((item) => item.product),
            );
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
              const existingItem = existingSetItems.find(
                (si) => si.productName === item.product,
              );
              const oldQuantity =
                existingItem ? parseInt(existingItem.quantity, 10) : 0;
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
            const rawDescriptionLines =
              currentProductInCart.descriptionLines ||
              currentProductInCart.customTextFieldValues ||
              currentProductInCart.customTextFields ||
              [];
            const descriptionLines =
              formatDescriptionLines(rawDescriptionLines);
            const existingSet =
              descriptionLines.find((x) => x.title === "Set")?.value || "";

            setItemsData = itemsForQuote.map((item) => {
              const existingItemStr = existingSet
                .split("; ")
                .find((field) => field.includes(item.product));
              const oldQuantity =
                existingItemStr ?
                  parseInt(existingItemStr.split("~")[3], 10)
                : 0;
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

        lineItems = [
          {
            catalogReference: {
              appId,
              catalogItemId: productId,
              options: {
                customTextFields: {},
              },
            },
            setItems: setItemsData,
            quantity: 1,
            price: product.price || 0,
          },
        ];
      } else {
        // Single product
        const size = findProductSize(product.additionalInfoSections);

        lineItems = [
          {
            catalogReference: {
              appId,
              catalogItemId: productId,
              options: {
                customTextFields: { size },
              },
            },
            quantity: cartQuantity,
            price: product.price || 0,
          },
        ];
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
          <td className="py-2 font-semibold border-b border-black">
            {item.product}
          </td>
          <td className="border-b border-black font-haasRegular text-center">
            {item.size}
          </td>
          {!HIDE_PRICES && (
            <td className="text-center border-b border-black font-haasRegular">
              {item.formattedPrice}
            </td>
          )}
          <td className="border-b border-black font-haasRegular">
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
        <td className="border-b border-black font-haasRegular text-left">
          {item.size}
        </td>
        {!HIDE_PRICES && (
          <td className="text-center border-b border-black font-haasRegular">
            {item.formattedPrice}
          </td>
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

  return (
    <div className="w-full flex lg:flex-row flex-col gap-x-[24px] 3xl:gap-x-[40px] px-[24px] 3xl:px-[40px] py-[24px] 3xl:py-[40px] lg:gap-y-0 gap-y-[30px] lg:h-[900px] 3xl:h-[calc(100vh-160px)]">
      <div className="lg:w-1/2 w-full relative">
        <ProductSlider product={product} />
        <ProductSlider_tab product={product} productData={productData} />
      </div>

      <div className="lg:w-1/2 w-full flex flex-col items-center relative h-full">
        <div className="lg:max-w-[656px] sm:max-w-[492px] 3xl:max-w-[1400px] w-full flex-1 overflow-y-auto hide-scrollbar lg:pb-[20vh]">
          <div className="w-full flex items-center justify-between mt-2 mb-6 relative">
            <BreadCrumbs items={breadcrumbItems} />
            <SaveProductButton
              key={product._id}
              productData={productData}
              className="lg:flex hidden relative right-0 top-0 md:right-0 md:top-0 shrink-0"
            />
          </div>

          {ribbon && (
            <div className="mb-3">
              <span className="inline-block bg-[#e8d98b] text-secondary-alt text-[11px] font-haasRegular uppercase px-3 py-1 rounded-full">
                {ribbon}
              </span>
            </div>
          )}
          <h1 className="uppercase text-secondary-alt font-recklessRegular lg:text-[90px] 3xl:text-[180px] lg:leading-[85px] 3xl:leading-[170px] text-[35px] leading-[30px] lg:mt-[10px] lg:mb-[15px] sm:mt-[9px] sm:mb-[9px]">
            {product.name}
          </h1>

          {!HIDE_PRICES && (
            <div className="lg:mb-[20px] sm:mb-[10px] flex lg:justify-end gap-x-[28px] 3xl:gap-x-[44px]">
              <span className="text-[35px] 3xl:text-[60px] text-secondary-alt font-recklessRegular">
                {totalPrice}
              </span>
              <span className="text-[35px] 3xl:text-[60px] text-secondary-alt font-recklessRegular uppercase">
                (total)
              </span>
            </div>
          )}

          <table className="w-full text-left border-separate border-spacing-y-[12px] 3xl:border-spacing-y-[20px] mb-6 3xl:text-[26px]">
            <thead>
              <tr className="text-xs uppercase text-gray-500 border-b border-black">
                {visibleHeaders.map((header, index) => (
                  <th
                    key={header.title}
                    className={`pb-2 w-1/4 text-[16px] 3xl:text-[26px] uppercase font-haasLight text-secondary-alt ${
                      index === 0 ? "text-left" : "text-center"
                    }`}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>

          {isProductCollection && (
            <p className="text-[11px] text-secondary-alt font-haasLight italic -mt-[14px] mb-6">
              Items with quantity 0 will not be added to your quote.
            </p>
          )}

          <ProductDescription text={product.description} />
        </div>

        <AddToCartButton
          classes={
            "h-[90px] md:h-[90px] lg:!h-[130px] 3xl:!h-[200px] lg:!mt-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:z-10 lg:w-full lg:max-w-none sm:max-w-[492px] w-full"
          }
          text={isUpdatingCart ? "Please wait..." : "Add to Quote"}
          disabled={isUpdatingCart}
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
};
