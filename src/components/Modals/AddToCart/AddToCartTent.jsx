"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { AddToCartSlider } from './AddToCartSlider'
import { AddToQuoteFormInline } from '@/components/Product-Tent/AddToQuoteFormInline'
import { normalizeProductForDisplay } from '@/utils'

const AddToCartTent = ({ data, onClose }) => {
  const { productData } = data;
  const [hydratedTentProduct, setHydratedTentProduct] = useState(null);

  const baseTentProduct = useMemo(() => {
    const sourceProduct = productData?.product || productData?.tent || productData?.productData || productData || {};
    const normalizedProduct = normalizeProductForDisplay(sourceProduct);
    const galleryMediaItems = Array.isArray(productData?.gallery)
      ? productData.gallery
          .map((item, index) => ({
            id: item?.id || `tent-gallery-${index}`,
            src: item?.src || item?.url || '',
            alt: item?.alt || normalizedProduct.title || `Tent image ${index + 1}`,
          }))
          .filter((item) => item.src)
      : [];

    return {
      ...normalizedProduct,
      mediaItems: normalizedProduct.mediaItems?.length ? normalizedProduct.mediaItems : galleryMediaItems,
    };
  }, [productData]);

  useEffect(() => {
    const quoteFields = baseTentProduct?.tentConfig?.quoteRequestFields;
    if (Array.isArray(quoteFields) && quoteFields.length > 0) {
      setHydratedTentProduct(null);
      return;
    }

    const slugCandidate =
      baseTentProduct?.slug ||
      productData?.slug ||
      productData?.tent?.slug ||
      productData?.product?.slug ||
      productData?.productData?.slug ||
      '';

    const normalizedSlug = String(slugCandidate || '')
      .replace(/^\/+/, '')
      .replace(/^tent\//i, '');

    const productId = String(baseTentProduct?._id || baseTentProduct?.id || '').trim();

    if (!normalizedSlug && !productId) return;

    let isCancelled = false;

    const loadTentConfig = async () => {
      try {
        const query = new URLSearchParams();
        if (normalizedSlug) query.set('slug', normalizedSlug);
        if (productId) query.set('id', productId);

        const response = await fetch(`/api/tent/product?${query.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) return;

        const payload = await response.json();
        const hydrated = normalizeProductForDisplay(payload?.product || {});
        if (!hydrated?._id && !hydrated?.id) return;

        if (!isCancelled) {
          setHydratedTentProduct((prev) => {
            if (prev?._id && prev._id === hydrated._id) return prev;
            return {
              ...hydrated,
              mediaItems: hydrated.mediaItems?.length ? hydrated.mediaItems : baseTentProduct.mediaItems,
            };
          });
        }
      } catch {
        // Best-effort hydration only; keep existing product data path.
      }
    };

    loadTentConfig();

    return () => {
      isCancelled = true;
    };
  }, [baseTentProduct, productData]);

  const tentProduct = hydratedTentProduct || baseTentProduct;

  const sliderData = useMemo(() => ({ product: tentProduct }), [tentProduct]);

  return (
    <div className='relative w-full sm:w-[850px] h-[700px] sm:h-[450px] sm:mt-0 sm:flex-row flex-col flex gap-x-[24px] sm:px-0 px-[20px] bg-primary-alt z-[999] box-border'>
      <AddToCartSlider data={sliderData} isOpen={data.open} isTent={true} />
      <div className='h-full sm:w-[55%] w-full py-[25px] pt-[30px] pr-[20px] overflow-y-auto hide-scrollbar'>
        <AddToQuoteFormInline title={productData?.title || tentProduct?.title} productData={tentProduct} />
      </div>
    </div>
  )
}

export default AddToCartTent;