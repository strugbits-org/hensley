"use server";

import { logError, sortByOrderNumber } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

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
    const response = await queryCollection({ dataCollectionId: "MarketsCollection" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching markets data: ${error.message}`, error);
  }
};

export const fetchTentsData = async () => {
  try {
    const response = await queryCollection({ dataCollectionId: "TentsCollection", includeReferencedItems: ["tent"] });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching tents data: ${error.message}`, error);
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
      queryCollection({ dataCollectionId: "Branches" }),
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

    return response.items[0];
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

export const fetchBestSellers = async (slug = '/') => {
  try {
    const response = await queryCollection({
      dataCollectionId: "BestSellers",
      includeReferencedItems: ["product"],
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

    return response.items;
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