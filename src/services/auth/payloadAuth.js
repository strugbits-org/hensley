"use server";
/**
 * Payload CMS Authentication Service
 * Handles all authentication operations with the Payload CMS backend
 */

import { logError } from "@/utils";
import { apiKeySDK, CORE_API_BASE_URL, CORE_TENANT_ID, MEMBER_COLLECTION } from "../payloadSDK";

const sdk = apiKeySDK();

/**
 * Login to Payload CMS
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{message: string, user: object, token: string, exp: number}>}
 */
export const payloadLogin = async (email, password) => {
  try {
    const result = await sdk.login({
      collection: MEMBER_COLLECTION,
      data: { email, password },
    });
    return result;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

/**
 * Register a new member in Payload CMS
 * @param {object} userData - { email, password, firstName, lastName }
 * @returns {Promise<object>}
 */
export const payloadRegister = async (userData) => {
  const { email, password, firstName, lastName, phone } = userData;
  
  try {
    const result = await sdk.create({
      collection: MEMBER_COLLECTION,
      data: {
        email,
        password,
        firstName,
        lastName,
        tenant: CORE_TENANT_ID,
        metadata: phone ? { phone } : undefined,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

/**
 * Get current member data using token
 * @param {string} token - Bearer token
 * @returns {Promise<{user: object, exp: number}>}
 */
export const payloadGetCurrentMember = async (token) => {
  const startedAt = Date.now();
  try {
    const response = await fetch(
      `${CORE_API_BASE_URL}/api/${MEMBER_COLLECTION}/me?depth=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (response.ok) {
      return await response.json();
    }

    // Genuine authentication failure: the token is rejected. Logging the user
    // out is the correct response here.
    if (response.status === 401 || response.status === 403) {
      return null;
    }

    // Anything else (5xx, 429, gateway/timeouts surfaced as a status, etc.) is a
    // transient Core problem, NOT an auth failure. Treating it as a logout is the
    // production reload-logout bug. Throw a CORE_TRANSIENT error whose message
    // intentionally does NOT contain "unauthorized" so the route maps it to 500
    // and the session is preserved.
    const latencyMs = Date.now() - startedAt;
    // Failure-only, always-on so it surfaces in Vercel runtime logs without DEBUG_LOGS.
    console.error("[AUTH-DEBUG] /me NOT OK", {
      status: response.status,
      statusText: response.statusText,
      latencyMs,
    });
    const transient = new Error(
      `CORE_TRANSIENT: /me returned ${response.status} ${response.statusText}`
    );
    transient.code = "CORE_TRANSIENT";
    transient.status = response.status;
    throw transient;
  } catch (error) {
    if (error?.code === "CORE_TRANSIENT") throw error;

    // Network error / fetch threw / timeout — also transient, not an auth failure.
    const latencyMs = Date.now() - startedAt;
    console.error("[AUTH-DEBUG] /me fetch threw", {
      name: error?.name,
      message: error?.message,
      latencyMs,
    });
    logError("Error fetching current member:", error);
    const transient = new Error(
      `CORE_TRANSIENT: /me fetch failed (${error?.name || "Error"}: ${error?.message || "unknown"})`
    );
    transient.code = "CORE_TRANSIENT";
    throw transient;
  }
};

/**
 * Send forgot password email
 * @param {string} email 
 * @returns {Promise<{message: string}>}
 */
export const payloadForgotPassword = async (email) => {
  try {
    const result = await sdk.forgotPassword({
      collection: MEMBER_COLLECTION,
      data: { email },
    });
    return result;
  } catch (error) {
    return { message: error.message || "Failed to send reset email" };
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise<object>}
 */
export const payloadResetPassword = async (token, password) => {
  try {
    const result = await sdk.resetPassword({
      collection: MEMBER_COLLECTION,
      data: { token, password },
    });
    return result;
  } catch (error) {
    throw new Error(error.message || "Password reset failed");
  }
};

/**
 * Update member profile
 * @param {string} memberId - Member ID
 * @param {string} token - Bearer token
 * @param {object} updates - Profile updates
 * @returns {Promise<object>}
 */
export const payloadUpdateProfile = async (memberId, token, updates) => {
  try {
    const result = await sdk.update(
      {
        collection: MEMBER_COLLECTION,
        id: memberId,
        data: updates,
      },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return result;
  } catch (error) {
    throw new Error(error.message || "Profile update failed");
  }
};

/**
 * Refresh token
 * @param {string} token - Current bearer token
 * @returns {Promise<object>}
 */
export const payloadRefreshToken = async (token) => {
  try {
    const result = await sdk.refreshToken(
      { collection: MEMBER_COLLECTION },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return result;
  } catch (error) {
    return null;
  }
};

/**
 * Logout from Payload CMS
 * @param {string} token - Bearer token
 * @returns {Promise<void>}
 */
export const payloadLogout = async (token) => {
  try {
    await sdk.request({
      method: 'POST',
      path: `/${MEMBER_COLLECTION}/logout`,
    }, { headers: { 'Authorization': `Bearer ${token}` } });
  } catch (error) {
    // Silently fail on logout
  }
};
