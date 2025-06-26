
import ProductSets from "@/components/Account/ProductSets";
import { fetchProductSetsData } from "@/services/admin";
import { fetchAllProducts } from "@/services/products";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const [productSetsData, products] = await Promise.all([
            fetchProductSetsData(),
            fetchAllProducts()
        ]);

        return <ProductSets data={productSetsData} products={products} />;
    } catch (error) {
        logError("Error fetching Quotes History:", error);
        notFound();
    }
}
