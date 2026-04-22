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

    const slug = normalizePath(directPath || relationPath || collectionPath);
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
            draft: false,
            locale: "en",
            depth: 1,
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

// ──────────────────────────────────────────────────────────────────────
// Payload Media URL helper
// ──────────────────────────────────────────────────────────────────────

const resolveMediaUrl = (media) => {
    if (!media) return "";
    if (typeof media === "string") return media;
    return media?.url || media?.sizes?.card?.url || media?.sizes?.thumbnail?.url || media?.thumbnailURL || "";
};

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
    const coverImageUrl = resolveMediaUrl(blog.coverImage);
    return {
        ...blog,
        _id: blog.id || blog._id,
        slug: blog.slug || "",
        publishDate: blog.publishedDate || blog.publishDate || "",
        blogRef: {
            title: blog.title || "",
            coverImage: coverImageUrl,
            publishedDate: blog.publishedDate || "",
            excerpt: blog.excerpt || "",
            richContent: blog.content || null,
        },
        author: blog.author
            ? {
                ...blog.author,
                nickname: blog.author.nickname || blog.author.firstName || "",
                firstName: blog.author.firstName || "",
                lastName: blog.author.lastName || "",
            }
            : { nickname: "", firstName: "", lastName: "" },
        markets: ensureArray(blog.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(blog.studios).map(normalizePayloadStudioRef),
        blogCategories: ensureArray(blog.blogCategories).map(normalizePayloadBlogCategoryRef),
        storeProducts: ensureArray(blog.storeProducts),
        isHidden: blog.isHidden || false,
    };
};

export const normalizePayloadProject = (project) => {
    if (!project || typeof project !== "object") return project;
    const coverImageUrl = resolveMediaUrl(project.coverImage);
    const heroImageUrl = resolveMediaUrl(project.heroImage);
    const galleryImages = ensureArray(project.galleryImages).map((item) => {
        if (typeof item === "string") return item;
        const imgUrl = resolveMediaUrl(item?.image || item);
        return imgUrl;
    }).filter(Boolean);
    const galleryImageObjects = ensureArray(project.galleryImages).map((item) => {
        if (!item || typeof item === "string") return null;
        const imgUrl = resolveMediaUrl(item?.image || item);
        return imgUrl ? { url: imgUrl, caption: item?.caption || "" } : null;
    }).filter(Boolean);
    const excerpt = project.excerpt || (project.description ? project.description.slice(0, 120) + (project.description.length > 120 ? "..." : "") : "");
    const testimonial = project.testimonial || null;
    const meta = project.meta || {};

    return {
        ...project,
        _id: project.id || project._id,
        slug: project.slug || "",
        publishDate: project.publishDate || project.publishedDate || "",
        eventDate: project.eventDate || "",
        client: project.client || "",
        location: project.location || "",
        excerpt,
        tags: ensureArray(project.tags),
        isFeatured: project.isFeatured || false,
        order: project.order ?? 0,
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
            image: resolveMediaUrl(meta.image) || "",
        },
        markets: ensureArray(project.markets).map(normalizePayloadMarketRef),
        studios: ensureArray(project.studios).map(normalizePayloadStudioRef),
        portfolioCategories: ensureArray(project.portfolioCategories).map(normalizePayloadProjectCategoryRef),
        storeProducts: ensureArray(project.storeProducts),
        galleryImages,
        galleryImageObjects,
        isHidden: project.isHidden || false,
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

export const queryBlogs = async ({ where = {}, sort = "-publishedDate", limit, depth = 2 } = {}) => {
    try {
        const result = await sdk.find({
            collection: "blogs",
            where: { ...where, isHidden: { not_equals: true }, _status: { equals: "published" } },
            sort,
            limit: limit || 100,
            pagination: !limit,
            draft: false,
            locale: "en",
            depth,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying blogs:", error);
        return [];
    }
};

export const queryBlogBySlug = async (slug) => {
    try {
        const result = await sdk.find({
            collection: "blogs",
            where: { slug: { equals: slug }, isHidden: { not_equals: true }, _status: { equals: "published" } },
            limit: 1,
            draft: false,
            locale: "en",
            depth: 2,
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

export const queryProjects = async ({ where = {}, sort = "order", limit, depth = 2 } = {}) => {
    try {
        const result = await sdk.find({
            collection: "projects",
            where: { ...where, isHidden: { not_equals: true }, _status: { equals: "published" } },
            sort,
            limit: limit || 100,
            pagination: !limit,
            draft: false,
            locale: "en",
            depth,
        });
        return ensureArray(result?.docs);
    } catch (error) {
        logError("Error querying projects:", error);
        return [];
    }
};

export const queryProjectBySlug = async (slug, { draft = false } = {}) => {
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
            depth: 2,
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

export const queryMarkets = async () => {
    try {
        const result = await sdk.find({
            collection: "markets",
            pagination: false,
            sort: "order",
            draft: false,
            locale: "en",
            depth: 0,
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