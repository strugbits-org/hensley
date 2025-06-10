import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
    try {
        const { name } = params;

        const wixClient = await createWixClient();

        if (name === "contact" || name === "newsletter") {
            const id = name === "contact" ? process.env.CONTACT_FORM_ID_WIX : process.env.NEWSLETTER_ID_WIX;
            const data = await req.json()

            const response = await wixClient.submissions.createSubmission({
                formId: id,
                status: "CONFIRMED",
                submissions: data,
            });
            return NextResponse.json(response, { status: 200 });
        } else {
            throw new Error("Invalid form name");
        }
    } catch (error) {
        logError(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};