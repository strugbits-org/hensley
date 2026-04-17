import { PayloadSDK } from "@payloadcms/sdk";
import { logError, sortByOrderNumber } from "@/utils";

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

const ensureArray = (value) => Array.isArray(value) ? value : [];
const toArray = (value) => Array.isArray(value)
    ? value
    : Array.isArray(value?.docs)
        ? value.docs
        : Array.isArray(value?.items)
            ? value.items
            : [];

const getFirstString = (...values) => {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
};

const looksLikeMenuItem = (item) => {
    if (!item || typeof item !== "object") return false;

    return Boolean(
        item.title ||
        item.label ||
        item.name ||
        item.slug ||
        item.url ||
        item.href ||
        item.lightbox ||
        item.link ||
        item.collection ||
        item.productCollection ||
        item.reference ||
        item.page ||
        toArray(item.children).length ||
        toArray(item.items).length ||
        toArray(item.menuItems).length
    );
};

const normalizePath = (value) => {
    if (!value || typeof value !== "string") return "";

    const trimmed = value.trim();

    if (!trimmed) return "";
    if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) return trimmed;

    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const unwrapRelationshipValue = (value) => {
    if (!value) return null;

    if (Array.isArray(value)) {
        return unwrapRelationshipValue(value[0]);
    }

    if (Array.isArray(value?.docs)) {
        return unwrapRelationshipValue(value.docs[0]);
    }

    if (Array.isArray(value?.items)) {
        return unwrapRelationshipValue(value.items[0]);
    }

    if (typeof value === "object" && value?.relationTo && "value" in value) {
        return unwrapRelationshipValue(value.value);
    }

    return value;
};

const getCollectionPath = (collection, preferredBase = "") => {
    const resolved = unwrapRelationshipValue(collection);

    if (!resolved || typeof resolved !== "object") return "";

    const normalizedPreferredBase = preferredBase === "/collections" || preferredBase === "/subcategory"
        ? preferredBase
        : "";
    const rawRelationTo = getFirstString(collection?.relationTo, resolved?.relationTo).toLowerCase();
    const breadcrumbUrl = Array.isArray(resolved?.breadcrumbs)
        ? resolved.breadcrumbs[resolved.breadcrumbs.length - 1]?.url
        : "";
    const breadcrumbSuggestsCollection = breadcrumbUrl.includes("/collections/") || breadcrumbUrl.includes("/subcategory/");
    const hasCollectionSignals = Boolean(
        rawRelationTo === "product-collections" ||
        resolved?.hierarchyLevel !== undefined ||
        resolved?.level !== undefined ||
        resolved?.depth !== undefined ||
        resolved?.parent ||
        resolved?.children ||
        breadcrumbSuggestsCollection ||
        normalizedPreferredBase
    );

    if (!hasCollectionSignals) return "";

    const slug = getFirstString(resolved.slug, resolved.urlSlug).replace(/^\/+/, "");
    if (!slug) return "";

    const directPath = normalizePath(
        getFirstString(resolved.url, resolved.href, resolved.path, resolved.uri, breadcrumbUrl)
    );

    if (directPath && (directPath.includes("/collections/") || directPath.includes("/subcategory/"))) {
        return directPath;
    }

    const parentCollection = unwrapRelationshipValue(resolved.parent);
    const rawLevel = Number(resolved.hierarchyLevel ?? resolved.level ?? resolved.depth);
    const hierarchyLevel = Number.isFinite(rawLevel) ? rawLevel : (parentCollection ? 2 : 0);
    const isTopLevel = !parentCollection && hierarchyLevel <= 1;
    const basePath = (resolved?.hierarchyLevel !== undefined || resolved?.level !== undefined || resolved?.depth !== undefined || parentCollection)
        ? (isTopLevel ? "/collections" : "/subcategory")
        : (normalizedPreferredBase || "/subcategory");

    return `${basePath}/${slug}`;
};

const getRelationPath = (value) => {
    if (!value) return "";

    if (typeof value === "string") return normalizePath(value);

    const resolved = unwrapRelationshipValue(value);
    if (!resolved || typeof resolved !== "object") return "";

    const collectionPath = getCollectionPath(resolved);
    if (collectionPath) return collectionPath;

    const breadcrumbUrl = Array.isArray(resolved?.breadcrumbs)
        ? resolved.breadcrumbs[resolved.breadcrumbs.length - 1]?.url
        : "";

    return normalizePath(
        getFirstString(
            resolved.url,
            resolved.href,
            resolved.path,
            resolved.slug,
            resolved.uri,
            breadcrumbUrl
        )
    );
};

