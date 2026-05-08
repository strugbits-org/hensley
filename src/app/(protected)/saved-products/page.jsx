
import SavedProducts from "@/components/Account/SavedProducts/SavedProducts";
import { logError } from "@/utils";
import { notFound } from "next/navigation";
import { queryProductCollections } from "@/services/payloadCollections";

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
