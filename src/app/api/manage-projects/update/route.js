import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {

    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { _id, storeProducts, markets, studios } = await req.json();
    const { memberId } = authenticatedUserData;


    const wixClient = await createWixClient();
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds?.[0]?.badgeIds || [];

    if (!badgeIds.includes(process.env.ADMIN_BADGE_ID)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const productIds = storeProducts?.map(item => item._id) || [];
    const studioIds = studios?.map(item => item._id) || [];
    const marketIds = markets?.map(item => item._id) || [];

    await Promise.all([
      wixClient.items.replaceReferences("PortfolioCollection", "storeProducts", _id, productIds),
      wixClient.items.replaceReferences("PortfolioCollection", "studios", _id, studioIds),
      wixClient.items.replaceReferences("PortfolioCollection", "markets", _id, marketIds)
    ]);

    return NextResponse.json({
      message: "Project successfully updated",
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};