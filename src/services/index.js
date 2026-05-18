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
  queryProductsByCollectionIdsForHome,
  mapStorefrontFooterBranches,
  normalizePayloadStudio,
  normalizePayloadProject,
  normalizePayloadProjectForHome,
  normalizePayloadProjectForListing,
  normalizePayloadBlog,
  normalizePayloadBlogForHome,
  normalizePayloadBlogForListing,
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

export const fetchHeaderData = cache(async () => {
  try {
    const response = await queryActiveHeaderMenu();

    return {
      header: sortByOrderNumber(response?.header || []),
      headerSubMenu: sortByOrderNumber(response?.headerSubMenu || []),
      headerMegaMenu: sortByOrderNumber(response?.headerMegaMenu || []),
    };
  } catch (error) {
    logError(`Error fetching header menu data: ${error.message}`, error);
    return {
      header: [],
      headerSubMenu: [],
      headerMegaMenu: [],
    };
  }
});

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

// Layout/Header variant. MarketTentModal reads title/tagline/slug/buttonLabel
// and one of headerCoverImage|featuredImage|heroBackground for the card image.
// Drops description/video/howWeDoIt/bestSellerCollection/marketsOld/content.
export const fetchMarketsForHeader = cache(async () => {
  try {
    const docs = await queryMarkets({
      where: { isHidden: { not_equals: true } },
      depth: 1,
      limit: 100,
      select: {
        title: true,
        slug: true,
        tagline: true,
        featuredImage: true,
        heroBackground: true,
        orderNumber: true,
        order: true,
        isHidden: true,
        buttonLabel: true,
        buttonLabelHeader: true,
        buttonLink: true,
      },
    });
    return sortByOrderNumber(docs.map(normalizeCoreMarketItem));
  } catch (error) {
    logError(`Error fetching markets data (header): ${error.message}`, error);
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



export const fetchTentListingPageDetails = cache(async () => {
  const fallback = {
    featuredProductTitle: "Products Featured in this Project Entry",
    downloadBtnLabel: "Download Master Class Tenting Guide",
    masterClassTentingURL: process.env.MASTER_CLASS_TENTING_URL || "",
  };
  try {
    const section = await querySection("tent-listing-page-details");
    if (section) {
      const details = sectionToObject(section);
      const resolvedUrl = resolveCoreMediaUrl(details.masterClassTentingURL);
      return {
        ...fallback,
        ...details,
        masterClassTentingURL: resolvedUrl || fallback.masterClassTentingURL,
      };
    }
  } catch (error) {
    logError(`Error fetching tent listing page details: ${error.message}`, error);
  }
  return fallback;
});

export const fetchTentsData = cache(async () => {
  const { fetchAllTents } = await import("./tents");
  return fetchAllTents();
});

// Layout-only variant. The Header dropdown only reads title/slug/tagline/
// images/additionalInfoSections and a few IDs for the tents-id store. Skips
// the full depth-2 product graph and the heavy normalizer fields (variants,
// productOptions, recommendedProducts, mediaItems gallery) that only the PDP
// consumes.
export const fetchTentsDataForHeader = cache(async () => {
  const { fetchAllTentsForHeader } = await import("./tents");
  return fetchAllTentsForHeader();
});

// /types-of-tents listing variant. Same depth-1 slim select as the header,
// but the normalizer produces the {tent, ...} shape that TentsTypes /
// TentTypesSlider / BannerStructures destructure. The page also reads
// item.tent._id to fan out featured projects + blogs per tent, so the id is
// surfaced. Drops the depth:2 product graph and the heavy normalizeTentItem
// chain (gallery, recommendedProducts, collections summary, productOptions,
// tentConfig) — none of which the listing renders.
export const fetchTentsDataForListing = cache(async () => {
  const { fetchAllTentsForListing } = await import("./tents");
  return fetchAllTentsForListing();
});

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

export const fetchFooterData = cache(async () => {
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
});

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

export const fetchInstagramFeed = cache(async () => {
  try {
    return await queryInstagramFeedItems();
  } catch (error) {
    logError('Error fetching instagram feed items:', error);
  }
  return [];
});

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

// Field sets / normalizers slimmed for the FeaturedBlogs + FeaturedProjects
// sliders. FeaturedBlogCard reads {blogRef.{title,coverImage}, markets, studios,
// slug, author.nickname}; FeaturedProjects/OurProjects read portfolioRef.
// {title, slug, coverImage.imageInfo}. The *ForListing normalizers already
// produce a superset of those, so reuse them and drop depth:2 hydration of
// content body, hero/gallery, testimonial, storeProducts, meta.
const FEATURED_BLOG_SELECT = {
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  author: true,
  markets: true,
  studios: true,
  blogCategories: true,
  publishedDate: true,
  createdAt: true,
  updatedAt: true,
  order: true,
  isHidden: true,
};

const FEATURED_PROJECT_SELECT = {
  title: true,
  slug: true,
  description: true,
  coverImage: true,
  publishDate: true,
  publishedDate: true,
  order: true,
  isHidden: true,
  markets: true,
  studios: true,
  portfolioCategories: true,
};

// Request-cached: /types-of-tents fans out featured fetches across N tents in
// the same request — cache() ensures shared ids hit once. Per-id memoization
// still costs N calls when ids differ, but each is now slim.
export const fetchFeaturedBlogs = cache(async (productId) => {
  try {
    if (!productId) return [];
    const payloadBlogs = await queryBlogs({
      where: { storeProducts: { contains: productId } },
      depth: 1,
      select: FEATURED_BLOG_SELECT,
    });
    return payloadBlogs.map(normalizePayloadBlogForListing);
  } catch (error) {
    logError(`Error fetching featured blogs: ${error.message}`, error);
    return [];
  }
})

export const fetchFeaturedProjects = cache(async (id) => {
  try {
    if (!id) return [];
    const payloadProjects = await queryProjects({
      where: { storeProducts: { contains: id } },
      sort: "order",
      depth: 1,
      select: FEATURED_PROJECT_SELECT,
    });
    return payloadProjects.map(normalizePayloadProjectForListing);
  } catch (error) {
    logError(`Error fetching featured projects: ${error.message}`, error);
    return [];
  }
})

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

// Homepage-only variants. Each pairs a tighter Payload query (select/depth)
// with a slim normalizer so we don't change the shape consumers already read.
// Shared service functions above stay untouched for layout/sitemap/PDP/etc.

export const fetchBestSellersForHome = async () => {
  try {
    const bestSellerCollection = await queryProductCollectionBySlug("best-sellers");
    if (!bestSellerCollection) return [];

    const collectionIds = getCollectionWithChildrenIds(bestSellerCollection);
    if (!collectionIds.length) return [];

    const productsResponse = await queryProductsByCollectionIdsForHome(collectionIds);
    const products = Array.isArray(productsResponse?.docs) ? productsResponse.docs : [];

    // Honor the admin-curated order from the best-sellers collection's
    // productOrder field. SDK returns docs in arbitrary order otherwise.
    const orderedIds = Array.isArray(bestSellerCollection.productOrder)
      ? bestSellerCollection.productOrder
          .map((p) => (typeof p === "string" ? p : p?.id ?? p?._id))
          .filter(Boolean)
      : [];

    if (!orderedIds.length) return products;

    const indexById = new Map(orderedIds.map((id, i) => [id, i]));
    const productId = (p) => p?.id ?? p?._id;
    const FALLBACK = Number.MAX_SAFE_INTEGER;
    return [...products].sort((a, b) => {
      const ai = indexById.has(productId(a)) ? indexById.get(productId(a)) : FALLBACK;
      const bi = indexById.has(productId(b)) ? indexById.get(productId(b)) : FALLBACK;
      return ai - bi;
    });
  } catch (error) {
    logError(`Error fetching best sellers (home): ${error.message}`, error);
    return [];
  }
};

export const fetchPortfolioDataForHome = async () => {
  try {
    const payloadProjects = await queryProjects({
      sort: "order",
      depth: 1,
      select: {
        title: true,
        slug: true,
        coverImage: true,
        order: true,
        isHidden: true,
      },
    });
    return payloadProjects.map(normalizePayloadProjectForHome);
  } catch (error) {
    logError(`Error fetching portfolio data (home): ${error.message}`, error);
    return [];
  }
};

export const fetchBlogsDataForHome = async () => {
  try {
    const payloadBlogs = await queryBlogs({
      depth: 1,
      select: {
        title: true,
        slug: true,
        coverImage: true,
        author: true,
        markets: true,
        studios: true,
        blogCategories: true,
        publishedDate: true,
        createdAt: true,
        updatedAt: true,
        order: true,
        isHidden: true,
      },
    });
    return payloadBlogs.map(normalizePayloadBlogForHome);
  } catch (error) {
    logError(`Error fetching blogs data (home): ${error.message}`, error);
    return [];
  }
};

export const fetchMarketsForHome = async () => {
  try {
    // depth: 1 is required so featuredImage/heroBackground upload relationships
    // are populated into objects (with url/sizes) instead of bare ID strings.
    // The `select` still trims description/video/howWeDoIt/bestSellerCollection.
    const docs = await queryMarkets({
      where: { isHidden: { not_equals: true } },
      depth: 1,
      limit: 100,
      select: {
        title: true,
        slug: true,
        featuredImage: true,
        heroBackground: true,
        orderNumber: true,
        order: true,
        isHidden: true,
        buttonLabel: true,
        buttonLabelHeader: true,
        buttonLink: true,
      },
    });
    return sortByOrderNumber(docs.map(normalizeCoreMarketItem));
  } catch (error) {
    logError(`Error fetching markets data (home): ${error.message}`, error);
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

export const buildRobotsTag = (noIndex, noFollow) => {
  if (noIndex && noFollow) return "noindex,nofollow";
  if (noIndex) return "noindex";
  if (noFollow) return "nofollow";
  return null;
};

export const fetchPageMetaData = async (slug) => {
  try {
    const result = await sdk.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        tenant: { equals: CORE_TENANT_ID },
        _status: { equals: 'published' }
      },
      limit: 1,
      depth: 0,
      draft: false,
      select: {
        meta: true
      }
    });
    const doc = result.docs[0];
    if (doc) {
      const meta = doc.meta || {};
      const keywords = Array.isArray(meta.metaKeywords) ? meta.metaKeywords.join(', ') : '';
      const noIndex = meta.noIndex === true;
      const noFollow = meta.noFollow === true;
      return {
        title: meta.title || '',
        description: meta.description || '',
        keywords,
        noIndex,
        noFollow,
        noFollowTag: noIndex || noFollow,
        robotsTag: buildRobotsTag(noIndex, noFollow)
      };
    }
  } catch (error) {
    console.error('Error fetching page meta data', error);
  }
  return { title: '', description: '', keywords: '', noIndex: false, noFollow: false, noFollowTag: false, robotsTag: null };
};


