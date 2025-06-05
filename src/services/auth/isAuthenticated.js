import jwt from "jsonwebtoken";
import { createWixClient, logError } from "@/utils";

export const isAuthenticated = async (token) => {
  try {

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    let decodedUserData;
    try {
      decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else {
        console.error("JWT verification failed:", err.message);
      }
    }

    const wixClient = await createWixClient();
    const response = await wixClient.items.query("Members/PrivateMembersData").eq("loginEmail", decodedUserData.email).find();
    const memberData = response.items[0];    

    if (!memberData) {
      throw new Error("Unauthorized: No matching user data");
    }

    const data = {
      memberId: memberData._id,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      phone: memberData.mainPhone,
    };

    return data;
  } catch (error) {
    logError(error);
    if (error.message === "Token has expired") {
      throw new Error(error.message);
    }
    throw new Error(`Unauthorized: ${error.message}`);
  }
};