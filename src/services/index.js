"use server";

import { logError, sortByOrderNumber } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { generateWixDocumentUrl } from "@/utils/generateImageURL";
import {
  queryActiveHeaderMenu,
  queryStudios,
  queryProjects,
  queryBlogs,
  normalizePayloadStudio,
  normalizePayloadProject,
  normalizePayloadBlog,
} from "./payloadCollections";

const BASE_URL = process.env.BASE_URL;
const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || process.env.NEXT_PUBLIC_CORE_API_BASE_URL || "";
const CORE_API_KEY = process.env.CORE_API_KEY || "";

const resolveCoreMediaUrl = (media) => {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media?.url || media?.thumbnailURL || media?.sizes?.thumbnail?.url || "";
};

const normalizeMarketSlug = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.startsWith("/") ? value : `/${value}`;
};

const resolveRelationshipId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return resolveRelationshipId(value[0]);
  if (typeof value === "object") return value.id || value._id || value.value || null;
  return null;
};

const normalizeCoreMarketItem = (item = {}) => {
  const slug = normalizeMarketSlug(item.slug || item.path || item.url);
  const heroImage = resolveCoreMediaUrl(item.heroBackground || item.featuredImage);
  const cardImage = resolveCoreMediaUrl(item.featuredImage || item.heroBackground);

  return {
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
    title: item.title || "",
    slug,
    orderNumber: item.orderNumber ?? item.order ?? 0,
    description: item.description || "",
    tagline: item.tagline || "",
    image1: heroImage || cardImage,
    featuredImage: cardImage || heroImage,
    heroBackground: heroImage || cardImage,
    headerCoverImage: cardImage || heroImage,
    buttonLabel: item.buttonLabel || "DISCOVER",
    buttonLabelMenu: item.buttonLabelHeader || item.buttonLabel || "SEE MORE",
    buttonLink: item.buttonLink || (slug ? `/market${slug}` : ""),
    content1: item.content || null,
    video: resolveCoreMediaUrl(item.video),
    bestSellerCollection: resolveRelationshipId(item.bestSellerCollection),
    marketsOld: resolveRelationshipId(item.marketsOld),
  };
};

export const joinWaitList = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/form-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchHeaderData = async () => {
  try {
    const response = await queryActiveHeaderMenu();

    return {
      header: sortByOrderNumber(response?.header || []),
      headerSubMenu: sortByOrderNumber(response?.headerSubMenu || []),
      headerMegaMenu: sortByOrderNumber(response?.headerMegaMenu || []),
      menuSource: response?.menuSource || "payload",
      menuDocumentId: response?.menuDocumentId || null,
    };
  } catch (error) {
    logError(`Error fetching header menu data: ${error.message}`, error);
    return {
      header: [],
      headerSubMenu: [],
      headerMegaMenu: [],
      menuSource: "payload",
      menuDocumentId: null,
    };
  }
};

export const fetchMarketsData = async () => {
  try {
    if (CORE_API_BASE_URL) {
      const response = await fetch(
        `${CORE_API_BASE_URL}/api/products/market`,
        {
          headers: CORE_API_KEY ? { Authorization: `Bearer ${CORE_API_KEY}` } : {},
          next: { revalidate: Number(process.env.REVALIDATE_TIME) || 60 },
        }
      );

      if (response.ok) {
        const json = await response.json();
        const items = Array.isArray(json?.items)
          ? json.items
          : Array.isArray(json?.docs)
            ? json.docs
            : [];

        if (items.length) {
          return sortByOrderNumber(items.map(normalizeCoreMarketItem));
        }
      }
    }

    const response = await queryCollection({ dataCollectionId: "MarketsCollection", includeReferencedItems: ["marketsOld"], sortKey: "orderNumber" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching markets data: ${error.message}`, error);
    return [];
  }
};

export const fetchStudiosData = async () => {
  try {
    // Payload-first
    const payloadStudios = await queryStudios();
    if (payloadStudios.length) {
      return payloadStudios.map(normalizePayloadStudio);
    }

    // Wix fallback
    const response = await queryCollection({ dataCollectionId: "Studios" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching studios data: ${error.message}`, error);
  }
};

export const fetchSelectedMarketsData = async (slug) => {
  try {
    const markets = await fetchMarketsData();
    return markets.find((item) => item.slug === `/${slug}`) || null;
  } catch (error) {
    logError(`Error fetching selected market data: ${error.message}`, error);
    return null;
  }
};



export const fetchTentListingPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "tentListingPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`Page details response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching tent listing page details: ${error.message}`, error);
  }
};

export const fetchTentsData = async () => {
  const { fetchAllTents } = await import("./tents");
  return fetchAllTents();
};

export const fetchMasterClassTenting = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "MasterClassTenting101" });
    const url = response?.items[0]?.masterClassTenting101 || "";
    const folderId = "0e0ac59a-ee22-4893-94f5-fe2986338ea7";
    return generateWixDocumentUrl(folderId, url);
  } catch (error) {
    logError(`Error fetching master class tenting data: ${error.message}`, error);
  }
};

