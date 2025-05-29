import { proxy } from 'valtio';

export const lightboxState = proxy({
    lightboxes: {
        contact: false
    },
});

export const lightboxActions = {
    showLightBox: (ligtbox) => {
        lightboxState.lightboxes[ligtbox] = true;
    },
    hideLightBox: (ligtbox) => {
        lightboxState.lightboxes[ligtbox] = false;
    },
    hideAllLightBoxes: () => {
        for (const key in lightboxState.lightboxes) {
            lightboxState.lightboxes[key] = false;
        }
    }
};
