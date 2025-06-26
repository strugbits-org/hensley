import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError, mapProductSetItems } from "@/utils";
import queryCollection from "@/utils/fetchFunction";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const memberId = authenticatedUserData.memberId;

    const wixClient = await createWixClient();
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds[0]?.badgeIds || [];
    const adminBadgeId = process.env.ADMIN_BADGE_ID;
    const isAdmin = badgeIds.includes(adminBadgeId);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await queryCollection({
      dataCollectionId: "MultipleProductsSet",
      includeReferencedItems: ["product", "products"],
      limit: "infinite",
    });

    if (!response || !response.items) {
      throw new Error(`Response does not contain items array`);
    }

    const processedData = response.items.filter(item => typeof item.product !== "string" && item.product).map(item => {
      const setOfProduct = mapProductSetItems(item);
      const { _id, product, searchContent } = item;
      return { _id, product, setOfProduct, searchContent };
    });

    return NextResponse.json(
      { message: "Success", data: processedData },
      { status: 200 }
    );
  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};