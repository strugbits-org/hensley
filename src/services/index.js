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
    const response = await queryCollection({ dataCollectionId: "TentsCollection" });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items array`);
    }

    return response.items;
  } catch (error) {
    logError(`Error fetching tents data: ${error.message}`, error);
  }
};