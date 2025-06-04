
import ProductSets from "@/components/Account/ProductSets";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    try {

        return (
            <ProductSets />
        );
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
