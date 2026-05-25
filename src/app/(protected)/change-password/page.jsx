
import ChangePassword from "@/components/Account/ChangePassword/ChangePassword";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
    try {
        const metaData = await fetchPageMetaData("change-password");
        return buildPageMetadata(metaData);
    } catch (error) {
        logError("Error in metadata(change-password page):", error);
    }
}

export default async function Page() {
    try {
        return (
            <ChangePassword />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
