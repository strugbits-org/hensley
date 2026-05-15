"use server";

import { cache } from "react";
import { logError, sortByOrderNumber, resolveCoreMediaUrl } from "@/utils";
import {
  sdk,
  CORE_TENANT_ID,
  queryActiveHeaderMenu,
  queryStorefrontFooter,
  queryStudios,
  queryProjects,
  queryBlogs,
  queryFeaturedProductCollections,
  queryProductCollectionBySlug,
  queryProductsByCollectionIds,
  mapStorefrontFooterBranches,
  normalizePayloadStudio,
  normalizePayloadProject,
  normalizePayloadBlog,
  querySection,
  sectionToObject,
  queryTestimonialsByType,
  queryInstagramFeedItems,
  queryHeroBanner,
  queryMarkets,
} from "./payloadCollections";

const resolveCollectionMedia = (collection = {}, size) => {
  return (
    resolveCoreMediaUrl(collection.mainMedia, size) ||
    resolveCoreMediaUrl(collection.media?.mainMedia, size) ||
    resolveCoreMediaUrl(collection.media?.featuredImage, size) ||
    resolveCoreMediaUrl(collection.image, size) ||
    resolveCoreMediaUrl(collection.featuredImage, size) ||
    resolveCoreMediaUrl(collection.heroImage, size) ||
    resolveCoreMediaUrl(collection.media, size)
  );
};

