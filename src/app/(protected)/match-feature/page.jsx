
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    try {

        return (
            <h1>hello</h1>
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
