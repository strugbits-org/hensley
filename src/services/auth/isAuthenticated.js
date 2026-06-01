import { logError } from "@/utils";
import { getPayloadMemberBadgeSlugs, payloadMemberHasBadge } from "./payloadBadges";
import { payloadGetCurrentMember } from "./payloadAuth";

export const isAuthenticated = async (token) => {
  try {
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    // Validate token with Payload CMS
    const memberResponse = await payloadGetCurrentMember(token);
    
    // Handle different response structures from Payload
    // Could be { user: {...} } or direct user object
    const memberData = memberResponse?.user || memberResponse;
    
    if (!memberData || !memberData.id) {
      throw new Error("Unauthorized: Invalid token");
    }

    const badgeSlugs = getPayloadMemberBadgeSlugs(memberData);

    const data = {
      memberId: memberData.id,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      phone: memberData.metadata?.phone || "",
      email: memberData.email,
      badges: memberData.badges || [],
      badgeSlugs,
      isAdmin: payloadMemberHasBadge(memberData),
      token, // Include the token for use in subsequent API calls
    };

    return data;
  } catch (error) {
    logError(error);

    // Transient Core failure surfaced by payloadGetCurrentMember — NOT an auth
    // failure. Re-throw as-is (its message has no "unauthorized"), so the route
    // maps it to 500 and the session is preserved instead of being wiped.
    if (error?.code === "CORE_TRANSIENT") {
      console.error("[AUTH-DEBUG] isAuthenticated transient, preserving session", {
        message: error.message,
      });
      throw error;
    }

    // Genuine auth failures stay 401 → caller logs the user out.
    if (error.message === "Token has expired" || error.message.includes("Unauthorized")) {
      throw new Error(error.message);
    }

    // Unknown errors: treat conservatively as transient (non-auth) so an
    // unexpected blip never silently logs a valid user out. The message is left
    // intact (no "unauthorized") so the route returns 500.
    console.error("[AUTH-DEBUG] isAuthenticated unknown error, preserving session", {
      name: error?.name,
      message: error?.message,
    });
    throw error;
  }
};