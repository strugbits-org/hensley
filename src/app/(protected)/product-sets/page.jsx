
import ProductSets from "@/components/Account/ProductSets";
import { fetchProductSetsData } from "@/services/admin";
import { fetchAllProducts } from "@/services/products";
import { logError, mapProductSetItems } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const [productSetsData, products] = await Promise.all([
            fetchProductSetsData(),
            fetchAllProducts()
        ]);
        const processedData = productSetsData.map(item => {
            mapProductSetItems(item);
            const { _id, setOfProduct, product, searchContent } = item;
            return { _id, product, setOfProduct, searchContent };
        });
        return <ProductSets data={processedData} products={products} />;
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
