import { ApiKeyStrategy, createClient, OAuthStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { submissions } from "@wix/forms";
import parse from 'html-react-parser';

const isDebugMode = process.env.DEBUG_LOGS === "1";

export const logError = (...args) => {
    if (isDebugMode) console.error(...args);
};

export const createWixClient = async () => {
    try {
        const wixClient = createClient({
            modules: {
                collections,
                items,
                submissions,
            },
            auth: ApiKeyStrategy({
                siteId: process.env.SITE_ID_WIX,
                apiKey: process.env.API_KEY_WIX,
            })
        });
        return wixClient;
    } catch (error) {
        logError("Error creating wix client: ", error);
    }
};

export const createWixClientOAuth = async () => {
    try {
        const wixClient = createClient({
            modules: {
                collections,
                items,
                submissions,
            },
            auth: OAuthStrategy({ clientId: process.env.CLIENT_ID_WIX }),
        });
        return wixClient;
    } catch (error) {
        logError("Error creating wix client: ", error);
    }
};

export const sortByOrderNumber = (array, options = {}) => {
    const {
        ascending = true,
        nullsLast = true,
        key = "orderNumber",
        fallbackSort = null
    } = options;

    return [...array].sort((a, b) => {
        const orderA = a[key];
        const orderB = b[key];

        const aHasOrder = orderA !== undefined && orderA !== null;
        const bHasOrder = orderB !== undefined && orderB !== null;

        if (!aHasOrder && !bHasOrder) {
            return fallbackSort ? fallbackSort(a, b) : 0;
        }

        if (!aHasOrder) return nullsLast ? 1 : -1;
        if (!bHasOrder) return nullsLast ? -1 : 1;

        const compareValue = orderA - orderB;
        return ascending ? compareValue : -compareValue;
    });
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const insertBreaks = (str, interval, onlyFirst = false) => {
    if (onlyFirst) {
        return parse(str.substring(0, interval) + '<br/>' + str.substring(interval));
    } else {
        return parse(str.replace(new RegExp(`(.{${interval}})`, 'g'), '$1<br/>'));
    }
}

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

export const findSortIndexByCategory = (data, categoryId) => {
    const sortMapping = {
        'Highlights': 'highlightSubCategoryIndex',
        'Premium': 'premiumSubCategoryIndex',
        'Main': 'categorySortIndex',
        'L1': 'l1SubCategoryIndex',
        'L2': 'l2SubCategoryIndex'
    }
    const category = data?.find(item => item.collections === categoryId);    
    const sortIndex = category?.sortTitle?.[0];
    return sortIndex ? sortMapping[sortIndex] : null;
};

export const formatTotalPrice = (price) => {
    return '$' + price.toFixed(2);
}