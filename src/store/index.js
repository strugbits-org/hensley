import { proxy } from 'valtio';

export const states = proxy({
    savedProducts: [],
    tentsIds: [],
});

export const actions = {
    setSavedProducts: (savedProducts) => (states.savedProducts = savedProducts),
    clearSavedProducts: () => (states.savedProducts = []),
    setTentsIds: (tentsIds) => (states.tentsIds = tentsIds),
    clearTentsIds: () => (states.tentsIds = []),
    isTentProduct: (productOrId) => {
        const normalizeId = (value) => String(value || '').trim();
        const tentIds = new Set((states.tentsIds || []).map(normalizeId).filter(Boolean));

        if (!productOrId) return false;

        if (typeof productOrId === 'string' || typeof productOrId === 'number') {
            return tentIds.has(normalizeId(productOrId));
        }

        const product = productOrId;
        const productId = normalizeId(product?._id || product?.id);
        if (productId && tentIds.has(productId)) return true;

        if (product?.type === 'tent') return true;

        if (Array.isArray(product?.tentConfig?.quoteRequestFields) && product.tentConfig.quoteRequestFields.length > 0) {
            return true;
        }

        const slug = String(product?.slug || '').toLowerCase();
        if (/^tent\//.test(slug) || /(^|-)tent(s)?(-|$)/.test(slug)) return true;

        const title = String(product?.title || product?.name || '').toLowerCase();
        if (/(^|\b)tent(s)?(\b|$)/.test(title)) return true;

        const collections = Array.isArray(product?.collections) ? product.collections : [];
        return collections.some((collection) => {
            const label = String(
                collection?.slug || collection?.title || collection?.name || ''
            ).toLowerCase();
            return /(\b|-)tent(s)?(\b|-)/.test(label);
        });
    },
};
