"use server";
import { logError } from "@/utils";
import { getAuthToken } from "../auth";
import { fetchMarketsData, fetchStudiosData } from "..";
import { fetchAllProducts } from "../products";

const baseUrl = process.env.BASE_URL;

// Product Sets

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

// Manage Blogs and Projects

export const fetchManageProjectsData = async () => {
    try {
        const [projectsData, productsData, marketsData, studiosData] = await Promise.all([
            fetchProjectsData(),
            fetchAllProducts(),
            fetchMarketsData(),
            fetchStudiosData(),
        ]);

        return { projectsData, productsData, marketsData, studiosData };
    } catch (error) {
        logError("Error fetching manage projects data:", error);
    }
}

export const fetchProjectsData = async () => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/manage-projects/get`, {
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

export const updateProjectData = async (payload) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/manage-projects/update`, {
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
    }
};



export const fetchManageBlogsData = async () => {
    try {
        const [blogsData, productsData, marketsData, studiosData] = await Promise.all([
            fetchBlogsData(),
            fetchAllProducts(),
            fetchMarketsData(),
            fetchStudiosData(),
        ]);

        return { blogsData, productsData, marketsData, studiosData };
    } catch (error) {
        logError("Error fetching manage blogs data:", error);
    }
}

export const fetchBlogsData = async () => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/manage-blogs/get`, {
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

export const updateBlogData = async (payload) => {
    try {
        const authToken = await getAuthToken();

        const response = await fetch(`${baseUrl}/api/manage-blogs/update`, {
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
    }
};