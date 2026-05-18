import parse from 'html-react-parser';
import { generateImageURL, generateImageURLAlternate, generateCoreImageURL } from "./generateImageURL";
import * as cheerio from "cheerio";

const isDebugMode = process.env.DEBUG_LOGS === "1";
const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || process.env.NEXT_PUBLIC_CORE_API_BASE_URL || "";

export const logError = (...args) => {
    if (isDebugMode) console.error(...args);
};


// Plain Mongo ObjectId (24 hex) or UUID v4 (36 chars with hyphens). These show
// up when a Payload upload field is queried at depth 0 — the field collapses to
// the related doc's ID. Treat them as "no URL" so we don't render the bare ID
// as a relative path like http://localhost:3000/<id>.
const looksLikeBareId = (value) =>
    typeof value === "string" &&
    !value.includes("/") &&
    !value.includes(":") &&
    !value.includes(".") &&
    (/^[a-f0-9]{24}$/i.test(value) || /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value));

const prefixCoreUrl = (path) => {
    if (!path || typeof path !== "string") return path || "";
    if (looksLikeBareId(path)) return "";
    if (path.startsWith("/api/media/") && CORE_API_BASE_URL) {
        return `${CORE_API_BASE_URL.replace(/\/$/, "")}${path}`;
    }
    return path;
};

// Legacy size-hint strings (used at ~30 call sites today). Map them to bucket
// widths so existing callers keep producing reasonable URLs without changes.
// Hints bias upward intentionally — the previous implementation always
// preferred the largest available size variant ("tablet" first) to avoid
// cropping artifacts in product imagery, so we preserve that bias.
const LEGACY_HINT_TO_OPTS = {
    thumbnail: { w: 512 },
    card:      { w: 1024 },
    tablet:    { w: 1920 },
};

const normalizeCoreImageOpts = (input) => {
    if (!input) return {};
    if (typeof input === "string") return LEGACY_HINT_TO_OPTS[input] || {};
    if (typeof input === "object") return input;
    return {};
};

const isUsableMediaUrl = (value) =>
    typeof value === "string" && value.length > 0 && value !== "null" && !value.endsWith("/null");

/**
 * Resolve a media value coming from Payload (object or string) to a CDN URL.
 *
 * The second argument controls how the URL is sized for the render slot:
 * - A string hint ("thumbnail" | "card" | "tablet") — kept for backwards
 *   compatibility with existing call sites. Maps to a bucket width.
 * - An options object ({ w, h, q, f, fit, al, original }) — preferred for new
 *   code. Forwarded to generateCoreImageURL so the CDN serves the exact size.
 * - Omitted — returns the original URL with no query params.
 *
 * Non-image media (videos, PDFs, Wix legacy URLs, /api/media/file/* paths)
 * pass through unchanged regardless of the second argument.
 */
