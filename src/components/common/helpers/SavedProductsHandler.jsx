"use client";
import { fetchSavedProductData } from '@/services/products';
import { actions, states } from '@/store';
import { logError } from '@/utils';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';


export const SavedProductsHandler = () => {
    const { savedProducts } = useSnapshot(states);

    const fetchSavedProducts = async () => {
        try {
            if (savedProducts.length > 0) return;
            const data = await fetchSavedProductData();
            actions.setSavedProducts(data);
        } catch (error) {
            logError("Error while fetching Saved Product", error);
        }
    };
    useEffect(() => {
        fetchSavedProducts();
    }, []);
    return;
}
