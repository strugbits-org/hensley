import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import queryCollection from "@/utils/fetchFunction";
import { logError } from "@/utils";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);

    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const payload = {
      dataCollectionId: "ProductsSearchContent",
      hasSome: [
        {
          key: "members",
          values: [authenticatedUserData.memberId]
        }
      ],
    };
    console.log("body.includeProducts", body.includeProducts);
    
    if (body.includeProducts) {
      payload.includeReferencedItems = ["product"];
    }

    const data = await queryCollection(payload);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
