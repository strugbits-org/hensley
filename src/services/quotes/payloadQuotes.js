"use server";
/**
 * Payload CMS Quotes Service
 * Handles quote operations with the Payload CMS backend (bps-core)
 */

import { logError } from "@/utils";
import { getSDK as _getSDK, apiKeySDK as _apiKeySDK, ensureCoreTenantId, CORE_TENANT_ID } from "../payloadSDK";
import { parseSetItemsString } from "../cart/payloadCart";

const getSDK = _getSDK;
const apiKeySDK = _apiKeySDK;

// Resolve product IDs from line items + nested setItems and refetch in a
// single query so legacy quotes (saved before normalizeLineItem persisted
// `productTitle`, or with product IDs Payload's depth-2 populate can't
// resolve) still render a product name in the View Quote modal.
const hydrateQuoteLineItems = async (quote) => {
  if (!quote || !Array.isArray(quote.lineItems) || quote.lineItems.length === 0) {
    return quote;
  }

  const idOf = (ref) => {
    if (!ref) return null;
    if (typeof ref === "string") return ref;
    if (typeof ref === "object") return ref?.id || ref?._id || null;
    return null;
  };

  const productIds = new Set();
  for (const item of quote.lineItems) {
    const itemId = idOf(item?.product);
    if (itemId) productIds.add(itemId);
    if (Array.isArray(item?.setItems)) {
      for (const si of item.setItems) {
        const setId = idOf(si?.product);
        if (setId) productIds.add(setId);
      }
    }
  }

  let productMap = new Map();
  if (productIds.size > 0) {
    try {
      const sdk = apiKeySDK();
      const result = await sdk.find({
        collection: "products",
        where: { id: { in: [...productIds] } },
        pagination: false,
        depth: 1,
      });
      productMap = new Map(
        (result?.docs || []).map((p) => [p?.id || p?._id, p]),
      );
    } catch (error) {
      logError("Error enriching quote product data:", error);
    }
  }

  return {
    ...quote,
    lineItems: quote.lineItems.map((item) => {
      const productId = idOf(item?.product);
      const populatedObj = typeof item?.product === "object" && item.product?.name
        ? item.product
        : null;
      const enriched = populatedObj || productMap.get(productId) || null;

      const hydratedSetItems = Array.isArray(item?.setItems)
        ? item.setItems.map((si) => {
            const sid = idOf(si?.product);
            const siPopulated = typeof si?.product === "object" && si.product?.name
              ? si.product
              : null;
            const siEnriched = siPopulated || productMap.get(sid) || null;
            return {
              ...si,
              product: siEnriched || si.product,
              productName: si?.productName || siEnriched?.name || siEnriched?.title || "",
            };
          })
        : item?.setItems;

      return {
        ...item,
        product: enriched || item.product,
        productTitle: item?.productTitle || enriched?.name || enriched?.title || null,
        ...(hydratedSetItems !== undefined ? { setItems: hydratedSetItems } : {}),
      };
    }),
  };
};

const extractPoolCoverImageIdsFromCustomFields = (fields = []) => {
  const imageField = fields.find((field) => {
    const title = String(field?.title || "").toUpperCase();
    return title === "RELEVENT IMAGES" || title === "RELEVANT IMAGES";
  });

  if (!imageField?.value || typeof imageField.value !== "string") return [];

  return imageField.value
    .split("~~")
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => !value.includes("/") && !/^https?:/i.test(value) && !value.startsWith("wix:"));
};

/**
 * Normalize line item for quote submission
 */
