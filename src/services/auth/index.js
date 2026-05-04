"use server";
import { cookies } from "next/headers";
import { logError } from "@/utils";
import { createCart } from "../cart/CartApisVisitor";
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
  return {
    newToHensleyText: "New to Hensley?",
    submitButtonLabel: "SIGN IN",
    createAccountButtonLabel: "CREATE ACCOUNT",
    logo: null,
    labels: { email: "Email", password: "Password" },
    agreementContent: null,
    forgetPasswordLabel: "Forgot your password?",
  };
};

export const fetchSignupPageDetails = async () => {
  return {
    title: "Create Account",
    submitButtonLabel: "CREATE ACCOUNT",
    labels: {},
    agreementContent: null,
  };
};

export const fetchAccountPageDetails = async () => {
  return {};
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