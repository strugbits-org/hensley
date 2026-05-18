import { PayloadSDK } from "@payloadcms/sdk";
import { cache } from "react";
import { logError, sleep, sortByOrderNumber, normalizeProductForDisplay, resolveCoreMediaUrl } from "@/utils";

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL;
const CORE_API_KEY = process.env.CORE_API_KEY;
export const CORE_TENANT_ID = process.env.CORE_TENANT_ID || "";

const retryFetch = async (url, init) => {
    const maxAttempts = 4;
    const baseDelayMs = 500;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(url, init);
            if (response.status >= 500 && response.status < 600 && attempt < maxAttempts) {
                await sleep(baseDelayMs * 2 ** (attempt - 1));
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
            if (attempt >= maxAttempts) break;
            await sleep(baseDelayMs * 2 ** (attempt - 1));
        }
    }
    throw lastError;
};

// Initialize Payload SDK with auth header
export const sdk = new PayloadSDK({
    baseURL: CORE_API_BASE_URL + "/api",
    fetch: retryFetch,
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

const buildCoreApiUrl = (path) => {
    const baseUrl = (CORE_API_BASE_URL || "").replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
};

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
        item.internalUrl ||
        item.lightbox ||
        item.lightboxId ||
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

    const slug = getFirstString(resolved.slug, resolved.urlSlug).replace(/^\/+/, "");
    if (!slug) return "";

    const menuPath = getFirstString(resolved.menuPath).toLowerCase();
    
    // Simplified Hierarchy Rules:
    // 1. Explicit menuPath overrides everything
    // 2. Featured flag redirects to /collections/
    // 3. Everything else defaults to /subcategory/
    let basePath = "/subcategory";

    if (menuPath === "collections") {
         basePath = "/collections";
    } else if (menuPath === "subcategory") {
        basePath = "/subcategory";
    } else if (Boolean(resolved.featured)) {
        basePath = "/collections";
    }

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
        "nestedChildren",
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
        item.lightboxId,
        item.modal,
        item.modalName,
        item.popup,
        item.link?.lightbox,
        item.link?.lightboxId
    );

    const directPath = getFirstString(
        item.url,
        item.href,
        item.path,
        item.slug,
        item.internalUrl,
        item.externalUrl,
        item.link?.url,
        item.link?.href,
        item.link?.internalUrl
    );

    const relationPath = getRelationPath(
        item.page || item.reference || item.doc || item.document || item.link?.page || item.link?.reference
    );

    const collectionPath = getCollectionPath(
        item.productCollection || item.productCollections || item.collection || item.collections || item.category || item.categories,
        normalizePath(getFirstString(item.redirection, item.link?.redirection))
    );

    // Prefer dynamically generated Collection / Relation paths over potentially stale direct text urls if the relationship exists
    const slug = normalizePath(collectionPath || relationPath || directPath);
    const opensNewTab = Boolean(
        item.target === "_blank" ||
        item.openInNewTab ||
        item.newTab ||
        rawType === "external" ||
        /^https?:/i.test(slug)
    );

    let type = rawType || fallbackType;

    if (type === "markets" || title.toUpperCase() === "MARKETS" || lightbox === "markets") {
        type = "markets";
    } else if (type === "tents" || /(^|\b)tents?(\b|$)/i.test(title) || lightbox === "tents") {
        type = "tents";
    } else if (lightbox || type.includes("lightbox") || type.includes("modal")) {
        type = "lightbox";
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
    const imageCandidates = [
        item.image,
        item.mainMedia,
        item.media?.mainMedia,
        category.mainMedia,
        category.media?.mainMedia,
        category.image,
    ];
    const image = imageCandidates.reduce(
        (acc, candidate) => acc || resolveCoreMediaUrl(candidate, "thumbnail"),
        ""
    ) || null;

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
            depth: 2,
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

export const mapStorefrontFooterBranches = (footer = {}) => {
    const formatDisplayDescription = (section, methods, serviceAreaMethod, availabilityMethod) => {
        const descriptionLines = [];
        const sectionTitle = getFirstString(section?.title);
        const sectionDescription = getFirstString(section?.description);

        if (serviceAreaMethod && sectionTitle) {
            descriptionLines.push(sectionTitle);
        } else if (sectionDescription && !/[.!?]$/.test(sectionDescription) && sectionDescription.length <= 40) {
            descriptionLines.push(sectionDescription);
        }

        if (availabilityMethod) {
            const value = getFirstString(availabilityMethod?.value);
            if (value) {
                descriptionLines.push(value);
            }
        }

        methods.forEach((method) => {
            if (method === serviceAreaMethod || method === availabilityMethod) {
                return;
            }

            const value = getFirstString(method?.value);
            const label = getFirstString(method?.label).toLowerCase();

            if (!value) {
                return;
            }

            if (label.includes("address")) {
                const addressSegments = value
                    .split(",")
                    .map((segment) => segment.trim())
                    .filter(Boolean);

                if (addressSegments.length > 1) {
                    descriptionLines.push(addressSegments[0], addressSegments.slice(1).join(", "));
                    return;
                }
            }

            descriptionLines.push(value);
        });

        return descriptionLines.filter(Boolean).join("\n");
    };

    return sortByOrderNumber(
        ensureArray(footer?.sections)
            .filter((section) => section?.sectionType === "contact" && section?.isVisible !== false)
            .map((section) => {
                const methods = ensureArray(section?.contactMethods)
                    .filter((method) => method?.isVisible !== false);
                const serviceAreaMethod = methods.find((method) => getFirstString(method?.label).toLowerCase().includes("service area"));
                const availabilityMethod = methods.find((method) => getFirstString(method?.label).toLowerCase().includes("availability"));

                return {
                    title: getFirstString(serviceAreaMethod?.value) || getFirstString(section?.title),
                    description: formatDisplayDescription(section, methods, serviceAreaMethod, availabilityMethod),
                    orderNumber: section?.orderNumber ?? 0,
                };
            })
            .filter((section) => section.title || section.description)
    );
};

export const queryStorefrontFooter = async ({ channel = "her", key = "default" } = {}) => {
    try {
        if (!CORE_API_BASE_URL) {
            throw new Error("CORE_API_BASE_URL is not configured");
        }

        const query = new URLSearchParams({ channel, key });
        const response = await fetch(buildCoreApiUrl(`/api/footers/storefront?${query.toString()}`), {
            headers: CORE_API_KEY ? { Authorization: `Bearer ${CORE_API_KEY}` } : {},
        });

        if (!response.ok) {
            throw new Error(`Footer request failed with status ${response.status}`);
        }

        const result = await response.json();
        return result?.item || null;
    } catch (error) {
        logError('Error querying storefront footer:', error);
        return null;
    }
};

// Slim query used everywhere subcategories/featured/slug are needed but images
// are not (DAG walks, path generation, lookups). depth: 0 keeps relationship
// fields as ID strings — perfect for traversal, ~200KB total, well under the
// Next.js 10MB data cache ceiling that prior depth-1 queries kept exceeding.
export const queryProductCollections = cache(async () => {
    try {
        const result = await sdk.find({
            collection: 'product-collections',
            pagination: false,
            draft: false,
            locale: "en",
            depth: 0,
        });

        return result.docs;
    } catch (error) {
        logError('Error querying productCollections:', error);
        throw error;
    }
})

// Heavier query restricted to featured collections (small set) — populates
// `media.mainMedia` at depth 1 so the Our Categories section can render images.
// Projection limited to the fields mapProductCollectionToCategoryCard reads.
export const queryFeaturedProductCollections = cache(async () => {
    try {
        const result = await sdk.find({
            collection: 'product-collections',
            where: { featured: { equals: true } },
            pagination: false,
            draft: false,
            locale: "en",
            depth: 1,
            select: {
                name: true,
                slug: true,
                featured: true,
                featuredSettings: true,
                featuredOrderNumber: true,
                orderNumber: true,
                order: true,
                mainMedia: true,
                media: true,
                featuredImage: true,
                heroImage: true,
                image: true,
                cardSubtitle: true,
                subtitle: true,
                shortDescription: true,
                description: true,
                excerpt: true,
                rtl: true,
            },
        });

        return result.docs;
    } catch (error) {
        logError('Error querying featured productCollections:', error);
        return [];
    }
})

export const queryProductSlugs = cache(async () => {
    try {
        const result = await sdk.find({
            collection: 'products',
            pagination: false,
            draft: false,
            locale: 'en',
            depth: 0,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError('Error querying product slugs:', error);
        return [];
    }
})

// Collection page only needs: name/slug for headings, subcategories (with
// name/slug + their own subcategory IDs for DAG traversal), and productOrder
// reduced to ID strings (the ordered IDs feed the paginated products query).
// At depth 2 with no projection this response ballooned to ~23MB — over the
// 10MB Next.js data cache limit. Selecting fields + populating products as
// IDs only keeps the payload tiny so it fits the data cache.
export const queryProductCollectionBySlug = async (slug) => {
    try {
        const result = await sdk.find({
            collection: 'product-collections',
            where: {
                and: [
                    { slug: { equals: slug } },
                    { visible: { not_equals: false } },
                ],
            },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 1,
            select: {
                name: true,
                slug: true,
                subcategories: true,
                productOrder: true,
                parent: true
            },
            populate: {
                'product-collections': { name: true, slug: true, subcategories: true, parent: true },
                products: {},
            },
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

// Homepage best-sellers variant. Drops the heaviest fields (variants[],
// productOptions[], recommendedProducts[], seo) that the homepage card and
// the AddToCart modal's *initial open* don't read. Bundle items + media +
// pricing + additionalInfoSections stay because AddToCart consumes them when
// the user opens the modal from a homepage card. If the modal needs anything
// beyond this set it refetches the full product by ID via queryProductById.
export const queryProductsByCollectionIdsForHome = async (collections) => {
    try {
        const result = await sdk.find({
            collection: 'products',
            where: {
                collections: { in: collections }
            },
            draft: false,
            locale: "en",
            depth: 1,
            select: {
                title: true,
                name: true,
                slug: true,
                sku: true,
                type: true,
                ribbon: true,
                collections: true,
                mainMedia: true,
                mediaItems: true,
                price: true,
                compareAtPrice: true,
                formattedPrice: true,
                description: true,
                additionalInfoSections: true,
                bundleItems: true,
                tentConfig: true,
            },
        });

        return result;
    } catch (error) {
        logError('Error querying products by collection IDs (home):', error);
        throw error;
    }
}

// Field set the PLP grid + AddToCart-from-grid actually need. Same shape
// as the homepage best-sellers variant. ProductCard reads title/sku/type/
// slug/mainMedia/ribbon/collections; AddToCart re-fetches by id when the
// modal opens and needs more.
const PLP_LISTING_PRODUCT_SELECT = {
    title: true,
    name: true,
    slug: true,
    sku: true,
    type: true,
    ribbon: true,
    collections: true,
    mainMedia: true,
    mediaItems: true,
    price: true,
    compareAtPrice: true,
    formattedPrice: true,
    description: true,
    additionalInfoSections: true,
    bundleItems: true,
    tentConfig: true,
};

// Slim paginated variant for /subcategory and /collections PLPs. Trims off
// variants/productOptions/recommendedProducts/seo and other heavy graph
// edges. Same return shape as queryProductsByCollectionIdsPaginated.
export const queryProductsByCollectionIdsPaginatedSlim = async ({ collections = [], limit = 12, skip = 0 } = {}) => {
    try {
        const page = skip > 0 ? Math.floor(skip / limit) + 1 : 1;
        const query = {
            collection: 'products',
            limit,
            page,
            draft: false,
            locale: "en",
            depth: 1,
            select: PLP_LISTING_PRODUCT_SELECT,
        };

        if (collections.length > 0) {
            query.where = { collections: { in: collections } };
        }

        const result = await sdk.find(query);

        return {
            items: result.docs || [],
            hasNext: result.hasNextPage ?? false,
        };
    } catch (error) {
        logError('Error querying products by collection IDs (paginated slim):', error);
        return { items: [], hasNext: false };
    }
};

// Slim by-IDs variant. Used by /subcategory and /collections when the
// collection has an explicit productOrder, so we fetch the configured page
// slice in the configured order.
export const queryProductsByIdsSlim = async (ids = []) => {
    if (!ids || !ids.length) return [];
    try {
        const result = await sdk.find({
            collection: 'products',
            where: { id: { in: ids } },
            pagination: false,
            draft: false,
            locale: 'en',
            depth: 1,
            select: PLP_LISTING_PRODUCT_SELECT,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError('Error querying products by IDs (slim):', error);
        return [];
    }
};

export const queryProductsByCollectionIdsPaginated = async ({ collections = [], limit = 12, skip = 0 } = {}) => {
    try {
        const page = skip > 0 ? Math.floor(skip / limit) + 1 : 1;
        const query = {
            collection: 'products',
            limit,
            page,
            draft: false,
            locale: "en",
            depth: 1,
        };

        if (collections.length > 0) {
            query.where = { collections: { in: collections } };
        }

        const result = await sdk.find(query);

        return {
            items: result.docs || [],
            hasNext: result.hasNextPage ?? false,
        };
    } catch (error) {
        logError('Error querying products by collection IDs (paginated):', error);
        return { items: [], hasNext: false };
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

export const queryProductsByIds = async (ids = []) => {
    if (!ids || !ids.length) return [];
    try {
        const result = await sdk.find({
            collection: 'products',
            where: { id: { in: ids } },
            pagination: false,
            draft: false,
            locale: 'en',
            depth: 1,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError('Error querying products by IDs:', error);
        return [];
    }
};

export const queryAllProducts = async ({ depth = 1 } = {}) => {
    try {
        const result = await sdk.find({
            collection: 'products',
            pagination: false,
            draft: false,
            locale: 'en',
            depth,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError('Error querying all products:', error);
        return [];
    }
};

export const queryProductsFromPayload = async ({ where = {}, limit = 100, skip = 0, depth = 1, sort, select } = {}) => {
    try {
        const page = skip > 0 ? Math.floor(skip / limit) + 1 : 1;
        const result = await sdk.find({
            collection: 'products',
            where,
            limit,
            page,
            draft: false,
            locale: 'en',
            depth,
            ...(sort ? { sort } : {}),
            ...(select ? { select } : {}),
        });
        return {
            docs: ensureArray(result?.docs),
            totalDocs: result?.totalDocs || 0,
            hasNextPage: result?.hasNextPage || false,
        };
    } catch (error) {
        logError('Error querying products:', error);
        return { docs: [], totalDocs: 0, hasNextPage: false };
    }
};

// ──────────────────────────────────────────────────────────────────────
// Payload Media URL helper
// ──────────────────────────────────────────────────────────────────────
//
// The local resolveMediaUrl that used to live here walked media.sizes.* with
// a preference chain. That field no longer exists on the backend (sizes are
// generated on-demand by the CDN transform endpoint), so we now route every
// call through the canonical resolveCoreMediaUrl which handles base-URL
// prefixing, transform-path injection, and size-hint → bucket-width mapping
// in one place.
const resolveMediaUrl = (media, size) => resolveCoreMediaUrl(media, size);

// ──────────────────────────────────────────────────────────────────────
// Normalizers — convert Payload shapes → Wix shapes expected by components
// ──────────────────────────────────────────────────────────────────────

export const normalizePayloadMarketRef = (market) => {
    if (!market || typeof market !== "object") return market;
    return {
        ...market,
        _id: market.id || market._id,
        category: market.title || market.category || "",
        slug: market.slug?.startsWith("/") ? market.slug : `/${market.slug || ""}`,
    };
};

const normalizePayloadStudioRef = (studio) => {
    if (!studio || typeof studio !== "object") return studio;
    return {
        ...studio,
        _id: studio.id || studio._id,
        name: studio.name || "",
    };
};

const normalizePayloadBlogCategoryRef = (cat) => {
    if (!cat || typeof cat !== "object") return cat;
    return {
        ...cat,
        _id: cat.id || cat._id,
        label: cat.name || cat.label || "",
        title: cat.name || cat.title || "",
    };
};

const normalizePayloadProjectCategoryRef = (cat) => {
    if (!cat || typeof cat !== "object") return cat;
    return {
        ...cat,
        _id: cat.id || cat._id,
        title: cat.name || cat.title || "",
    };
};

export const normalizePayloadBlog = (blog) => {
    if (!blog || typeof blog !== "object") return blog;
    const coverImageUrl = resolveMediaUrl(blog.coverImage, "card");
    const author = blog.author && typeof blog.author === "object"
        ? blog.author
        : null;
    const displayName = author?.username || [author?.firstName, author?.lastName].filter(Boolean).join(" ");
    const displayDate = blog.createdAt || blog.updatedAt || "";
    // No `...blog` or `...author` spread: previously the raw Payload doc leaked
    // through (raw content richText body, raw coverImage media doc, _status,
    // tenantId, createdAt/updatedAt, etc.) inflating the server→client payload.
    // The detail page reads richContent via blogRef.richContent — no consumer
    // reads raw fields directly (audit verified).
    return {
        _id: blog.id || blog._id,
        id: blog.id || blog._id,
        slug: blog.slug || "",
        publishDate: displayDate,
        blogRef: {
            title: blog.title || "",
            coverImage: coverImageUrl,
            publishedDate: displayDate,
            excerpt: blog.excerpt || "",
            richContent: blog.content || null,
        },
        author: {
            nickname: displayName || "",
            firstName: author?.firstName || "",
            lastName: author?.lastName || "",
        },
        markets: ensureArray(blog.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(blog.studios).map(normalizePayloadStudioRef),
        blogCategories: ensureArray(blog.blogCategories).map(normalizePayloadBlogCategoryRef),
        storeProducts: ensureArray(blog.storeProducts).map(normalizeProductForDisplay),
        isHidden: blog.isHidden || false,
    };
};

export const normalizePayloadProject = (project) => {
    if (!project || typeof project !== "object") return project;
    const coverImageUrl = resolveMediaUrl(project.coverImage, "tablet");
    const heroImageUrl = resolveMediaUrl(project.heroImage, "tablet");
    // Single pass over galleryImages: previously walked twice (once for URL
    // strings, once for {url, caption} objects), doubling resolveMediaUrl
    // calls per project. We tag each entry with isString so the URL-only and
    // object-only outputs preserve the original semantics: string entries
    // pass through unresolved to galleryImages and are dropped from
    // galleryImageObjects; object entries get resolveMediaUrl'd into both.
    const galleryItems = ensureArray(project.galleryImages).map((item) => {
        if (typeof item === "string") return { isString: true, value: item };
        if (!item) return null;
        const url = resolveMediaUrl(item?.image || item, "tablet");
        return url ? { isString: false, url, caption: item?.caption || "" } : null;
    }).filter(Boolean);
    const galleryImages = galleryItems.map((g) => (g.isString ? g.value : g.url));
    const galleryImageObjects = galleryItems
        .filter((g) => !g.isString)
        .map(({ url, caption }) => ({ url, caption }));
    const excerpt = project.excerpt || (project.description ? project.description.slice(0, 120) + (project.description.length > 120 ? "..." : "") : "");
    const testimonial = project.testimonial || null;
    const meta = project.meta || {};

    // No `...project` spread: previously the raw Payload doc leaked through
    // (raw richText description blob, raw cover/hero media docs, _status,
    // tenantId, createdAt/updatedAt, originalProject, etc.) inflating the
    // server→client payload with fields no consumer reads. The only spread
    // dependency was `noFollowTag`, now mapped explicitly.
    return {
        _id: project.id || project._id,
        id: project.id || project._id,
        slug: project.slug || "",
        publishDate: project.publishDate || project.publishedDate || "",
        eventDate: project.eventDate || "",
        client: project.client || "",
        location: project.location || "",
        excerpt,
        tags: ensureArray(project.tags),
        isFeatured: project.isFeatured || false,
        order: project.order ?? 0,
        noFollowTag: project.noFollowTag || false,
        portfolioRef: {
            title: project.title || "",
            coverImage: { imageInfo: coverImageUrl },
            heroImage: heroImageUrl || coverImageUrl,
            description: project.description || "",
            excerpt,
            slug: project.slug || "",
        },
        testimonial,
        meta: {
            title: meta.title || "",
            description: meta.description || "",
            image: resolveMediaUrl(meta.image, "tablet") || "",
        },
        markets: ensureArray(project.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(project.studios).map(normalizePayloadStudioRef),
        portfolioCategories: ensureArray(project.portfolioCategories).map(normalizePayloadProjectCategoryRef),
        storeProducts: ensureArray(project.storeProducts).map(normalizeProductForDisplay),
        galleryImages,
        galleryImageObjects,
        isHidden: project.isHidden || false,
    };
};

// Homepage-only blog normalizer. Drops content (rich text body), excerpt
// processing, and storeProducts hydration — none of which HensleyNews/NewsCard
// renders. Keeps the blogRef wrapper + author/markets/studios/blogCategories
// because MarketsStudiosTags and the card itself read them.
export const normalizePayloadBlogForHome = (blog) => {
    if (!blog || typeof blog !== "object") return blog;
    const coverImageUrl = resolveMediaUrl(blog.coverImage, "card");
    const author = blog.author && typeof blog.author === "object" ? blog.author : null;
    const displayName = author?.username || [author?.firstName, author?.lastName].filter(Boolean).join(" ");
    const displayDate = blog.publishedDate || blog.createdAt || blog.updatedAt || "";
    return {
        _id: blog.id || blog._id,
        id: blog.id || blog._id,
        slug: blog.slug || "",
        blogRef: {
            title: blog.title || "",
            coverImage: coverImageUrl,
            publishedDate: displayDate,
        },
        author: { nickname: displayName || "" },
        markets: ensureArray(blog.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(blog.studios).map(normalizePayloadStudioRef),
        blogCategories: ensureArray(blog.blogCategories).map(normalizePayloadBlogCategoryRef),
    };
};

// Homepage-only project normalizer. OurProjects only reads
// portfolioRef.{title, slug, coverImage.imageInfo} — everything else (hero,
// gallery, description, testimonial, storeProducts) is detail-page only.
export const normalizePayloadProjectForHome = (project) => {
    if (!project || typeof project !== "object") return project;
    const coverImageUrl = resolveMediaUrl(project.coverImage, "tablet");
    return {
        _id: project.id || project._id,
        id: project.id || project._id,
        slug: project.slug || "",
        order: project.order ?? 0,
        portfolioRef: {
            title: project.title || "",
            slug: project.slug || "",
            coverImage: { imageInfo: coverImageUrl },
        },
    };
};

// Listing-page blog normalizer. Same as the homepage variant but also
// includes blogRef.excerpt because the featured EventHighLight card on
// /blog reads it. Drops content/storeProducts/meta still.
export const normalizePayloadBlogForListing = (blog) => {
    if (!blog || typeof blog !== "object") return blog;
    const coverImageUrl = resolveMediaUrl(blog.coverImage, "card");
    const author = blog.author && typeof blog.author === "object" ? blog.author : null;
    const displayName = author?.username || [author?.firstName, author?.lastName].filter(Boolean).join(" ");
    const displayDate = blog.publishedDate || blog.createdAt || blog.updatedAt || "";
    return {
        _id: blog.id || blog._id,
        id: blog.id || blog._id,
        slug: blog.slug || "",
        blogRef: {
            title: blog.title || "",
            coverImage: coverImageUrl,
            publishedDate: displayDate,
            excerpt: blog.excerpt || "",
        },
        author: { nickname: displayName || "" },
        markets: ensureArray(blog.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(blog.studios).map(normalizePayloadStudioRef),
        blogCategories: ensureArray(blog.blogCategories).map(normalizePayloadBlogCategoryRef),
    };
};

// Listing-page project normalizer. ProjectCard + EventHighLight read
// portfolioRef.{title, coverImage.imageInfo, description}, publishDate,
// markets, studios, portfolioCategories. Drops hero/gallery/testimonial/
// storeProducts/meta hydration.
export const normalizePayloadProjectForListing = (project) => {
    if (!project || typeof project !== "object") return project;
    const coverImageUrl = resolveMediaUrl(project.coverImage, "tablet");
    return {
        _id: project.id || project._id,
        id: project.id || project._id,
        slug: project.slug || "",
        order: project.order ?? 0,
        publishDate: project.publishDate || project.publishedDate || "",
        portfolioRef: {
            title: project.title || "",
            slug: project.slug || "",
            coverImage: { imageInfo: coverImageUrl },
            description: project.description || "",
        },
        markets: ensureArray(project.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(project.studios).map(normalizePayloadStudioRef),
        portfolioCategories: ensureArray(project.portfolioCategories).map(normalizePayloadProjectCategoryRef),
    };
};

export const normalizePayloadBlogCategory = (cat) => {
    if (!cat || typeof cat !== "object") return cat;
    return {
        ...cat,
        _id: cat.id || cat._id,
        label: cat.name || cat.label || "",
        title: cat.name || cat.title || "",
        orderNumber: cat.order ?? 0,
    };
};

export const normalizePayloadProjectCategory = (cat) => {
    if (!cat || typeof cat !== "object") return cat;
    return {
        ...cat,
        _id: cat.id || cat._id,
        title: cat.name || cat.title || "",
        orderNumber: cat.order ?? 0,
    };
};

export const normalizePayloadStudio = (studio) => {
    if (!studio || typeof studio !== "object") return studio;
    return {
        ...studio,
        _id: studio.id || studio._id,
        name: studio.name || "",
        orderNumber: studio.order ?? 0,
    };
};

// ──────────────────────────────────────────────────────────────────────
// Payload SDK queries — Blogs
// ──────────────────────────────────────────────────────────────────────

export const queryBlogs = async ({ where = {}, sort = "-publishedDate", limit, depth = 1, select } = {}) => {
    try {
        const result = await sdk.find({
            collection: "blogs",
            where: { ...where, isHidden: { not_equals: true }, _status: { equals: "published" } },
            sort,
            ...(limit ? { limit } : {}),
            pagination: false,
            draft: false,
            locale: "en",
            depth,
            ...(select ? { select } : {}),
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying blogs:", error);
        return [];
    }
};

export const queryBlogBySlug = async (slug, { depth = 2, select } = {}) => {
    try {
        const result = await sdk.find({
            collection: "blogs",
            where: { slug: { equals: slug }, isHidden: { not_equals: true }, _status: { equals: "published" } },
            limit: 1,
            draft: false,
            locale: "en",
            depth,
            ...(select ? { select } : {}),
        });
        return result?.docs?.[0] || null;
    } catch (error) {
        logError("Error querying blog by slug:", error);
        return null;
    }
};

export const queryBlogCategories = async () => {
    try {
        const result = await sdk.find({
            collection: "blog-categories",
            pagination: false,
            sort: "order",
            draft: false,
            locale: "en",
            depth: 0,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying blog categories:", error);
        return [];
    }
};

// ──────────────────────────────────────────────────────────────────────
// Payload SDK queries — Projects
// ──────────────────────────────────────────────────────────────────────

export const queryProjects = async ({ where = {}, sort = "order", limit, depth = 2, select } = {}) => {
    try {
        const result = await sdk.find({
            collection: "projects",
            where: { ...where, isHidden: { not_equals: true }, _status: { equals: "published" } },
            sort,
            ...(limit ? { limit } : {}),
            pagination: false,
            draft: false,
            locale: "en",
            depth,
            ...(select ? { select } : {}),
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying projects:", error);
        return [];
    }
};

export const queryProjectBySlug = async (slug, { draft = false, depth = 2, select } = {}) => {
    try {
        const whereClause = draft
            ? { slug: { equals: slug } }
            : { slug: { equals: slug }, isHidden: { not_equals: true }, _status: { equals: "published" } };
        const result = await sdk.find({
            collection: "projects",
            where: whereClause,
            limit: 1,
            draft,
            locale: "en",
            depth,
            ...(select ? { select } : {}),
        });
        return result?.docs?.[0] || null;
    } catch (error) {
        logError("Error querying project by slug:", error);
        return null;
    }
};

export const queryProjectCategories = async () => {
    try {
        const result = await sdk.find({
            collection: "project-categories",
            pagination: false,
            sort: "order",
            draft: false,
            locale: "en",
            depth: 0,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying project categories:", error);
        return [];
    }
};

// ──────────────────────────────────────────────────────────────────────
// Payload SDK queries — Studios
// ──────────────────────────────────────────────────────────────────────

export const queryStudios = async () => {
    try {
        const result = await sdk.find({
            collection: "studios",
            pagination: false,
            sort: "order",
            draft: false,
            locale: "en",
            depth: 0,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying studios:", error);
        return [];
    }
};

// ──────────────────────────────────────────────────────────────────────
// Payload SDK queries — Markets (for filter use)
// ──────────────────────────────────────────────────────────────────────

export const queryMarkets = async (options = {}) => {
    try {
        const {
            where,
            limit,
            depth = 0,
            pagination,
            sort = "order",
            draft = false,
            locale = "en",
            select,
        } = options;

        const result = await sdk.find({
            collection: "markets",
            pagination: typeof pagination === "boolean" ? pagination : false,
            sort,
            draft,
            locale,
            depth,
            ...(where ? { where } : {}),
            ...(typeof limit === "number" ? { limit } : {}),
            ...(select ? { select } : {}),
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying markets:", error);
        return [];
    }
};

// ──────────────────────────────────────────────────────────────────────
// Payload SDK queries — Pages
// ──────────────────────────────────────────────────────────────────────

export const queryPageBySlug = async (slug) => {
    try {
        const result = await sdk.find({
            collection: "pages",
            where: { slug: { equals: slug }, _status: { equals: "published" } },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 1,
        });
        return result?.docs?.[0] || null;
    } catch (error) {
        logError("Error querying page by slug:", error);
        return null;
    }
};

// ── Payload Section Queries ──────────────────────────────────────────────────

/**
 * Fetch a single Section document by its key field.
 * Returns null if not found.
 */
export const querySection = async (key) => {
    try {
        const result = await sdk.find({
            collection: 'sections',
            where: { key: { equals: key }, _status: { equals: 'published' } },
            limit: 1,
            draft: false,
            depth: 1,
        });
        return result.docs?.[0] || null;
    } catch (error) {
        logError(`Error querying section "${key}":`, error);
        return null;
    }
};

/**
 * Extract a single field value from a Section document by field name.
 * Returns the appropriate value based on the field type.
 */
export const getSectionField = (section, name) => {
    if (!section?.fields) return null;
    const field = section.fields.find((f) => f.name === name);
    if (!field) return null;
    switch (field.type) {
        case 'text': return field.textValue ?? null;
        case 'longText': return field.longTextValue ?? null;
        case 'richText': return field.richTextValue ?? null;
        case 'number': return field.numberValue ?? null;
        case 'boolean': return field.booleanValue ?? null;
        case 'upload': return field.uploadValue ?? null;
        case 'uploadMany': return field.uploadManyValue ?? null;
        case 'relationship': return field.relationshipValue ?? null;
        case 'json': return field.jsonValue ?? null;
        case 'tags': return field.tagsValue ?? null;
        case 'email': return field.emailValue ?? null;
        case 'date': return field.dateValue ?? null;
        case 'time': return field.timeValue ?? null;
        default: return null;
    }
};

/**
 * Convert a Section document's fields array into a plain key→value object.
 * Returns an empty object if section is null/undefined.
 */
export const sectionToObject = (section) => {
    if (!section?.fields) return {};
    return Object.fromEntries(
        section.fields.map((f) => [f.name, getSectionField(section, f.name)])
    );
};

// ── New First-Class Collection Queries ───────────────────────────────────────

const findPublishedByTenant = async ({ collection, tenantId, extraWhere = {}, sort = "order", limit = 100, depth = 1, select }) => {
    const baseWhere = {
        and: [
            { tenant: { equals: tenantId } },
            { _status: { equals: "published" } },
            ...(Object.keys(extraWhere).length ? [extraWhere] : []),
        ],
    };

    const result = await sdk.find({
        collection,
        where: baseWhere,
        sort,
        limit,
        depth,
        draft: false,
        locale: "en",
        pagination: false,
        ...(select ? { select } : {}),
    });

    return ensureArray(result?.docs);
};

export async function queryHowWeDoIt(tenantId = CORE_TENANT_ID) {
    try {
        return await findPublishedByTenant({
            collection: "how-we-do-it",
            tenantId,
            limit: 10,
            select: {
                title: true,
                content: true,
                image: true,
                order: true,
            },
        });
    } catch (error) {
        logError(`Error querying how-we-do-it: ${error.message}`, error);
        return [];
    }
}

export async function queryDreamTeamMembers(tenantId = CORE_TENANT_ID) {
    try {
        return await findPublishedByTenant({
            collection: "dream-team-members",
            tenantId,
            limit: 100,
            select: {
                name: true,
                jobTitle: true,
                title: true,
                photo: true,
                image: true,
                order: true,
            },
        });
    } catch (error) {
        logError(`Error querying dream-team-members: ${error.message}`, error);
        return [];
    }
}

export async function queryPartnerBrands(tenantId = CORE_TENANT_ID) {
    try {
        return await findPublishedByTenant({
            collection: "partner-brands",
            tenantId,
            limit: 10,
            select: {
                title: true,
                description: true,
                logo: true,
                buttonLabel: true,
                buttonLink: true,
                order: true,
            },
        });
    } catch (error) {
        logError(`Error querying partner-brands: ${error.message}`, error);
        return [];
    }
}

export async function queryTestimonialsByType(tenantId = CORE_TENANT_ID, type = 'client') {
    try {
        return await findPublishedByTenant({
            collection: "testimonials",
            tenantId,
            extraWhere: { type: { equals: type } },
            limit: 20,
            select: {
                name: true,
                authorName: true,
                title: true,
                authorTitle: true,
                feedback: true,
                description: true,
                image: true,
                avatar: true,
                sectionTitle: true,
                type: true,
                order: true,
            },
        });
    } catch (error) {
        logError(`Error querying testimonials (type=${type}): ${error.message}`, error);
        return [];
    }
}

export async function queryInstagramFeedItems(tenantId = CORE_TENANT_ID) {
    try {
        return await findPublishedByTenant({ collection: "instagram-feed-items", tenantId, limit: 12 });
    } catch (error) {
        logError(`Error querying instagram-feed-items: ${error.message}`, error);
        return [];
    }
}

// ── Banner Queries ────────────────────────────────────────────────────────────

/**
 * Fetch the active hero banner for the given tenant.
 * Returns a single banner object shaped for the Banner component:
 * { title, subtitle, backgroundImage, mobileImage, buttonLabel, buttonLink }
 */
export async function queryHeroBanner(tenantId = CORE_TENANT_ID) {
    try {
        const docs = await findPublishedByTenant({
            collection: "hero-banners",
            tenantId,
            limit: 1,
            depth: 1,
        });
        const banner = docs[0];
        if (!banner) return null;
        return {
            title: banner.title ?? null,
            subtitle: banner.subtitle ?? null,
            backgroundImage: banner.backgroundImage ?? null,
            mobileImage: banner.mobileImage ?? null,
            buttonLabel: banner.buttonLabel ?? null,
            buttonLink: banner.buttonLink ?? null,
        };
    } catch (error) {
        logError(`Error querying hero banner: ${error.message}`, error);
        return null;
    }
}

/**
 * Fetch all published product banners for the given tenant.
 * Returns an array shaped for the ProductBanner component:
 * [{ _id, title, image, url, isDesktop, isMobile, orderDesktop, orderMobile }]
 */
export async function queryProductBanners(tenantId = CORE_TENANT_ID) {
    try {
        const docs = await findPublishedByTenant({
            collection: "product-banners",
            tenantId,
            sort: "orderDesktop",
            limit: 50,
            depth: 1,
        });
        return docs.map((banner) => ({
            _id: banner.id,
            title: banner.title,
            image: banner.image ?? null,
            url: banner.url ?? null,
            isDesktop: banner.isDesktop ?? true,
            isMobile: banner.isMobile ?? true,
            orderDesktop: banner.orderDesktop ?? 0,
            orderMobile: banner.orderMobile ?? 0,
        }));
    } catch (error) {
        logError(`Error querying product banners: ${error.message}`, error);
        return [];
    }
}
