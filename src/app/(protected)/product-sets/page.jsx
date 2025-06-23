
import ProductSets from "@/components/Account/ProductSets";
import { fetchProductSetsData } from "@/services/admin";
import { logError, mapProductSetItems } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const response = await fetchProductSetsData();
        const processedData = response.map(item => {
            mapProductSetItems(item);
            const { setOfProduct, product, searchContent } = item;
            return { product, setOfProduct, searchContent };
        });
        return <ProductSets data={processedData} />;
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
