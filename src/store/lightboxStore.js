import { proxy } from 'valtio';

export const lightboxState = proxy({
    lightboxes: {
        contact: false,
        login: false,
        forgotPassword: false
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
        product: null
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
        console.log("resetAddToCartModal");

        lightboxState.addToCartModal.open = false;
        setTimeout(() => {
            lightboxState.addToCartModal = {
                open: false,
                product: null
            }
        }, 500);
    },
    hideAllLightBoxes: () => {
        for (const key in lightboxState.lightboxes) {
            lightboxState.lightboxes[key] = false;
        };
        lightboxActions.resetBasicLightBoxDetails();
        lightboxActions.resetAddToCartModal();
    }
};
