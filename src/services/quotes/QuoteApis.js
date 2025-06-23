"use server";
import queryCollection from "@/utils/fetchFunction";
import { getAuthToken, getCartId, getMemberTokens } from "../auth";
import { createPriceQuoteVisitor } from "./QuoteApisVisitor";

const baseUrl = process.env.BASE_URL;

export const createPriceQuote = async ({ lineItems, quoteDetails }) => {
  try {
    const authToken = await getAuthToken();
    const memberTokens = await getMemberTokens();

    if (!authToken) {
      const cartId = await getCartId();
      const response = createPriceQuoteVisitor({ cartId, lineItems, quoteDetails });
      return response;
    }

    const payload = { memberTokens, lineItems, quoteDetails };

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
    const pageDetails = await queryCollection({ dataCollectionId: "QuoteHistoryPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};



export const fetchQuotePageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "QuoteRequestPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};