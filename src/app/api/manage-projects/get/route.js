import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
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
      dataCollectionId: "PortfolioCollection",
      includeReferencedItems: ['portfolioRef', 'markets', 'studios', 'storeProducts', 'portfolioCategories'],
      sortKey: "order",
      limit: "infinite",
      ne: [
        {
          key: "isHidden",
          value: true
        }
      ]
    });

    return NextResponse.json(
      { message: "Success", data: response.items },
      { status: 200 }
    );
  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};