const getMenuCandidates = (entry = {}) => {
    const preferredKeys = [
        "items",
        "menuItems",
        "links",
        "navigationItems",
        "entries",
        "children",
        "subItems",
        "childItems",
        "subMenuItems",
        "subMenu",
        "submenu"
    ];

    for (const key of preferredKeys) {
        const candidate = toArray(entry?.[key]);
        if (candidate.length && candidate.some(looksLikeMenuItem)) {
            return candidate;
        }
    }

    for (const value of Object.values(entry || {})) {
        const candidate = toArray(value);
        if (candidate.length && candidate.some(looksLikeMenuItem)) {
            return candidate;
        }
    }

    return [];
};

const flattenTextValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.map(flattenTextValue).join(" ");
    if (typeof value === "object") {
        return [value.title, value.name, value.label, value.slug]
            .map(flattenTextValue)
            .filter(Boolean)
            .join(" ");
    }
    return String(value);
};

const isEnabledFlag = (value, fallback = true) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
        return !["false", "0", "disabled", "inactive"].includes(value.toLowerCase());
    }
    return fallback;
};

const resolveMenuItemMeta = (item = {}, fallbackType = "slug") => {
    const title = getFirstString(
        item.title,
        item.label,
        item.name,
        item.text,
        item.linkLabel,
        item.navigationLabel,
        item.link?.label,
        item.link?.title
    );

    const rawType = getFirstString(
        item.type,
        item.linkType,
        item.action,
        item.kind,
        item.variant,
        item.blockType,
        item.link?.type
    ).toLowerCase();

    const lightbox = getFirstString(
        item.lightbox,
        item.lightBox,
        item.modal,
        item.modalName,
        item.popup,
        item.link?.lightbox
    );

    const directPath = getFirstString(
        item.url,
        item.href,
        item.path,
        item.slug,
        item.externalUrl,
        item.link?.url,
        item.link?.href
    );

    const relationPath = getRelationPath(
        item.page || item.reference || item.doc || item.document || item.link?.page || item.link?.reference
    );

    const collectionPath = getCollectionPath(
        item.productCollection || item.productCollections || item.collection || item.collections || item.category || item.categories,
        normalizePath(getFirstString(item.redirection, item.link?.redirection))
    );

    const slug = normalizePath(directPath || relationPath || collectionPath);
    const opensNewTab = Boolean(
        item.target === "_blank" ||
        item.openInNewTab ||
        item.newTab ||
        rawType === "external" ||
        /^https?:/i.test(slug)
    );

    let type = rawType || fallbackType;

    if (lightbox || type.includes("lightbox") || type.includes("modal")) {
        type = "lightbox";
    } else if (type === "markets" || title.toUpperCase() === "MARKETS") {
        type = "markets";
    } else if (type === "tents" || title.toUpperCase() === "TENTS") {
        type = "tents";
    } else if (type.includes("external") || /^https?:/i.test(slug)) {
        type = "external";
    } else if (type.includes("sub")) {
        type = "submenu";
    } else {
        type = "slug";
    }

    return {
        title,
        type,
        slug,
        href: slug,
        target: opensNewTab ? "_blank" : undefined,
        lightbox,
    };
};

