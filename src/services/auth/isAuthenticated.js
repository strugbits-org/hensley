import jwt from "jsonwebtoken";
import { createWixClient, logError } from "@/utils";

export const isAuthenticated = async (token) => {
  try {

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else {
        console.error("JWT verification failed:", err.message);
      }
    }

    const wixClient = await createWixClient();

    const [privateMemberData, memberData] = await Promise.all([
      wixClient.items
        .query("Members/PrivateMembersData")
        .eq("loginEmail", decoded.email)
        .find(),

      wixClient.items
        .query("membersPassword")
        .eq("userEmail", decoded.email)
        .find()
    ]);

    const id = privateMemberData.items?.[0]?._id;

    const loggedInUserData = {
      ...memberData.items[0],
      memberId: id,
      firstName: privateMemberData.items[0].firstName,
      lastName: privateMemberData.items[0].lastName,
      phone: privateMemberData.items[0].mainPhone,
    };

    if (memberData.items.length === 0) {
      throw new Error("Unauthorized: No matching user data");
    }

    return loggedInUserData;
  } catch (error) {
    logError(error);
    if (error.message === "Token has expired") {
      throw new Error(error.message);
    }
    throw new Error(`Unauthorized: ${error.message}`);
  }
};