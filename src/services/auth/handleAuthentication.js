import { logError } from "@/utils";
import { isAuthenticated } from "./IsAuthenticated";

async function handleAuthentication(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const authenticatedUserData = await isAuthenticated(token);
    if (!authenticatedUserData) {
      throw new Error("Unauthorized access");
    }
    return authenticatedUserData;
  } catch (error) {
    logError("Authentication error:", error);
    throw new Error(error.message);
  }
}

export default handleAuthentication;
