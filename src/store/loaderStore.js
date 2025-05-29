import { proxy } from 'valtio';

export const loaderState = proxy({
    isLoading: true
});

export const loaderActions = {
    show: () => {
        loaderState.isLoading = true;
    },
    hide: () => {
        loaderState.isLoading = false;
    }
};