export const resolveCoreMediaUrl = (media, sizeOrOpts) => {
    if (!media) return "";
    if (typeof media === "string") {
        const base = prefixCoreUrl(media);
        return generateCoreImageURL({ url: base, ...normalizeCoreImageOpts(sizeOrOpts) });
    }
    if (Array.isArray(media)) return resolveCoreMediaUrl(media[0], sizeOrOpts);
    if (typeof media !== "object") return "";

    // Unwrap nested shapes first
    if (media.mainMedia) return resolveCoreMediaUrl(media.mainMedia, sizeOrOpts);
    if (media.media)     return resolveCoreMediaUrl(media.media, sizeOrOpts);

    // Fall back to the original url / legacy fields
    let candidate = media.url || media.src || media.thumbnailURL || "";

    // Guard against assets that stored a literal "null" in `url` — fall through
    // to thumbnailURL or a constructed /api/media/file/<filename> path instead.
    if (!isUsableMediaUrl(candidate)) {
        candidate = isUsableMediaUrl(media.thumbnailURL)
            ? media.thumbnailURL
            : (media.filename ? `/api/media/file/${media.filename}` : "");
    }

    if (!candidate) return "";
    if (typeof candidate !== "string") return resolveCoreMediaUrl(candidate, sizeOrOpts);

    const base = prefixCoreUrl(candidate);

    // Skip transform params for non-rasterable media (videos, documents, SVGs).
    // The Media collection sets mediaType on the backend ('image' | 'video' |
    // 'document'); when present, trust it. Otherwise sniff the filename.
    const mediaType = media.mediaType;
    const mimeType = media.mimeType;
    const isNonImage =
        mediaType === "video" ||
        mediaType === "document" ||
        (typeof mimeType === "string" && (mimeType.startsWith("video/") || mimeType === "image/svg+xml" || mimeType === "application/pdf")) ||
        /\.svg($|\?)/i.test(base) ||
        /\.(mp4|webm|mov|m4v|ogv|pdf)($|\?)/i.test(base);

    if (isNonImage) return base;

    return generateCoreImageURL({ url: base, ...normalizeCoreImageOpts(sizeOrOpts) });
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

export const formatDateNumeric = (d) => {
    const date = new Date(d);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export const formatTotalPrice = (price) => {
    return '$' + (parseFloat(price) || 0).toFixed(2);
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
    const totalQuantity = lineItems.reduce((total, currentItem) => {
        // New format: setItems array
        if (currentItem.itemType === "set" || (Array.isArray(currentItem.setItems) && currentItem.setItems.length > 0)) {
            const setQuantity = (currentItem.setItems || []).reduce((acc, si) => {
                return acc + (parseInt(si.quantity, 10) || 1);
            }, 0);
            return total + setQuantity;
        }

        const descriptionLines = formatDescriptionLines(currentItem.customTextFields || currentItem.customTextFieldValues || []);
        const productCollection = descriptionLines.find(x => x.title === "Set")?.value;

        if (!productCollection) return total + currentItem.quantity;
        const collectionQuantity = productCollection.split('; ').reduce((acc, item) => {
            const [, , , quantity] = item.split('~');
            return acc + parseInt(quantity, 10);
        }, 0);

        return total + collectionQuantity;
    }, 0);
    return totalQuantity;
};

export const calculateCartTotalPrice = (lineItems) => {
    const totalPrice = lineItems.reduce((total, currentItem) => {
        // New format: setItems array
        if (currentItem.itemType === "set" || (Array.isArray(currentItem.setItems) && currentItem.setItems.length > 0)) {
            const setTotal = (currentItem.setItems || []).reduce((acc, si) => {
                return acc + (parseFloat(si.unitPrice || 0) * (parseInt(si.quantity, 10) || 1));
            }, 0);
            return total + setTotal;
        }

        const descriptionLines = formatDescriptionLines(currentItem.customTextFields || currentItem.customTextFieldValues || []);
        const productCollection = descriptionLines.find(x => x.title === "Set")?.value;

        if (!productCollection) {
            return total + ((currentItem.price || currentItem.unitPrice || 0) * currentItem.quantity);
        }

        const collectionTotalPrice = productCollection.split('; ').reduce((acc, item) => {
            const [, , price, quantity] = item.split('~');
            return acc + (parseFloat(price) * parseInt(quantity, 10));
        }, 0);
        return total + collectionTotalPrice;
    }, 0);

    return totalPrice;
};


export const formatDescriptionLines = (items = []) =>
    items.map(({ title, value }) => ({ title, value }));

export function formatLineItemsForQuote(lineItems) {
    const formattedCartData = [];
    let counter = 0;

    for (const item of lineItems || []) {
        const name = item.name || '';
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const rawDescriptionLines = item.customTextFieldValues || item.customTextFields || [];
        const formattedDescriptionLines = formatDescriptionLines(rawDescriptionLines);
        const productCollection = formattedDescriptionLines.find(x => x.title === "Set")?.value;
        const isTentOrCover = item.itemType === "tent" || item.itemType === "pool_cover" || formattedDescriptionLines.find(x => x.title === "TENT TYPE" || x.title === "POOLCOVER")?.value;

        if (!productCollection && !isTentOrCover) {
            formattedCartData.push({ id: `${counter++}`, name, description: "—", price, quantity });
            continue;
        }

        if (productCollection) {
            const setItems = productCollection.split("; ");
            formattedCartData.push({ id: `${counter++}`, name, description: "PRODUCT SET", price: 0, quantity: 1 });

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
                name,
                description: generateDescriptionForQuote(formattedDescriptionLines, isTentOrCover),
                price,
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

export const getAdditionalInfoSection = (sections, title) => {
    const html = richTextToHTML(sections.find(item => item.title.toUpperCase() === title)?.description);
    if (!html) return "";

    const $ = cheerio.load(html);

    $("strong").each((_, el) => {
        $(el).after("<br />");
    });

    const cleaned = $("body").html()
        ?.replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />")
        .trim();

    return parse(cleaned) || "";
};

const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const applyLexicalTextFormatting = (value = "", format = 0) => {
    let formattedValue = value;

    if (format & 1) formattedValue = `<strong>${formattedValue}</strong>`;
    if (format & 2) formattedValue = `<em>${formattedValue}</em>`;
    if (format & 4) formattedValue = `<s>${formattedValue}</s>`;
    if (format & 8) formattedValue = `<u>${formattedValue}</u>`;
    if (format & 16) formattedValue = `<code>${formattedValue}</code>`;

    return formattedValue;
};

const renderLexicalNodeToHTML = (node) => {
    if (!node || typeof node !== "object") return "";

    const childrenHTML = Array.isArray(node.children)
        ? node.children.map(renderLexicalNodeToHTML).join("")
        : "";

    switch (node.type) {
        case "root":
            return childrenHTML;
        case "paragraph":
            return childrenHTML ? `<p>${childrenHTML}</p>` : "";
        case "text":
            return applyLexicalTextFormatting(escapeHtml(node.text || ""), node.format || 0);
        case "linebreak":
            return "<br />";
        case "list": {
            const listTag = node.listType === "number" ? "ol" : "ul";
            return `<${listTag}>${childrenHTML}</${listTag}>`;
        }
        case "listitem":
            return `<li>${childrenHTML}</li>`;
        case "quote":
            return `<blockquote>${childrenHTML}</blockquote>`;
        case "heading": {
            const headingLevel = Math.min(Math.max(node.tag?.replace("h", "") || 2, 1), 6);
            return `<h${headingLevel}>${childrenHTML}</h${headingLevel}>`;
        }
        default:
            return childrenHTML;
    }
};

const extractLexicalNodeText = (node) => {
    if (!node || typeof node !== "object") return "";

    if (node.type === "text") return node.text || "";
    if (node.type === "linebreak") return "\n";

    const childrenText = Array.isArray(node.children)
        ? node.children.map(extractLexicalNodeText).join("")
        : "";

    if (["paragraph", "listitem", "quote", "heading"].includes(node.type)) {
        return `${childrenText}\n`;
    }

    return childrenText;
};

export const richTextToHTML = (content) => {
    if (!content) return "";
    if (typeof content === "string") return content;

    if (content?.root?.type === "root") {
        return renderLexicalNodeToHTML(content.root);
    }

    return "";
};

export const richTextToPlainText = (content) => {
    if (!content) return "";

    if (content?.root?.type === "root") {
        return extractLexicalNodeText(content.root)
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    if (typeof content === "string") return content.trim();

    return "";
};

const normalizeAdditionalInfoSections = (sections = []) => {
    if (!Array.isArray(sections)) return [];

    return sections.map((section) => ({
        ...section,
        html: richTextToHTML(section?.description),
        text: richTextToPlainText(section?.description),
    }));
};

// Breadcrumbs follow the simplified Home › Category › Product shape — we just
// pick one representative collection (the first in the product's list) and
// emit a single crumb. With multi-parent hierarchy, walking "up" is ambiguous.
const buildCollectionBreadcrumbs = (collections = []) => {
    if (!Array.isArray(collections) || collections.length === 0) return [];
    const primary = collections.find(Boolean);
    if (!primary) return [];
    return [
        {
            id: primary.id || primary._id,
            name: primary.name,
            slug: primary.slug,
        },
    ];
};

export const normalizeProductForDisplay = (product = {}) => {
    const title = product?.name || product?.title || "";
    const id = product?._id || product?.id || "";
    const price = Number(product?.price ?? 0) || 0;
    const compareAtPrice = Number(product?.compareAtPrice ?? 0) || 0;
    const additionalInfoSections = normalizeAdditionalInfoSections(product?.additionalInfoSections || []);
    const descriptionHtml = richTextToHTML(product?.description);
    const descriptionText = richTextToPlainText(product?.description);
    const rawMediaItems = Array.isArray(product?.mediaItems) ? product.mediaItems : [];

    const mediaItems = rawMediaItems
        .map((item, index) => ({
            id: item?.id || `${id || title}-media-${index}`,
            src: resolveCoreMediaUrl(item, "tablet"),
            alt: item?.alt || title || `Product image ${index + 1}`,
        }))
        .filter((item) => item.src);

    // Prepend mainMedia as the first gallery slide when it is not already present
    const mainMediaUrl = resolveCoreMediaUrl(product?.mainMedia, "tablet");
    const mainMediaAlt = product?.mainMedia?.alt || title;

    if (mainMediaUrl && !mediaItems.some((item) => item.src === mainMediaUrl)) {
        mediaItems.unshift({
            id: product?.mainMedia?.id || `${id || title}-main-media`,
            src: mainMediaUrl,
            alt: mainMediaAlt,
        });
    }

    return {
        ...product,
        _id: id,
        id,
        name: title,
        title,
        price,
        compareAtPrice: compareAtPrice || null,
        formattedPrice: product?.formattedPrice || formatTotalPrice(price),
        formattedCompareAtPrice: compareAtPrice ? formatTotalPrice(compareAtPrice) : "",
        descriptionHtml,
        descriptionText,
        additionalInfoSections,
        size: additionalInfoSections.find((section) => section?.title === "Size")?.text || "—",
        mainMedia: mainMediaUrl,
        mainMediaUrl,
        mediaItems,
        collectionBreadcrumbs: buildCollectionBreadcrumbs(product?.collections || []),
        stockLabel: product?.stock?.inStock ? "In stock" : "Out of stock",
    };
};

export const findProductSize = (additionalInfoSections = []) => {
    const sizeSection = additionalInfoSections?.find(x => x.title === "Size");
    const size = richTextToPlainText(sizeSection?.description || sizeSection?.text || "") || "—";
    return size;
}

export const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
export const CORE_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 1;
