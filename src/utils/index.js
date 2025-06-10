import { ApiKeyStrategy, createClient, OAuthStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { members } from "@wix/members";
import { cart, currentCart } from "@wix/ecom";
import { contacts } from "@wix/crm";
import { submissions } from "@wix/forms";
import parse from 'html-react-parser';
import { generateImageURL, generateImageURLAlternate } from "./generateImageURL";

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
                members,
                cart,
                currentCart,
                contacts
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
                members,
                cart,
                currentCart
            },
            auth: OAuthStrategy({ clientId: process.env.CLIENT_ID_WIX }),
        });
        return wixClient;
    } catch (error) {
        logError("Error creating OAuth wix client: ", error);
    }
};

export const createWixClientCart = async (memberTokens) => {
    try {
        const wixClient = createClient({
            modules: { currentCart },
            auth: OAuthStrategy({
                clientId: process.env.CLIENT_ID_WIX,
                tokens: memberTokens,
            }),
        });

        return wixClient;
    } catch (error) {
        logError("Error creating cart wix client: ", error);
    }
};

// -------------------------------------------------------------- WIX Clients END --------------------------------------------------------------

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

export const formatDateNumeric = (d) => {
    const date = new Date(d);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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


export const mapProductSetItems = (data) => {
    try {
        if (!data?.productSetItems || !data?.products) return [];
        const productMap = new Map(data.products.map(product => [product._id, product]));

        const result = data.productSetItems
            .filter(set => productMap.has(set.product))
            .map(set => ({
                _id: productMap.get(set.product)._id,
                product: productMap.get(set.product),
                quantity: set.quantity,
            }));
        return result;
    } catch (error) {
        return [];
    }
};

export const calculateTotalCartQuantity = (lineItems) => {
    return lineItems.reduce((total, currentItem) => total + currentItem.quantity, 0);
}

export const formatDescriptionLines = (items) => {
    return items.reduce((acc, item) => {
        const title = item.name?.translated || item.name?.original;
        const value = item.colorInfo?.translated || item.colorInfo?.original || item.plainText?.translated || item.plainText?.original || item.colorInfo?.code;
        acc.push({ title, value });
        return acc;
    }, []);
}

export function formatLineItemsForQuote(lineItems) {
    const formattedCartData = [];
    let counter = 0;

    for (const item of lineItems || []) {
        const { productName, price, quantity, customTextFields } = item;

        if (!customTextFields?.length) {
            formattedCartData.push({
                id: `${counter++}`,
                name: productName.original,
                description: "—",
                price: price.amount,
                quantity
            });
            continue;
        }

        const isSet = customTextFields.find(f => f.title === "Set");
        const isTentOrCover = customTextFields.find(f => f.title === "TENT TYPE" || f.title === "POOLCOVER");

        if (isSet) {
            const setItems = isSet.value.split("; ");
            formattedCartData.push({
                id: `${counter++}`,
                name: productName.original,
                description: "PRODUCT SET",
                price: 0,
                quantity: 1
            });

            for (const setItem of setItems) {
                const [setName, size, setPrice, setQuantity] = setItem.split("~").map(v => v.trim());
                const description = size && size !== "—" ? `${size} | SET OF ${name}` : `SET OF ${name}`;
                const existing = formattedCartData.find(i => i.name === `${setName} - ` && i.description === description);

                if (existing) {
                    existing.quantity += parseInt(setQuantity, 10);
                } else {
                    formattedCartData.push({
                        id: `${counter++}`,
                        name: `${setName} - `,
                        description,
                        price: parseFloat(setPrice),
                        quantity: parseInt(setQuantity, 10)
                    });
                }
            }
        }

        if (isTentOrCover) {
            formattedCartData.push({
                id: `${counter++}`,
                name: productName.original,
                description: generateDescriptionForQuote(customTextFields, isTentOrCover.title === "POOLCOVER"),
                price: price.amount,
                quantity
            });
        }
    }

    return formattedCartData;
}

function generateDescriptionForQuote(customTextFields, poolCover) {
    const fields = customTextFields || [];

    const imageField = fields.find(f => f.title === "RELEVENT IMAGES");
    const images = imageField?.value?.split("~~") || [];

    const descriptionLines = fields
        .filter(f => f.title !== "POOLCOVER" && f.title !== "RELEVENT IMAGES")
        .map(f => `${f.title}: ${f.value || "Not provided"}`);

    if (poolCover && images.length > 0) {
        const imageUrls = images.map(url =>
            generateImageURL({ wix_url: url }) || generateImageURLAlternate({ wix_url: url })
        );
        descriptionLines.push("RELEVANT IMAGES:", ...imageUrls);
    }

    return descriptionLines.join("\n");
}

export function isValidPassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()~<>?,./;:{}[\]|\\])[A-Za-z\d!@#$%^&*()~<>?,./;:{}[\]|\\]{6,}$/;
    return passwordRegex.test(password);
}

export function isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}


export const formatDateForQuote = (d) => {
    const date = new Date(d);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
        if (n % 10 === 1 && n % 100 !== 11) return 'st';
        if (n % 10 === 2 && n % 100 !== 12) return 'nd';
        if (n % 10 === 3 && n % 100 !== 13) return 'rd';
        return 'th';
    };

    return `${month} ${day}${getOrdinal(day)}, ${year}`;
}