export const fetchFooterData = async () => {
  try {
    const [
      footerData,
      socialLinks,
      footerNaviationData,
      branches
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "FooterCollection" }),
      queryCollection({ dataCollectionId: "SocialLinks" }),
      queryCollection({ dataCollectionId: "FooterNavigation" }),
      queryCollection({ dataCollectionId: "Branches", sortKey: "orderNumber" }),
    ]);

    if (!Array.isArray(footerData.items) || !Array.isArray(footerNaviationData.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      footerData: footerData.items[0],
      socialLinks: sortByOrderNumber(socialLinks.items),
      footerNaviationData: sortByOrderNumber(footerNaviationData.items),
      branches: sortByOrderNumber(branches.items),
    };

    return response;
  } catch (error) {
    logError(`Error fetching footer data: ${error.message}`, error);
  }
};

export const fetchOurCategoriesData = async () => {
  try {
    const response = await queryCollection({
      dataCollectionId: "OurCategories",
      includeReferencedItems: ["categories"]
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return sortByOrderNumber(response.items);
  } catch (error) {
    logError(`Error fetching our categories data: ${error.message}`, error);
  }
}

export const fetchInstagramFeed = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "InstagramFeed" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching instagram feed data: ${error.message}`, error);
  }
};

export const fetchHomePageDetails = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "HomePageDetails" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items[0] || {};
  } catch (error) {
    logError(`Error fetching home page data: ${error.message}`, error);
  }
};

export const fetchPortfolioData = async () => {
  try {
    // Payload-first
    const payloadProjects = await queryProjects({ sort: "order" });
    if (payloadProjects.length) {
      return payloadProjects.map(normalizePayloadProject);
    }

    // Wix fallback
    const response = await queryCollection({
      dataCollectionId: "PortfolioCollection",
      includeReferencedItems: ["portfolioRef"],
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ],
      sortKey: "order"
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching portfolio data: ${error.message}`, error);
  }
};

export const fetchBlogsData = async () => {
  try {
    // Payload-first
    const payloadBlogs = await queryBlogs({ sort: "-publishedDate" });
    if (payloadBlogs.length) {
      return payloadBlogs.map(normalizePayloadBlog);
    }

    // Wix fallback
    const response = await queryCollection({
      dataCollectionId: "ManageBlogs",
      includeReferencedItems: ["blogRef", "author", "markets", "studios"],
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ],
      sortKey: "publishDate",
      sortOrder: "desc"
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching blogs data: ${error.message}`, error);
  }
};

export const fetchFeaturedBlogs = async (productId) => {
  try {
    // Payload-first
    const payloadBlogs = await queryBlogs({
      where: { storeProducts: { contains: productId } },
      sort: "-publishDate",
    });
    if (payloadBlogs.length) {
      return payloadBlogs.map(normalizePayloadBlog);
    }

    // Wix fallback
    const response = await queryCollection({
      dataCollectionId: "ManageBlogs",
      includeReferencedItems: ['blogRef', 'markets', 'studios', 'author', "storeProducts"],
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ],
      hasSome: [
        {
          key: "storeProducts",
          values: [productId]
        }
      ],
      sortKey: "publishDate",
      sortOrder: "desc",
    });

    if (!Array.isArray(response.items) || response.items.length === 0) {
      throw new Error(`Selected blog not found`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching other blogs: ${error.message}`, error);
  }
}

export const fetchFeaturedProjects = async (id) => {
  try {
    // Payload-first
    const payloadProjects = await queryProjects({
      where: { storeProducts: { contains: id } },
      sort: "order",
    });
    if (payloadProjects.length) {
      return payloadProjects.map(normalizePayloadProject);
    }

    // Wix fallback
    const response = await queryCollection({
      dataCollectionId: "PortfolioCollection",
      includeReferencedItems: ["portfolioRef"],
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ],
      hasSome: [
        {
          key: "storeProducts",
          values: [id]
        }
      ],
      sortKey: "order"
    });
    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching featured projects: ${error.message}`, error);
  }
}

export const fetchBestSellers = async (slug = '/') => {
  try {
    const response = await queryCollection({
      dataCollectionId: "BestSellers",
      includeReferencedItems: ["product", "productData"],
      eq: [
        {
          key: "slug",
          value: slug
        }
      ],
      sortKey: "orderNumber"
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const data = response.items.map(item => {
      return {
        ...item.productData,
        product: item.product,
      }
    });
    return data;
  } catch (error) {
    logError(`Error fetching best sellers data: ${error.message}`, error);
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "WhatPeopleSay", sortKey: "order" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching testimonials data: ${error.message}`, error);
  }
};

export const fetchBannerData = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "BannerHomePage" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items[0];
  } catch (error) {
    logError(`Error fetching banner data: ${error.message}`, error);
  }
};


export const fetchContactPageData = async () => {
  try {
    const [contactFormData] = await Promise.all([
      queryCollection({ dataCollectionId: "ContactForm" }),
    ]);

    if (!Array.isArray(contactFormData.items)) {
      throw new Error(`ContactForm response does not contain items array`);
    }

    return {
      contactFormData: contactFormData.items[0],
    };

  } catch (error) {
    logError(`Error fetching contact form data: ${error.message}`, error);
  }
};

export const fetchAllPagesMetaData = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "PageSEOConfigurationMeta", sortKey: "order" });

    if (!Array.isArray(response.items)) {
      throw new Error(`response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching page meta data: ${error.message}`, error);
  }
};

export const fetchPageMetaData = async (slug) => {
  try {
    const response = await queryCollection({
      dataCollectionId: "PageSEOConfigurationMeta",
      eq: [
        {
          key: "slug",
          value: slug
        }
      ]
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`response does not contain items array`);
    }

    return response.items[0];
  } catch (error) {
    logError(`Error fetching page meta data: ${error.message}`, error);
  }
};