const normalizeLineItem = (item) => {
  // Support both Wix format (descriptionLines) and Payload format (customTextFieldValues)
  const customTextFieldValues = item.customTextFieldValues || item.customTextFields || item.descriptionLines || [];
  
  // Ensure customTextFieldValues is properly formatted
  const normalizedCustomTextFields = Array.isArray(customTextFieldValues) 
    ? customTextFieldValues.map(field => ({
        title: field?.title || field?.name || "",
        value: field?.value || "",
      })).filter(field => field.title && field.title.toLowerCase() !== "set")
    : [];

  // Extract product object if it exists
  const productObj = typeof item.product === "object" ? item.product : null;
  
  // Extract product price from various possible locations
  const productPrice = productObj?.price || productObj?.priceData?.price || 0;
  
  // Try to parse price from formattedPrice if numeric price not available
  const parseFormattedPrice = (formatted) => {
    if (!formatted) return 0;
    const match = String(formatted).match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  };
  
  // Calculate unit price from various sources
  const unitPrice = Number(
    item.unitPrice || 
    item.price || 
    item.priceAtAdd || 
    item.pricePerUnit || 
    productPrice || 
    parseFormattedPrice(item.formattedPrice) ||
    parseFormattedPrice(productObj?.formattedPrice) ||
    0
  );

  // Check if this is a product set
  const setFieldValue = customTextFieldValues.find?.(f => f?.title?.toLowerCase() === "set")?.value;
  const hasSetItems = item.setItems && Array.isArray(item.setItems) && item.setItems.length > 0;
  const isProductSet = item.itemType === "set" || Boolean(setFieldValue || hasSetItems);
  const hasTentFields = normalizedCustomTextFields.some((field) => String(field?.title || '').toUpperCase() === 'TENT TYPE');
  const hasPoolCoverFields = normalizedCustomTextFields.some((field) => String(field?.title || '').toUpperCase() === 'POOLCOVER');
  const poolCoverRelevantImages = Array.isArray(item.poolCoverRelevantImages)
    ? item.poolCoverRelevantImages
        .map((media) => (typeof media === "object" ? media?.id : media))
        .filter(Boolean)
    : extractPoolCoverImageIdsFromCustomFields(normalizedCustomTextFields);

  const poolCoverOptions = hasPoolCoverFields
    ? normalizedCustomTextFields
        .filter((field) => !['POOLCOVER', 'RELEVENT IMAGES', 'RELEVANT IMAGES'].includes(String(field?.title || '').toUpperCase()))
        .map((field) => ({ option: field.title, value: field.value }))
    : [];

  const normalizedItemType = isProductSet
    ? 'set'
    : (item.itemType || (hasPoolCoverFields ? 'pool_cover' : (hasTentFields ? 'tent' : 'product')));

  const base = {
    product: productObj?.id || productObj?._id || item.product || item.productId || item.catalogReference?.catalogItemId,
    productTitle: item.name || item.productName || productObj?.title || productObj?.name || null,
    variant: typeof item.variant === "object" ? item.variant?.id : item.variant || item.catalogReference?.options?.variantId || null,
    quantity: Number(item.quantity) || 1,
    unitPrice: unitPrice,
    itemType: normalizedItemType,
    selectedOptions: item.selectedOptions || item.catalogReference?.options?.options || null,
    customTextFieldValues: normalizedCustomTextFields,
    notes: item.notes || null,
  };

  // Add setItems if this is a set
  if (isProductSet) {
    if (hasSetItems) {
      // Already in new format - normalize
      base.setItems = item.setItems.map((si) => ({
        product: si.product || si.productId || null,
        productName: si.productName || si.name || si.product || "",
        size: si.size || "",
        quantity: parseInt(si.quantity, 10) || 1,
        unitPrice: parseFloat(si.unitPrice || si.price || 0),
      }));
    } else if (setFieldValue) {
      // Parse from old string format
      base.setItems = parseSetItemsString(setFieldValue);
    }
  }

  if (normalizedItemType === 'pool_cover') {
    base.poolCoverOptions = poolCoverOptions;
    base.poolCoverRelevantImages = poolCoverRelevantImages;
  }

  return base;
};

/**
 * Create a quote for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @param {Array} lineItems - Array of line items
 * @param {object} quoteDetails - Quote details (contact, event info, addresses)
 * @returns {Promise<object>} The created quote
 */
