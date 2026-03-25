import { PayloadSDK } from "@payloadcms/sdk";
import { logError } from "@/utils";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL;
const CORE_API_KEY = process.env.CORE_API_KEY;

// Initialize Payload SDK with auth header
const sdk = new PayloadSDK({
    baseURL: CORE_API_BASE_URL + "/api",
    baseInit: {
        headers: {
            'Authorization': `Bearer ${CORE_API_KEY}`,
        }
    }
});

export const queryProductCollections = async () => {
    try {
        const result = await sdk.find({
            collection: 'product-collections',
            pagination: false, // Return all documents
        });

        return result.docs;
    } catch (error) {
        logError('Error querying productCollections:', error);
        throw error;
    }
}

export const queryProductCollectionBySlug = async (slug) => {
    try {
        const result = await sdk.find({
            collection: 'product-collections',
            where: {
                slug: { equals: slug }
            },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 1,
        });

        return result.docs?.[0] || null;
    } catch (error) {
        logError('Error querying productCollection by slug:', error);
        throw error;
    }
}

export const queryProductsByCollectionIds = async (collections) => {
    try {
        const result = await sdk.find({
            collection: 'products',
            where: {
                collections: { in: collections }
            },
            draft: false,
            locale: "en",
            depth: 1,
        });

        return result;
    } catch (error) {
        logError('Error querying products by collection IDs:', error);
        throw error;
    }
}

export const queryProductsBySlug = async (slug) => {
    try {
        const result = await sdk.find({
            collection: 'products',
            where: {
                slug: { equals: slug }
            },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 1,
        });

        return result.docs?.[0] || null;
    } catch (error) {
        logError('Error querying product by slug:', error);
        throw error;
    }
}