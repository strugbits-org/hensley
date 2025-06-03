import { NextResponse } from "next/server";

import { authWixClient, createWixClientApiStrategy } from "@/Utils/CreateWixClient";
import logError from "@/Utils/ServerActions";

const fetchMemberData = async (client, collectionId, field, value) =>
  client.items.query(collectionId)
    .eq(field, value)
    .find();

export const POST = async (req) => {
  const body = await req.json();
  const { email } = body;

  try {
    const wixClient = await createWixClientApiStrategy();
    const authClient = await authWixClient();


    const [privateMemberResult, memberResult] = await Promise.allSettled([
      fetchMemberData(authClient, "Members/PrivateMembersData", "loginEmail", email),
      fetchMemberData(wixClient, "membersPassword", "userEmail", email),
    ]);

    const privateMemberData = privateMemberResult.status === "fulfilled" ? privateMemberResult.value : null;
    const memberData = memberResult.status === "fulfilled" ? memberResult.value : null;

    if (!privateMemberData?.items?.length || !memberData?.items?.length) {
      return NextResponse.json(
        { message: "Account with this email does not exist" },
        { status: 404 }
      );
    }

    const fullMemberData = privateMemberData.items[0];

    const currentDate = new Date();
    const twoHoursLater = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000);

    const formattedDate = twoHoursLater.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const userData = {
      ...memberData.items[0],
      emailToken: formattedDate,
    };

    const res = await wixClient.items.update("membersPassword", userData);
    const userId = res._id;

    const origin = process.env.BASE_URL;
    const resetUrl = `${origin}/reset-password?reset-id=${encodeURIComponent(
      userId
    )}`;

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: fullMemberData._id,
        variables: {
          name: fullMemberData.firstName,
          link: resetUrl,
        },
      }),
    };

    const response = await fetch(
      `${process.env.RENTALS_URL}/rentalsResetPassword`,
      options
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Email could not be sent" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email has been sent" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
