"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthToken } from ".";

const AUTH_COOKIES = ["authToken", "userData", "userTokens", "cartQuantity"];

export const handleUnauthorizedServer = async () => {
    const cookieStore = cookies();
    AUTH_COOKIES.forEach((name) => {
        try { cookieStore.delete(name); } catch {}
    });
    redirect("/");
};

export const authedFetch = async (url, options = {}) => {
    const token = await getAuthToken();
    if (!token) {
        await handleUnauthorizedServer();
        return null;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            Authorization: token,
        },
        cache: options.cache || "no-store",
    });

    if (response.status === 401) {
        await handleUnauthorizedServer();
        return null;
    }

    return response;
};
