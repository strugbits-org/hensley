"use server";

import { logError } from "@/utils";

const baseUrl = process.env.BASE_URL;

export const createPriceQuoteVisitor = async ({ cartId, lineItems, quoteDetails }) => {
  try {
    const payload = { cartId, lineItems, quoteDetails };

    const response = await fetch(`${baseUrl}/api/quote-visitor/create`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logError("Error creating cart: ", error);
    throw new Error(error);
  }
};
