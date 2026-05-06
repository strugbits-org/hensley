"use server";
import { logError } from "@/utils";
import { getAuthToken, getCartId } from "../auth";
import { createPriceQuoteVisitor } from "./QuoteApisVisitor";
import { queryPageBySlug } from "../payloadCollections";

const baseUrl = process.env.BASE_URL;

export const createPriceQuote = async ({ lineItems, quoteDetails }) => {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      const cartId = await getCartId();
      const response = createPriceQuoteVisitor({ cartId, lineItems, quoteDetails });
      return response;
    }

    const payload = { lineItems, quoteDetails };

    const response = await fetch(`${baseUrl}/api/quote/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchAllQuotes = async () => {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(`${baseUrl}/api/quote/getAllQuotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      cache: "no-store",
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.data.items;
  } catch (error) {
    throw new Error(error);
  }
};


export const fetchQuote = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/quote/get/${id}`, {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    const data = await response.json();

    return data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchQuoteHistoryPageDetails = async () => {
  try {
    const page = await queryPageBySlug('quote-history');
    if (page) {
      const blocks = page.layout || page.blocks || [];
      const customSection = blocks.find(b => b.blockType === 'customSection') || blocks[0] || page;
      return { hensleyNewsTitle: customSection.hensleyNewsTitle || page.hensleyNewsTitle || '' };
    }
    return {};
  } catch (error) {
    logError(`Error fetching quote history page details: ${error.message}`, error);
    return {};
  }
};



export const fetchQuotePageDetails = async () => {
  try {
    const page = await queryPageBySlug('quote-request');
    if (page) {
      const blocks = page.layout || page.blocks || [];
      const customSection = blocks.find(b => b.blockType === 'customSection') || blocks[0] || page;
      return { hensleyNewsTitle: customSection.hensleyNewsTitle || page.hensleyNewsTitle || '' };
    }
    return {};
  } catch (error) {
    logError(`Error fetching quote page details: ${error.message}`, error);
    return {};
  }
};