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
    isTentProduct: (productId) => states.tentsIds.includes(productId),
};