export const createMemberQuote = async (memberId, token, lineItems, quoteDetails) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    // Normalize line items
    const normalizedLineItems = lineItems.map(normalizeLineItem);

    // Build quote data
    const quoteData = {
      member: memberId,
      tenant: CORE_TENANT_ID,
      status: "pending",
      orderType: quoteDetails.orderType || "rental",
      
      // Contact Information
      contactName: quoteDetails.name,
      contactEmail: quoteDetails.email,
      contactPhone: quoteDetails.phone,
      
      // Event Details
      eventDescription: quoteDetails.eventDescription || quoteDetails.eventDescriptionPo,
      eventLocation: quoteDetails.eventLocation,
      eventDate: quoteDetails.eventDate ? new Date(quoteDetails.eventDate).toISOString() : null,
      deliveryDate: quoteDetails.deliveryDate ? new Date(quoteDetails.deliveryDate).toISOString() : null,
      pickupDate: quoteDetails.pickupDate ? new Date(quoteDetails.pickupDate).toISOString() : null,
      
      // Event Address - use the main address fields (streetAddress, city, state, zipCode from form)
      // The form collects this in "Billing Details" section but it's actually the delivery/event address
      eventAddress: {
        streetAddress: quoteDetails.streetAddress || quoteDetails.eventAddress?.streetAddress || "",
        addressLine2: quoteDetails.addressLine2 || quoteDetails.eventAddress?.addressLine2 || "",
        city: quoteDetails.city || quoteDetails.eventAddress?.city || "",
        state: quoteDetails.state || quoteDetails.eventAddress?.state || "",
        zipCode: quoteDetails.zipCode || quoteDetails.eventAddress?.zipCode || "",
      },
      
      // Billing - billTo and secondary address fields (city1, state1) or explicit billingAddress
      billTo: quoteDetails.billTo || "",
      billingAddress: {
        streetAddress: quoteDetails.billingAddress?.streetAddress || quoteDetails.billingStreetAddress || quoteDetails.streetAddress || "",
        addressLine2: quoteDetails.billingAddress?.addressLine2 || quoteDetails.billingAddressLine2 || quoteDetails.addressLine2 || "",
        city: quoteDetails.billingAddress?.city || quoteDetails.city1 || quoteDetails.city || "",
        state: quoteDetails.billingAddress?.state || quoteDetails.state1 || quoteDetails.state || "",
        zipCode: quoteDetails.billingAddress?.zipCode || quoteDetails.billingZipCode || quoteDetails.zipCode || "",
      },
      
      // Line Items
      lineItems: normalizedLineItems,
      
      // Special Instructions
      specialInstructions: quoteDetails.specialInstructions || quoteDetails.comments || "",
    };

    const quote = await sdk.create({
      collection: "quotes",
      data: quoteData,
    });

    return quote;
  } catch (error) {
    logError("Error creating member quote:", error);
    throw new Error(error.message || "Failed to create quote");
  }
};

/**
 * Create a quote for a visitor (no member account)
 * @param {string} visitorId - The visitor's ID
 * @param {Array} lineItems - Array of line items
 * @param {object} quoteDetails - Quote details (contact, event info, addresses)
 * @returns {Promise<object>} The created quote
 */
