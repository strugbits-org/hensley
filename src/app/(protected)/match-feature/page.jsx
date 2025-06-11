
import MatchFeature from "@/components/Account/MatchFeature";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    try {

        return (
            <MatchFeature />
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
