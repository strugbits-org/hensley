"use server";
/**
 * Payload CMS Authentication Service
 * Handles all authentication operations with the Payload CMS backend
 */

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL;
const CORE_API_KEY = process.env.CORE_API_KEY;
const CORE_TENANT_ID = process.env.CORE_TENTANT_ID;

/**
 * Login to Payload CMS
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{message: string, user: object, token: string, exp: number}>}
 */
export const payloadLogin = async (email, password) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CORE_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

/**
 * Register a new member in Payload CMS
 * @param {object} userData - { email, password, firstName, lastName }
 * @returns {Promise<object>}
 */
export const payloadRegister = async (userData) => {
  const { email, password, firstName, lastName, phone } = userData;
  
  const response = await fetch(`${CORE_API_BASE_URL}/api/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CORE_API_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      tenant: CORE_TENANT_ID,
      metadata: phone ? { phone } : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

/**
 * Get current member data using token
 * @param {string} token - Bearer token
 * @returns {Promise<{user: object, exp: number}>}
 */
export const payloadGetCurrentMember = async (token) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-api-key": CORE_API_KEY,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

/**
 * Send forgot password email
 * @param {string} email 
 * @returns {Promise<{message: string}>}
 */
export const payloadForgotPassword = async (email) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CORE_API_KEY,
    },
    body: JSON.stringify({ email }),
  });

  return response.json();
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise<object>}
 */
export const payloadResetPassword = async (token, password) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CORE_API_KEY,
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Password reset failed");
  }

  return response.json();
};

/**
 * Update member profile
 * @param {string} memberId - Member ID
 * @param {string} token - Bearer token
 * @param {object} updates - Profile updates
 * @returns {Promise<object>}
 */
export const payloadUpdateProfile = async (memberId, token, updates) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/${memberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "x-api-key": CORE_API_KEY,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Profile update failed");
  }

  return response.json();
};

/**
 * Refresh token
 * @param {string} token - Current bearer token
 * @returns {Promise<object>}
 */
export const payloadRefreshToken = async (token) => {
  const response = await fetch(`${CORE_API_BASE_URL}/api/members/refresh-token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-api-key": CORE_API_KEY,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

/**
 * Logout from Payload CMS
 * @param {string} token - Bearer token
 * @returns {Promise<void>}
 */
export const payloadLogout = async (token) => {
  await fetch(`${CORE_API_BASE_URL}/api/members/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-api-key": CORE_API_KEY,
    },
  });
};