export const createVisitorQuote = async (visitorId, lineItems, quoteDetails) => {
  try {
    ensureCoreTenantId();
    const sdk = apiKeySDK();

    // Normalize line items
    const normalizedLineItems = lineItems.map(normalizeLineItem);

    // Build quote data
    const quoteData = {
      visitorId: visitorId,
      tenant: CORE_TENANT_ID,
      status: "pending",
      orderType: quoteDetails.orderType || "rental",
      
      // Contact Information
      contactName: quoteDetails.name,
      contactEmail: quoteDetails.email,
      contactPhone: quoteDetails.phone,
      
      // Event Details
      eventDescription: quoteDetails.eventDescription || quoteDetails.eventDescriptionPo,
      eventLocation: quoteDetails.eventLocation,
      eventDate: quoteDetails.eventDate ? new Date(quoteDetails.eventDate).toISOString() : null,
      deliveryDate: quoteDetails.deliveryDate ? new Date(quoteDetails.deliveryDate).toISOString() : null,
      pickupDate: quoteDetails.pickupDate ? new Date(quoteDetails.pickupDate).toISOString() : null,
      
      // Event Address - use the main address fields (streetAddress, city, state, zipCode from form)
      eventAddress: {
        streetAddress: quoteDetails.streetAddress || quoteDetails.eventAddress?.streetAddress || "",
        addressLine2: quoteDetails.addressLine2 || quoteDetails.eventAddress?.addressLine2 || "",
        city: quoteDetails.city || quoteDetails.eventAddress?.city || "",
        state: quoteDetails.state || quoteDetails.eventAddress?.state || "",
        zipCode: quoteDetails.zipCode || quoteDetails.eventAddress?.zipCode || "",
      },
      
      // Billing - billTo and secondary address fields (city1, state1) or explicit billingAddress
      billTo: quoteDetails.billTo || "",
      billingAddress: {
        streetAddress: quoteDetails.billingAddress?.streetAddress || quoteDetails.billingStreetAddress || quoteDetails.streetAddress || "",
        addressLine2: quoteDetails.billingAddress?.addressLine2 || quoteDetails.billingAddressLine2 || quoteDetails.addressLine2 || "",
        city: quoteDetails.billingAddress?.city || quoteDetails.city1 || quoteDetails.city || "",
        state: quoteDetails.billingAddress?.state || quoteDetails.state1 || quoteDetails.state || "",
        zipCode: quoteDetails.billingAddress?.zipCode || quoteDetails.billingZipCode || quoteDetails.zipCode || "",
      },
      
      // Line Items
      lineItems: normalizedLineItems,
      
      // Special Instructions
      specialInstructions: quoteDetails.specialInstructions || quoteDetails.comments || "",
    };

    const quote = await sdk.create({
      collection: "quotes",
      data: quoteData,
    });

    return quote;
  } catch (error) {
    logError("Error creating visitor quote:", error);
    throw new Error(error.message || "Failed to create quote");
  }
};

/**
 * Fetch all quotes for a member
 * @param {string} memberId - The member's ID
 * @param {string} token - The member's auth token
 * @returns {Promise<Array>} Array of quotes
 */
export const getMemberQuotes = async (memberId, token) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const result = await sdk.find({
      collection: "quotes",
      where: {
        and: [
          { member: { equals: memberId } },
          { tenant: { equals: CORE_TENANT_ID } },
        ],
      },
      sort: "-createdAt",
      depth: 2,
      pagination: false,
    });

    const docs = result.docs || [];
    return Promise.all(docs.map(hydrateQuoteLineItems));
  } catch (error) {
    logError("Error fetching member quotes:", error);
    throw new Error(error.message || "Failed to fetch quotes");
  }
};

/**
 * Fetch a single quote by ID
 * @param {string} quoteId - The quote's ID
 * @param {string} token - Optional auth token
 * @returns {Promise<object|null>} The quote or null
 */
export const getQuoteById = async (quoteId, token = null) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const result = await sdk.find({
      collection: "quotes",
      where: {
        and: [
          { id: { equals: quoteId } },
          { tenant: { equals: CORE_TENANT_ID } },
        ],
      },
      limit: 1,
      depth: 2,
    });

    return await hydrateQuoteLineItems(result.docs?.[0] || null);
  } catch (error) {
    logError("Error fetching quote by ID:", error);
    throw new Error(error.message || "Failed to fetch quote");
  }
};

/**
 * Fetch a single quote by quote number
 * @param {string} quoteNumber - The quote number (e.g., Q-2024-000001)
 * @param {string} token - Optional auth token
 * @returns {Promise<object|null>} The quote or null
 */
export const getQuoteByNumber = async (quoteNumber, token = null) => {
  try {
    ensureCoreTenantId();
    const sdk = getSDK(token);

    const result = await sdk.find({
      collection: "quotes",
      where: {
        and: [
          { quoteNumber: { equals: quoteNumber } },
          { tenant: { equals: CORE_TENANT_ID } },
        ],
      },
      limit: 1,
      depth: 2,
    });

    return await hydrateQuoteLineItems(result.docs?.[0] || null);
  } catch (error) {
    logError("Error fetching quote by number:", error);
    throw new Error(error.message || "Failed to fetch quote");
  }
};
