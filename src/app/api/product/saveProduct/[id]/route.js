import { NextResponse } from "next/server";
import handleAuthentication from "@/services/auth/handleAuthentication";
import { saveProduct } from "@/services/savedProducts/payloadSavedProducts";
import { logError } from "@/utils";

export const GET = async (req, context) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);

    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { params } = context;
    const productId = params.id;

    const result = await saveProduct(
      authenticatedUserData.memberId,
      productId,
      authenticatedUserData.token
    );

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
