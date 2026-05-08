import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { getMemberQuotes } from "@/services/quotes/payloadQuotes";
import { logError } from "@/utils";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const quotes = await getMemberQuotes(
      authenticatedUserData.memberId,
      authenticatedUserData.token
    );

    return NextResponse.json(
      {
        message: "Quotes data Successfully fetched",
        data: { items: quotes },
      },
      { status: 200 }
    );
  } catch (error) {
    logError("Error fetching quotes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
export const dynamic = "force-dynamic";