const mapProductCollectionToCategoryCard = (collection = {}, index = 0) => {
  const id = collection.id || collection._id || collection.slug || `collection-${index}`;
  const name = collection.name || collection.title || "";
  const slug = (collection.slug || "").replace(/^\/+/, "");
  const fs = collection.featuredSettings || {};

  return {
    _id: id,
    orderNumber: fs.featuredOrderNumber ?? collection.featuredOrderNumber ?? collection.orderNumber ?? collection.order ?? index,
    rtl: Boolean(fs.rtl ?? collection.rtl),
    title:
      fs.title ||
      collection.cardSubtitle ||
      collection.subtitle ||
      collection.shortDescription ||
      collection.description ||
      collection.excerpt ||
      "",
    categories: {
      _id: id,
      name,
      slug,
      mainMedia: resolveCollectionMedia(collection, "tablet"),
    },
  };
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

const getCollectionWithChildrenIds = (collection) => {
  if (!collection || typeof collection !== "object") return [];

  const collectionId = collection.id || collection._id;
  const ids = collectionId ? [collectionId] : [];
  const children = collection?.children?.docs || (Array.isArray(collection?.children) ? collection.children : []);

  children.forEach((child) => {
    if (typeof child === "string") {
      ids.push(child);
      return;
    }

    ids.push(...getCollectionWithChildrenIds(child));
  });

  return [...new Set(ids.filter(Boolean))];
};

const normalizeCoreMarketItem = (item = {}) => {
  const slug = normalizeMarketSlug(item.slug || item.path || item.url);
  const heroImage = resolveCoreMediaUrl(item.heroBackground || item.featuredImage, "tablet");
  const cardImage = resolveCoreMediaUrl(item.featuredImage || item.heroBackground, "card");

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
    howWeDoIt: Array.isArray(item.howWeDoIt) ? item.howWeDoIt : [],
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

export const fetchMarketsData = cache(async () => {
  try {
    const docs = await queryMarkets({
      where: { isHidden: { not_equals: true } },
      depth: 1,
      limit: 100,
    });
    return sortByOrderNumber(docs.map(normalizeCoreMarketItem));
  } catch (error) {
    logError(`Error fetching markets data: ${error.message}`, error);
    return [];
  }
})

export const fetchStudiosData = async () => {
  try {
    const payloadStudios = await queryStudios();
    return payloadStudios.map(normalizePayloadStudio);
  } catch (error) {
    logError(`Error fetching studios data: ${error.message}`, error);
    return [];
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
  return {
    featuredProductTitle: "Products Featured in this Project Entry",
    downloadBtnLabel: "Download Master Class Tenting Guide",
  };
};

export const fetchTentsData = async () => {
  const { fetchAllTents } = await import("./tents");
  return fetchAllTents();
};

export const fetchMasterClassTenting = async () => {
  return process.env.MASTER_CLASS_TENTING_URL || "";
};

const mapStorefrontFooterToLayoutData = (footer) => {
  const brandTitle = footer?.brand?.title || footer?.brand?.eyebrow || "";
  const brandDetails = [footer?.brand?.description, footer?.bottomBar?.copyrightText].filter(Boolean).join("\n\n");
  const footerLinks = sortByOrderNumber(
    (footer?.bottomBar?.links || [])
      .filter((item) => item?.label)
      .map((item, index) => ({
        _id: item.id || `${footer.id}-footer-link-${index}`,
        orderNumber: item.orderNumber ?? index,
        title: item.label,
        link: item.href || item.internalUrl || item.externalUrl || "",
        target: item.openInNewTab ? "_blank" : "",
      }))
  );

  const socialLinks = sortByOrderNumber(
    (footer?.socialLinks || []).map((item, index) => ({
      ...item,
      _id: item.id || `${footer.id}-social-link-${index}`,
      orderNumber: item.orderNumber ?? index,
      link: item.url,
      target: "_blank",
    }))
  );

  return {
    footer,
    footerData: {
      newsletterHeading: footer?.newsletter?.label || "",
      newsletterDescription: footer?.newsletter?.description || "",
      newsletterPlaceholder: footer?.newsletter?.inputPlaceholder || "",
      newsletterButtonLabel: footer?.newsletter?.submitLabel || "SUBMIT",
      copyrightText1: brandTitle,
      copyrightText2: brandDetails || footer?.bottomBar?.tagline || "",
      logo: footer?.brand?.logo?.url || footer?.brand?.logo?.src || "",
    },
    socialLinks,
    footerNaviationData: footerLinks,
    branches: mapStorefrontFooterBranches(footer),
  };
};

export const fetchFooterData = async () => {
  try {
    const storefrontFooter = await queryStorefrontFooter({ channel: "her", key: "default" });
    
    if (!storefrontFooter) throw new Error("Footer not found in bps-core");
    return mapStorefrontFooterToLayoutData(storefrontFooter);
  } catch (error) {
    logError(`Error fetching footer data: ${error.message}`, error);
    return {
      footer: null,
      footerData: {},
      socialLinks: [],
      footerNaviationData: [],
      branches: [],
    };
  }
};

export const fetchOurCategoriesData = async () => {
  try {
    const payloadCollections = await queryFeaturedProductCollections();

    return (Array.isArray(payloadCollections) ? payloadCollections : [])
      .map(mapProductCollectionToCategoryCard)
      .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
  } catch (error) {
    logError(`Error fetching our categories data: ${error.message}`, error);
    return [];
  }
}

export const fetchInstagramFeed = async () => {
  try {
    return await queryInstagramFeedItems();
  } catch (error) {
    logError('Error fetching instagram feed items:', error);
  }
  return [];
};

export const fetchHomePageDetails = cache(async () => {
  try {
    const section = await querySection('home-page-labels');
    if (section) {
      return sectionToObject(section);
    }
  } catch (error) {
    logError('Error fetching home page details:', error);
  }
  return {
    instaFeedHeading: "FOLLOW US ON INSTAGRAM",
    instaFeedTitle: "STAY CONNECTED FEED",
    instaFeedIcon: null,
    instaFeedButtonLabel: "FOLLOW US",
    instaFeedButtonAction: "https://www.instagram.com/hensleyeventresources/",
    bestSellerTitle: "BEST SELLERS",
    hensleyNewsTitle: "HENSLEY NEWS",
    marketsTitle: "OUR MARKETS",
    ourCategoriesTitle: "OUR CATEGORIES",
    ourProjectsTitle: "OUR PROJECTS",
    testimonialsTitle: "WHAT PEOPLE SAY",
  };
})

export const fetchPortfolioData = async () => {
  try {
    const payloadProjects = await queryProjects({ sort: "order" });
    return payloadProjects.map(normalizePayloadProject);
  } catch (error) {
    logError(`Error fetching portfolio data: ${error.message}`, error);
    return [];
  }
};

export const fetchBlogsData = async () => {
  try {
    const payloadBlogs = await queryBlogs();
    return payloadBlogs.map(normalizePayloadBlog);
  } catch (error) {
    logError(`Error fetching blogs data: ${error.message}`, error);
    return [];
  }
};

export const fetchFeaturedBlogs = async (productId) => {
  try {
    const payloadBlogs = await queryBlogs({
      where: { storeProducts: { contains: productId } },
    });
    return payloadBlogs.map(normalizePayloadBlog);
  } catch (error) {
    logError(`Error fetching featured blogs: ${error.message}`, error);
    return [];
  }
}

export const fetchFeaturedProjects = async (id) => {
  try {
    const payloadProjects = await queryProjects({
      where: { storeProducts: { contains: id } },
      sort: "order",
    });
    return payloadProjects.map(normalizePayloadProject);
  } catch (error) {
    logError(`Error fetching featured projects: ${error.message}`, error);
    return [];
  }
}

export const fetchBestSellers = async () => {
  try {
    const bestSellerCollection = await queryProductCollectionBySlug("best-sellers");
    if (!bestSellerCollection) return [];

    const collectionIds = getCollectionWithChildrenIds(bestSellerCollection);
    if (!collectionIds.length) return [];

    const productsResponse = await queryProductsByCollectionIds(collectionIds);
    const products = Array.isArray(productsResponse?.docs) ? productsResponse.docs : [];

    return products;
  } catch (error) {
    logError(`Error fetching best sellers data: ${error.message}`, error);
    return [];
  }
};

export const fetchTestimonials = async () => {
  try {
    return await queryTestimonialsByType(undefined, 'client');
  } catch (error) {
    logError('Error fetching testimonials:', error);
  }
  return [];
};

export const fetchBannerData = async () => {
  try {
    return await queryHeroBanner();
  } catch (error) {
    logError('Error fetching banner data:', error);
  }
  return null;
};


export const fetchContactPageData = async () => {
  try {
    const section = await querySection('contact-form-labels');
    if (section) {
      return { contactFormData: sectionToObject(section) };
    }
  } catch (error) {
    logError('Error fetching contact page data:', error);
  }
  return {
    contactFormData: {
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email",
      messageLabel: "Message",
    },
  };
};

export const fetchAllPagesMetaData = async () => {
  return [];
};

export const fetchPageMetaData = async (slug) => {
  try {
    const result = await sdk.find({
      collection: 'page-seo',
      where: {
        slug: { equals: slug },
        tenant: { equals: CORE_TENANT_ID }
      },
      limit: 1,
      draft: false
    });
    const doc = result.docs[0];
    if (doc) {
      return {
        title: doc.pageTitle || '',
        description: doc.description || '',
        keywords: doc.keywords || ''
      };
    }
  } catch (error) {
    console.error('Error fetching page meta data', error);
  }
  return { title: '', description: '', keywords: '', noFollowTag: false };
};


