"use server";
import { cookies } from "next/headers";
import { logError } from "@/utils";
import { createCart } from "../cart/CartApisVisitor";
import queryCollection from "@/utils/fetchFunction";
import { payloadMemberHasBadge } from "./payloadBadges";
import { payloadGetCurrentMember } from "./payloadAuth";

export const getAuthToken = async () => {
  const cookieStore = cookies();
  const authToken = cookieStore?.get("authToken");
  return authToken?.value || "";
};

export const getMemberTokens = async () => {
  const cookieStore = cookies();
  const tokens = cookieStore?.get("userTokens");
  if (!tokens) return "";

  try {
    return JSON.parse(tokens.value);
  } catch (error) {
    return "";
  }
};

export const fetchLoginPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "LoginPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};

export const fetchSignupPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "SignupPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};

export const fetchAccountPageDetails = async () => {
  try {
    const pageDetails = await queryCollection({ dataCollectionId: "MyaccountPageDetails" });

    if (!Array.isArray(pageDetails.items)) {
      throw new Error(`PrivacyPolicy response does not contain items array`);
    }

    return pageDetails.items[0]

  } catch (error) {
    logError(`Error fetching contact page data: ${error.message}`, error);
  }
};


export const getCartId = async (createNew = true) => {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore?.get("cartId");
    if (!cartId && createNew) {
      const cart = await createCart();

      if (!cart) {
        throw new Error("Failed to create cart");
      }

      cookieStore.set("cartId", cart._id, { path: "/" })
      return cart._id;
    }

    return cartId?.value || "";
  } catch (error) {
    throw new Error(error);
  }
};

export const checkIsAdmin = async () => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) return false;
    
    const memberResponse = await payloadGetCurrentMember(authToken);
    const user = memberResponse?.user || memberResponse;
    if (!user || !user.id) return false;

    return payloadMemberHasBadge(user);
  } catch (error) {
    logError("Error checking admin status:", error);
    return false;
  }
};