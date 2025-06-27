import handleAuthentication from "@/services/auth/handleAuthentication";
import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {

    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await req.json();
    const { memberId } = authenticatedUserData;


    const wixClient = await createWixClient();
    const badgesResponse = await wixClient.badges.listBadgesPerMember([memberId]);
    const badgeIds = badgesResponse?.memberBadgeIds?.[0]?.badgeIds || [];

    if (!badgeIds.includes(process.env.ADMIN_BADGE_ID)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await wixClient.items.bulkUpdate("FullProductData", products);
    

    return NextResponse.json({
      message: "Product sorting successfully updated",
      products
    }, { status: 200 });

  } catch (error) {
    logError("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};