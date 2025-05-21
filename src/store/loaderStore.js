import { proxy } from 'valtio';

export const loaderState = proxy({
    isLoading: false
});

export const loaderActions = {
    show: () => {
        loaderState.isLoading = true;
    },
    hide: () => {
        loaderState.isLoading = false;
    }
};
