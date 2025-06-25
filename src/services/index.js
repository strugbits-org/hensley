"use server";

import { logError, sortByOrderNumber } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { generateWixDocumentUrl } from "@/utils/generateImageURL";

const BASE_URL = process.env.BASE_URL;

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
    const [
      header,
      headerSubMenu,
      headerMegaMenu
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "Header" }),
      queryCollection({ dataCollectionId: "HeaderSubMenu", includeReferencedItems: ["Header_menuItems"] }),
      queryCollection({ dataCollectionId: "HeaderMegaMenu", includeReferencedItems: ["category", "HeaderSubMenu_categories"] })
    ]);

    if (!Array.isArray(header.items) || !Array.isArray(headerSubMenu.items) || !Array.isArray(headerMegaMenu.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      header: sortByOrderNumber(header.items),
      headerSubMenu: headerSubMenu.items,
      headerMegaMenu: headerMegaMenu.items
    };

    return response;
  } catch (error) {
    logError(`Error fetching home page data: ${error.message}`, error);
  }
};

export const fetchMarketsData = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "MarketsCollection", includeReferencedItems: ["marketsOld"], sortKey: "orderNumber" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching markets data: ${error.message}`, error);
  }
};

export const fetchSelectedMarketsData = async (slug) => {
  try {
    const response = await queryCollection({
      dataCollectionId: "MarketsCollection", includeReferencedItems: ["marketsOld"], sortKey: "orderNumber",
      eq: [
        {
          key: "slug",
          value: `/${slug}`
        }
      ]
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items[0];
  } catch (error) {
    logError(`Error fetching markets data: ${error.message}`, error);
  }
};



export const fetchTentListingPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "tentListingPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};

export const fetchTentsData = async () => {
  try {
    const response = await queryCollection({
      dataCollectionId: "TentsCollection",
      includeReferencedItems: ["tent", "productData"],
      sortKey: "orderNumber"
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }
    return response.items;
  } catch (error) {
    logError(`Error fetching tents data: ${error.message}`, error);
  }
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


export const fetchTentsWithProjectsAndBlogs = async () => {
  try {
    const tents = await fetchTentsData();
    if (!Array.isArray(tents)) throw new Error("Tents not found");

    const results = await Promise.all(
      tents.map(async (item) => {
        const tentData = item;

        const [featuredProjects, blogs] = await Promise.all([
          fetchFeaturedProjects(item.tent?._id),
          fetchFeaturedBlogs(item.tent?._id),
        ]);

        return {
          tentData,
          portfolio: featuredProjects,
          blogs,
        };
      })
    );

    return results;
  } catch (error) {
    logError(`Error fetching tents with projects and blogs: ${error.message}`, error);
  }
};




// --------------------------------------------------------------------------





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