const normalizeMegaMenuItem = (item = {}, parentId, index) => {
    const meta = resolveMenuItemMeta(item);
    const relatedCollection = unwrapRelationshipValue(
        item.category || item.productCollection || item.productCollections || item.collection || item.collections
    );
    const category = typeof relatedCollection === "object" && relatedCollection ? relatedCollection : {};
    const image = item.image?.url || item.image || item.mainMedia?.url || item.mainMedia || item.media?.mainMedia?.url || item.media?.mainMedia || category.mainMedia?.url || category.mainMedia || category.media?.mainMedia?.url || category.media?.mainMedia || category.image?.url || category.image || null;

    return {
        _id: item.id || item._id || `${parentId}-nested-${index}`,
        title: meta.title,
        type: meta.type,
        slug: meta.slug,
        href: meta.href,
        target: meta.target,
        lightbox: meta.lightbox,
        orderNumber: item.orderNumber ?? item.order ?? item.sortOrder ?? index,
        redirection: normalizePath(getFirstString(item.redirection)),
        category: {
            ...category,
            slug: getFirstString(category.slug).replace(/^\//, ""),
            mainMedia: image,
        },
        collection: {
            ...category,
            slug: getFirstString(category.slug).replace(/^\//, ""),
            mainMedia: image,
        },
    };
};

const normalizeSubMenuItem = (item = {}, parent, index) => {
    const nestedItems = sortByOrderNumber(
        getMenuCandidates(item).map((child, childIndex) =>
            normalizeMegaMenuItem(child, item.id || item._id || `${parent._id}-sub-${index}`, childIndex)
        )
    );

    const meta = resolveMenuItemMeta(item, nestedItems.length ? "submenu" : "slug");

    return {
        _id: item.id || item._id || `${parent._id}-sub-${index}`,
        title: meta.title,
        type: meta.type === "slug" && nestedItems.length ? "submenu" : meta.type,
        slug: meta.slug,
        href: meta.href,
        target: meta.target,
        lightbox: meta.lightbox,
        orderNumber: item.orderNumber ?? item.order ?? item.sortOrder ?? index,
        orderMobile: item.orderMobile ?? item.mobileOrder ?? item.orderNumber ?? item.order ?? index,
        useSlugForMobile: Boolean(item.useSlugForMobile),
        Header_menuItems: [parent],
        data: nestedItems,
        children: nestedItems,
    };
};

const pickActiveHeaderMenu = (docs = []) => {
    const menus = ensureArray(docs);

    const rankedMenus = menus
        .map((menu, index) => {
            const location = getFirstString(menu.location, menu.menuLocation, menu.placement, menu.region).toLowerCase();
            const siteText = [
                menu.site,
                menu.brand,
                menu.client,
                menu.business,
                menu.tenant,
                menu.organization,
                menu.title,
                menu.name,
                menu.slug,
            ]
                .map(flattenTextValue)
                .join(" ")
                .toLowerCase();

            const isHeader = !location || location === "header" || location.includes("header");
            const isActive = isEnabledFlag(menu.isActive ?? menu.active ?? menu.enabled ?? menu.published, true);
            const isHensley = siteText.includes("hensley");

            return {
                menu,
                score: (isHeader ? 4 : 0) + (isActive ? 2 : 0) + (isHensley ? 1 : 0) - (index / 1000),
            };
        })
        .sort((a, b) => b.score - a.score);

    return rankedMenus[0]?.menu || null;
};

const normalizeHeaderMenu = (menuDoc = {}) => {
    const topLevelItems = sortByOrderNumber(
        getMenuCandidates(menuDoc).map((item, index) => {
            const meta = resolveMenuItemMeta(item, getMenuCandidates(item).length ? "submenu" : "slug");

            const parent = {
                _id: item.id || item._id || `menu-${index}`,
                title: (meta.title || "").toUpperCase(),
                type: meta.type,
                slug: meta.slug,
                href: meta.href,
                target: meta.target,
                lightbox: meta.lightbox,
                orderNumber: item.orderNumber ?? item.order ?? item.sortOrder ?? index,
                orderMobile: item.orderMobile ?? item.mobileOrder ?? item.orderNumber ?? item.order ?? index,
            };

            const children = sortByOrderNumber(
                getMenuCandidates(item).map((child, childIndex) =>
                    normalizeSubMenuItem(child, parent, childIndex)
                )
            );

            return {
                ...parent,
                children,
            };
        })
    );

    const headerSubMenu = topLevelItems.flatMap((item) => item.children || []);
    const headerMegaMenu = headerSubMenu.flatMap((subItem) =>
        (subItem.data || []).map((nestedItem) => ({
            ...nestedItem,
            HeaderSubMenu_categories: [{ _id: subItem._id, title: subItem.title }],
        }))
    );

    return {
        header: topLevelItems,
        headerSubMenu,
        headerMegaMenu,
        menuDocumentId: menuDoc.id || menuDoc._id || null,
        menuSource: "payload",
    };
};

export const queryActiveHeaderMenu = async () => {
    try {
        const result = await sdk.find({
            collection: 'menus',
            pagination: false,
            draft: false,
            locale: "en",
            depth: 6,
            limit: 100,
        });

        const activeHeaderMenu = pickActiveHeaderMenu(result?.docs || []);

        if (!activeHeaderMenu) {
            return {
                header: [],
                headerSubMenu: [],
                headerMegaMenu: [],
                menuSource: "payload",
            };
        }

        return normalizeHeaderMenu(activeHeaderMenu);
    } catch (error) {
        logError('Error querying active header menu:', error);
        return {
            header: [],
            headerSubMenu: [],
            headerMegaMenu: [],
            menuSource: "payload",
        };
    }
};

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
            depth: 2, // Increased to populate bundleItems.product
        });

        return result.docs?.[0] || null;
    } catch (error) {
        logError('Error querying product by slug:', error);
        throw error;
    }
}

export const queryProductById = async (id) => {
    try {
        const result = await sdk.find({
            collection: 'products',
            where: {
                id: { equals: id }
            },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 2, // Populate bundleItems.product
        });

        return result.docs?.[0] || null;
    } catch (error) {
        logError('Error querying product by ID:', error);
        return null;
    }
}