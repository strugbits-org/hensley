import React, { useEffect, useState } from 'react'
import { calculateCartTotalPrice, formatDescriptionLines, formatTotalPrice, lineItemHasProductReference } from '@/utils';
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
          const descriptionLines = Array.isArray(rawDescriptionLines) && rawDescriptionLines[0]?.name 
            ? formatDescriptionLines(rawDescriptionLines) 
            : rawDescriptionLines;
          const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
          const isTentItem =
            product.itemType === 'tent' ||
            product.itemType === 'pool_cover' ||
            descriptionLines.find(x => x.title === "TENT TYPE" || x.title === "POOLCOVER")?.value;

          if (productCollection) {
            const productSetItems = productCollection.split("; ");
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