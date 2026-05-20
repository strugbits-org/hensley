import { PayloadSDK } from "@payloadcms/sdk";

export const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || "";
export const CORE_API_KEY = process.env.CORE_API_KEY || "";
export const CORE_TENANT_ID = process.env.CORE_TENANT_ID || "";

// Core auth collection holding Hensley members ("Hensley Customers")
// so the same email can exist on both
// platforms. Centralised here so a slug change is a single edit.
// See bps-core docs/architecture/multi-platform-members.md.
export const MEMBER_COLLECTION = process.env.CORE_MEMBER_COLLECTION || "customers";

export const ensureCoreTenantId = () => {
  if (!CORE_TENANT_ID) {
    throw new Error("Missing CORE_TENANT_ID environment variable");
  }
};

export const getSDK = (token = null) => {
  const authorization = token ? `Bearer ${token}` : `Bearer ${CORE_API_KEY}`;
  return new PayloadSDK({
    baseURL: `${CORE_API_BASE_URL}/api`,
    baseInit: { headers: { Authorization: authorization } },
  });
};

export const apiKeySDK = () => getSDK(null);
