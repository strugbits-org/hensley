import { proxy } from 'valtio';

export const lightboxState = proxy({
    lightboxes: {
        contact: false,
        login: false,
        forgotPassword: false,
        invalidate: false
    },
    matchProductsLightBoxDetails: {
        open: false,
        productData: null
    },
    basicLightBoxDetails: {
        open: false,
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        type: 'info',
        disableClose: false
    },
    addToCartModal: {
        open: false,
        type: 'product',
        productData: null
    }
});

export const lightboxActions = {
    getLightBoxState: (ligtbox) => lightboxState.lightboxes[ligtbox],
    showLightBox: (ligtbox) => {
        lightboxState.lightboxes[ligtbox] = true;
    },
    hideLightBox: (ligtbox) => {
        lightboxState.lightboxes[ligtbox] = false;
    },
    toggleLightBox: (ligtbox) => {
        lightboxState.lightboxes[ligtbox] = !lightboxState.lightboxes[ligtbox];
    },
    setMatchProductsLightBoxDetails: (details) => {
        lightboxState.matchProductsLightBoxDetails = details
    },
    resetMatchProductsLightBoxDetails: () => {
        lightboxState.matchProductsLightBoxDetails.open = false;
        setTimeout(() => {
            lightboxState.matchProductsLightBoxDetails = {
                open: false,
                productData: null
            }
        }, 500);
    },
    setBasicLightBoxDetails: (details) => {
        lightboxState.basicLightBoxDetails = details
    },
    resetBasicLightBoxDetails: () => {
        lightboxState.basicLightBoxDetails.open = false;
        setTimeout(() => {
            lightboxState.basicLightBoxDetails = {
                open: false,
                title: '',
                description: '',
                buttonText: '',
                buttonLink: '',
                type: 'info',
                disableClose: false
            }
        }, 500);
    },
    setAddToCartModal: (data) => {
        lightboxState.addToCartModal = data;
    },
    resetAddToCartModal: () => {
        lightboxState.addToCartModal.open = false;
        setTimeout(() => {
            lightboxState.addToCartModal = {
                open: false,
                productData: null
            }
        }, 500);
    },
    hideAllLightBoxes: () => {
        for (const key in lightboxState.lightboxes) {
            lightboxState.lightboxes[key] = false;
        };
        lightboxActions.resetBasicLightBoxDetails();
        lightboxActions.resetAddToCartModal();
        lightboxActions.resetMatchProductsLightBoxDetails();
        // Ensure body scroll is restored
        if (typeof window !== 'undefined') {
            document.body.classList.remove('overflow-hidden');
        }
    }
};
