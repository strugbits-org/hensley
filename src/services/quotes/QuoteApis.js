"use server";
import { logError } from "@/utils";
import { getAuthToken, getCartId } from "../auth";
import { createPriceQuoteVisitor } from "./QuoteApisVisitor";
import { querySection, sectionToObject } from "../payloadCollections";

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
    const section = await querySection("quote-history-page-details");
    if (section) {
      return sectionToObject(section);
    }
    return {};
  } catch (error) {
    logError(`Error fetching quote history page details: ${error.message}`, error);
    return {};
  }
};



export const fetchQuotePageDetails = async () => {
  try {
    const section = await querySection("quote-request-page-details");
    if (section) {
      const details = sectionToObject(section);
      return {
        title: details.title || "QUOTE REQUEST",
        tagline: details.tagline || "",
        description: details.description || "",
        submitButtonLabel: details.submitButtonLabel || "SUBMIT",
        sections: {
          eventDetails: details.eventDetailsTitle || "EVENT DETAILS",
          billingDetails: details.billingDetailsTitle || "BILLING DETAILS",
          orderBy: details.orderByTitle || "ORDER BY",
        },
        labels: {
          eventDate: details.eventDateLabel || "EVENT DATE*",
          deliveryDate: details.deliveryDateLabel || "DELIVERY DATE*",
          pickupDate: details.pickupDateLabel || "PICKUP DATE*",
          eventLocation: details.eventLocationLabel || "EVENT LOCATION",
          eventDescription: details.eventDescriptionLabel || "EVENT DESCRIPTION / PO#",
          billTo: details.billToLabel || "BILL TO*",
          streetAddress: details.streetAddressLabel || "STREET ADDRESS*",
          addressLine2: details.addressLine2Label || "ADDRESS LINE 2",
          city: details.cityLabel || "CITY*",
          state: details.stateLabel || "STATE*",
          zipCode: details.zipCodeLabel || "ZIP CODE*",
          specialInstructions: details.specialInstructionsLabel || "SPECIAL INSTRUCTIONS OR ORDER COMMENTS",
          city1: details.citySecondaryLabel || "CITY",
          state1: details.stateSecondaryLabel || "STATE",
          name: details.nameLabel || "NAME*",
          email: details.emailLabel || "EMAIL*",
          phone: details.phoneLabel || "PHONE*",
        },
      };
    }
    return {};
  } catch (error) {
    logError(`Error fetching quote page details: ${error.message}`, error);
    return {};
  }
};