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

    const data = await queryCollection({
      dataCollectionId: "ProductsSearchContent",
      hasSome: [
        {
          key: "members",
          values: [authenticatedUserData.memberId]
        }
      ],
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
