"use server";
/**
 * Payload CMS Authentication Service
 * Handles all authentication operations with the Payload CMS backend
 */

import { logError } from "@/utils";
import { apiKeySDK, CORE_API_BASE_URL, CORE_TENANT_ID } from "../payloadSDK";

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
      collection: 'members',
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
      collection: 'members',
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
  try {
    const response = await fetch(
      `${CORE_API_BASE_URL}/api/members/me?depth=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    logError("Error fetching current member:", error);
    return null;
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
      collection: 'members',
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
      collection: 'members',
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
        collection: 'members',
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
      { collection: 'members' },
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
      path: '/members/logout',
    }, { headers: { 'Authorization': `Bearer ${token}` } });
  } catch (error) {
    // Silently fail on logout
  }
};
