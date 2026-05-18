
import SavedProducts from "@/components/Account/SavedProducts/SavedProducts";
import { fetchPageMetaData } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { queryProductCollections } from "@/services/payloadCollections";

export async function generateMetadata() {
    try {
        const metaData = await fetchPageMetaData("saved-products");
        const { title, robotsTag } = metaData;
        const metadata = { title };
        if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
        return metadata;
    } catch (error) {
        logError("Error in metadata(saved-products page):", error);
    }
}

export default async function Page() {
    try {
        const allCollections = await queryProductCollections().catch(() => []);

        return (
            <SavedProducts allCollections={allCollections} />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
