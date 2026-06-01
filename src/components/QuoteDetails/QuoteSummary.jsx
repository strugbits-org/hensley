import React, { useEffect, useState } from 'react'
import { calculateCartTotalPrice, formatDescriptionLines, formatTotalPrice, lineItemHasProductReference, mergeTentPoolOptions } from '@/utils';
import { CartNormal, CartCollection, CartTent } from '../Cart/CartItems';
import PriceDisplay from './PriceDisplay';

const QuoteSummary = ({ data }) => {

  const [totalPrice, setTotalPrice] = useState(0);

  const normalizedLineItems = (data?.lineItems || []).filter(lineItemHasProductReference).map((item) => {
    const product = typeof item?.product === 'object' && item?.product ? item.product : {};
    const rawCustomFields = item?.customTextFieldValues || item?.customTextFields || product?.customTextFieldValues || product?.customTextFields || [];
    const customTextFields = Array.isArray(rawCustomFields) && rawCustomFields[0]?.name
      ? formatDescriptionLines(rawCustomFields)
      : (rawCustomFields || []);

    const resolvedName =
      item?.productName?.original ||
      item?.productName ||
      item?.name ||
      product?.name ||
      product?.title ||
      '';

    const resolvedMainMedia =
      item?.mediaItem?.src ||
      item?.image ||
      product?.mainMedia?.url ||
      product?.mainMedia ||
      '';

    const resolvedUnitPrice = Number(
      item?.unitPrice ??
      item?.priceAtAdd ??
      item?.price ??
      product?.price ??
      0
    ) || 0;

    return {
      ...product,
      ...item,
      name: resolvedName,
      productName: item?.productName || { original: resolvedName },
      quantity: Number(item?.quantity || 1),
      price: resolvedUnitPrice,
      customTextFields,
      mediaItem: { ...(item?.mediaItem || {}), src: resolvedMainMedia },
    };
  });

  useEffect(() => {
    const total = calculateCartTotalPrice(normalizedLineItems);
    setTotalPrice(formatTotalPrice(total));
  }, [data, normalizedLineItems]);

  return (
    <div className='w-full flex lg:flex-row flex-col'>
      <div className='lg:w-[35%] border border-primary-border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
        {/* <div className='lg:block hidden'>
          <span className='
        text-[50px]
        leading-[55px]
        font-haasLight
        uppercase
        block
        '>
            total purchase amount is
          </span>
          <span className='
        font-recklessBold
        text-[90px]
        uppercase
        mt-[20px]
        block
        '>{totalPrice}</span>
        </div> */}

        <PriceDisplay totalPrice={totalPrice} />
      </div>
      <div className='lg:w-[70%] border border-primary-border'>

        {normalizedLineItems.map((product, index) => {
          // Support both Wix (descriptionLines) and Payload (customTextFieldValues/customTextFields) formats
          const rawDescriptionLines = product.descriptionLines || product.customTextFieldValues || product.customTextFields || [];
          const baseDescriptionLines = Array.isArray(rawDescriptionLines) && rawDescriptionLines[0]?.name
            ? formatDescriptionLines(rawDescriptionLines)
            : rawDescriptionLines;
          // Fold tent/pool-cover option arrays into the description lines so the
          // card shows them regardless of whether they were stored as custom
          // fields (legacy) or tentOptions/poolCoverOptions (structured).
          const descriptionLines = mergeTentPoolOptions(baseDescriptionLines, product);
          // Detect sets via the new itemType/setItems model first, then fall
          // back to the legacy "Set" description-line string. Without the
          // itemType/setItems check, bundles saved in the new format render as
          // plain products on this page.
          // `itemType` is the line-item classification; `type` is the
          // authoritative product type from core (bundle/tent/pool_cover).
          // Key off both so an item still renders correctly when one is missing.
          const productCollectionString = descriptionLines.find(x => x.title === "Set")?.value;
          const isProductSet =
            product.itemType === 'set' ||
            product.type === 'bundle' ||
            (Array.isArray(product.setItems) && product.setItems.length > 0);
          const isProductCollection = isProductSet || Boolean(productCollectionString);
          const isTentItem =
            product.itemType === 'tent' ||
            product.itemType === 'pool_cover' ||
            product.type === 'tent' ||
            product.type === 'pool_cover' ||
            descriptionLines.find(x => x.title === "TENT TYPE" || x.title === "POOLCOVER")?.value;

          if (isProductCollection) {
            // Hide legacy/broken bundles that carry no items to show — a set
            // with neither structured setItems nor a legacy "Set" string would
            // render as an empty card. (New quotes can't create these.)
            const hasSetContent =
              (Array.isArray(product.setItems) && product.setItems.length > 0) ||
              Boolean(productCollectionString);
            if (!hasSetContent) return null;
            // New structured setItems already ride on `product`; only the legacy
            // string format needs to be split into productSetItems.
            const productSetItems = productCollectionString ? productCollectionString.split("; ") : [];
            const lineItemData = { ...product, productSetItems };
            return (
              <CartCollection key={index} data={lineItemData} readOnly={true} />
            )
          } else if (isTentItem) {
            return (
              <CartTent key={index} data={product} descriptionLines={descriptionLines} readOnly={true} />
            )
          } else {
            return (
              <CartNormal key={index} data={product} readOnly={true} />
            )
          };
        })}
        {normalizedLineItems.length === 0 && <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>No Items</div>}
      </div>
    </div>
  )
}

export default QuoteSummary