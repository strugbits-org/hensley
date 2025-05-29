import { proxy } from 'valtio';

export const storeState = proxy({
    lightboxes: {
        contact: false
    },
    cartItems: 0
});

export const storeActions = {
    showLightBox: (ligtbox) => {
        storeState.lightboxes[ligtbox] = true;
    },
    hideLightBox: (ligtbox) => {
        storeState[ligtbox] = false;
    },
    hideAllLightBoxes: () => {
        for (const key in storeState.lightboxes) {
            storeState.lightboxes[key] = false;
        }
    },
    setCartQuantity: (quantity) => {
        storeState.cartItems = quantity;
    }
};
