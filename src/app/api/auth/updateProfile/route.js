import { NextResponse } from "next/server";

import handleAuthentication from "@/Utils/HandleAuthentication";
import { authWixClient } from "@/Utils/CreateWixClient";
import logError from "@/Utils/ServerActions";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);

    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;
    const { memberId, permissions } = authenticatedUserData;

    const wixClient = await authWixClient();

    const updatedData = {
      contact: {
        firstName: firstName,
        lastName: lastName,
        phones: [phone],
      },
    };

    const response = await wixClient.members.updateMember(
      memberId,
      updatedData
    );

    const finalData = {
      loginEmail: response.loginEmail,
      firstName: response.contact.firstName,
      lastName: response.contact.lastName,
      mainPhone: response.contact.phones[0],
      memberId,
      permissions
    };

    return NextResponse.json(
      { message: "Profile updated successfully", updatedMember: finalData },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
