import { logError } from "@/utils";
import { payloadGetCurrentMember } from "./payloadAuth";

export const isAuthenticated = async (token) => {
  try {
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    // Validate token with Payload CMS
    const memberResponse = await payloadGetCurrentMember(token);
    
    if (!memberResponse || !memberResponse.user) {
      throw new Error("Unauthorized: Invalid token");
    }

    const memberData = memberResponse.user;

    const data = {
      memberId: memberData.id,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      phone: memberData.metadata?.phone || "",
      email: memberData.email,
      token, // Include the token for use in subsequent API calls
    };

    return data;
  } catch (error) {
    logError(error);
    if (error.message === "Token has expired" || error.message.includes("Unauthorized")) {
      throw new Error(error.message);
    }
    throw new Error(`Unauthorized: ${error.message}`);
  }
};