import React from 'react';

/**
 * Resolves the ribbon/badge text for a product.
 *
 * Priority:
 *  1. product.ribbon (direct product field)
 *  2. Parent category ribbon (category with no parent that has a ribbon wins)
 *  3. Any category ribbon (first non-parent category with a ribbon)
 *
 * @param {object} product - raw product object from Payload
 * @param {Array}  allCollections - flat array of all product-collections (with ribbon + parent fields)
 * @returns {string|null} ribbon text or null
 */
export function resolveProductRibbon(product, allCollections = []) {
    if (!product) return null;

    // 1. Product's own ribbon takes highest priority
    const directRibbon = product?.ribbon;
    if (directRibbon && typeof directRibbon === 'string' && directRibbon.trim()) {
        return directRibbon.trim();
    }

    // 2. Check category ribbons
    const collectionsSource =
        product?.collections ||
        product?.productCollections ||
        product?.productCollection ||
        product?.collection;
    const productCollections = Array.isArray(collectionsSource)
        ? collectionsSource
        : collectionsSource
        ? [collectionsSource]
        : [];

    if (!productCollections.length || !allCollections.length) return null;

    // Resolve each collection ID from the product's collections array
    const getCollectionId = (c) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object') return c?.id || c?._id || null;
        return null;
    };

    const productCollectionIds = new Set(
        productCollections.map(getCollectionId).filter(Boolean)
    );

    // Find matching collections that have a ribbon
    const matchingWithRibbon = allCollections.filter((col) => {
        const colId = col?.id || col?._id;
        return (
            colId &&
            productCollectionIds.has(colId) &&
            col?.ribbon &&
            typeof col.ribbon === 'string' &&
            col.ribbon.trim()
        );
    });

    if (!matchingWithRibbon.length) return null;

    // Prefer parent (top-level) categories — those with no parent field
    const parentLevel = matchingWithRibbon.filter(
        (col) => !col?.parent
    );

    if (parentLevel.length) {
        return parentLevel[0].ribbon.trim();
    }

    return matchingWithRibbon[0].ribbon.trim();
}

/**
 * Badge pill displayed on product cards / product pages.
 * Matches the "New Arrival" style shown in the design screenshot.
 */
export function ProductBadge({ ribbon }) {
    if (!ribbon) return null;
    return (
        <span className="absolute top-3 left-3 z-10 bg-[#e8d98b] text-secondary-alt text-[11px] font-haasRegular uppercase px-3 py-1 rounded-full pointer-events-none">
            {ribbon}
        </span>
    );
}
