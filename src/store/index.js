import { proxy } from 'valtio';

export const storeState = proxy({
    contactForm: false,
    cartQuantity: 0
});

export const storeActions = {
    showContactForm: () => {
        storeState.contactForm = true;
    },
    hideContactForm: () => {
        storeState.contactForm = false;
    },
    setCartQuantity: (quantity) => {
        storeState.cartQuantity = quantity;
    }
};
