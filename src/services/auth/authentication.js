import { logError } from "@/utils";
import { getAuthToken, getCartId } from ".";
const baseUrl = process.env.BASE_URL;

export const signUpUser = async (userData) => {
    try {
        const cartId = await getCartId(false);
        if (cartId) userData.cartId = cartId;
        const response = await fetch(`${baseUrl}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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

export const signInUser = async (userData) => {
    try {
        const cartId = await getCartId(false);
        if (cartId) userData.cartId = cartId;

        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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

export const forgotPassword = async (userData) => {
    try {
        const response = await fetch(`${baseUrl}/api/auth/forgotPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError(error.message);
        throw new Error(error.message);
    }
};

export const resetPassword = async (userData, token) => {
    try {
        const response = await fetch(
            `${baseUrl}/api/auth/resetPassword?reset-id=${token}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }
        );

        if (!response.ok) {
            const data = await response.json();
            return { error: true, message: data.message };
        }
        const data = await response.json();

        return data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
};

export const updateProfile = async (userData) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/auth/updateProfile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            body: JSON.stringify(userData),
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

export const changePassword = async (userData) => {
    try {
        const authToken = await getAuthToken();
        const response = await fetch(`${baseUrl}/api/auth/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: true, message: data.message };
        }
        const data = await response.json();

        return data;
    } catch (error) {
        logError(error);
        throw new Error(error);
    }
};