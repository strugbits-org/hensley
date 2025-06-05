import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { logError } from "@/utils";
import queryCollection from "@/utils/fetchFunction";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await queryCollection({
      dataCollectionId: "QuoteRequest",
      eq: [
        {
          key: "memberId",
          value: authenticatedUserData.memberId
        }
      ],
      limit: "infinite",
    });

    return NextResponse.json(
      {
        message: "Quotes data Successfully fetched",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
export const dynamic = "force-dynamic";
