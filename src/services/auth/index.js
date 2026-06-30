"use server";
import { cookies } from "next/headers";
import { logError } from "@/utils";
import { createCart } from "../cart/CartApisVisitor";
import { payloadMemberHasBadge } from "./payloadBadges";
import { payloadGetCurrentMember } from "./payloadAuth";
import { querySection, sectionToObject } from "../payloadCollections";

export const getAuthToken = async () => {
  const cookieStore = cookies();
  const authToken = cookieStore?.get("authToken");
  return authToken?.value || "";
};

const AUTH_COOKIES = ["authToken", "userData", "userTokens", "cartQuantity"];

// Clears a dead auth session (e.g. a token issued by a previous backend that the
// current backend rejects). Unlike handleUnauthorizedServer it does NOT redirect,
// so callers can silently fall back to the guest flow instead of interrupting the
// user. Only call this for a confirmed auth failure (401), never on transient
// Core errors, otherwise we'd reintroduce the production reload-logout bug.
export const clearAuthSession = async () => {
  const cookieStore = cookies();
  AUTH_COOKIES.forEach((name) => {
    try {
      cookieStore.delete(name);
    } catch {}
  });
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
    const section = await querySection("login-page-details");
    const details = sectionToObject(section);
    if (section) {
      return {
        newToHensleyText: details.newToHensleyText || "NEW TO HENSLEY?",
        submitButtonLabel: details.submitButtonLabel || "SIGN IN",
        submittingButtonLabel: details.submittingButtonLabel || "SIGNING IN...",
        createAccountButtonLabel: details.createAccountButtonLabel || "CREATE YOUR ACCOUNT",
        mobileTitle: details.mobileTitle || "Login",
        logo: details.logo || null,
        labels: {
          email: details.emailLabel || "Email",
          password: details.passwordLabel || "Password",
        },
        placeholders: {
          email: details.emailPlaceholder || "example@myemail.com",
          password: details.passwordPlaceholder || "********",
        },
        agreementContent: details.agreementContent || null,
        forgetPasswordLabel: details.forgetPasswordLabel || "Forgot your password?",
      };
    }
  } catch (error) {
    logError("Error fetching login page details:", error);
  }

  return {
    newToHensleyText: "NEW TO HENSLEY?",
    submitButtonLabel: "SIGN IN",
    submittingButtonLabel: "SIGNING IN...",
    createAccountButtonLabel: "CREATE YOUR ACCOUNT",
    mobileTitle: "Login",
    logo: null,
    labels: { email: "Email", password: "Password" },
    placeholders: { email: "example@myemail.com", password: "********" },
    agreementContent: null,
    forgetPasswordLabel: "Forgot your password?",
  };
};

export const fetchSignupPageDetails = async () => {
  try {
    const section = await querySection("signup-page-details");
    const details = sectionToObject(section);
    if (section) {
      return {
        title: details.title || "CREATE ACCOUNT",
        submitButtonLabel: details.submitButtonLabel || "CREATE ACCOUNT",
        submittingButtonLabel: details.submittingButtonLabel || "CREATING ACCOUNT...",
        labels: {
          firstName: details.firstNameLabel || "FIRST NAME*",
          lastName: details.lastNameLabel || "LAST NAME*",
          email: details.emailLabel || "Email",
          phone: details.phoneLabel || "PHONE NUMBER*",
          password: details.passwordLabel || "PASSWORD*",
          confirmPassword: details.confirmPasswordLabel || "CONFIRM PASSWORD",
        },
        successTitle: details.successTitle || "ACCOUNT CREATED",
        successDescription: details.successDescription || "Your account has been created. You can now sign in with your credentials.",
        successButtonText: details.successButtonText || "SIGN IN",
        errorTitle: details.errorTitle || "SIGNUP FAILED",
        errorDescription: details.errorDescription || "Something went wrong while creating your account. Please try again.",
        errorButtonText: details.errorButtonText || "TRY AGAIN",
        agreementContent: details.agreementContent || null,
      };
    }
  } catch (error) {
    logError("Error fetching signup page details:", error);
  }

  return {
    title: "CREATE ACCOUNT",
    submitButtonLabel: "CREATE ACCOUNT",
    submittingButtonLabel: "CREATING ACCOUNT...",
    labels: {
      firstName: "FIRST NAME*",
      lastName: "LAST NAME*",
      email: "Email",
      phone: "PHONE NUMBER*",
      password: "PASSWORD*",
      confirmPassword: "CONFIRM PASSWORD",
    },
    successTitle: "ACCOUNT CREATED",
    successDescription: "Your account has been created. You can now sign in with your credentials.",
    successButtonText: "SIGN IN",
    errorTitle: "SIGNUP FAILED",
    errorDescription: "Something went wrong while creating your account. Please try again.",
    errorButtonText: "TRY AGAIN",
    agreementContent: null,
  };
};

export const fetchAccountPageDetails = async () => {
  try {
    const section = await querySection("account-page-details");
    const details = sectionToObject(section);
    if (section) {
      return {
        title: details.title || "MY ACCOUNT",
        description: details.description || "View and edit your personal info below.",
        subTitle: details.subTitle || "ACCOUNT",
        personalInfoDescription: details.personalInfoDescription || "Update your personal information.",
        emailTitle: details.emailTitle || "Login Email:",
        emailNote: details.emailNote || "Your Login email can't be changed",
        discardButtonLabel: details.discardButtonLabel || "DISCARD",
        updateButtonLabel: details.updateButtonLabel || "UPDATE INFO",
        labels: {
          firstName: details.firstNameLabel || "FIRST NAME*",
          lastName: details.lastNameLabel || "LAST NAME*",
          email: details.emailLabel || "EMAIL*",
          phone: details.phoneLabel || "PHONE",
        },
      };
    }
  } catch (error) {
    logError("Error fetching account page details:", error);
  }

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