"use server";
import { logError } from "@/utils";
import { getAuthToken } from "../auth";

const baseUrl = process.env.BASE_URL;

export const fetchProductSetsData = async () => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/product-sets/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: authToken,
            },
            cache: "no-store"
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
}

export const createProductSet = async (payload) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/product-sets/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: authToken,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
};

export const updateProductSet = async (payload) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/product-sets/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: authToken,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
};

export const deleteProductSet = async (payload) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/product-sets/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: authToken,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
};