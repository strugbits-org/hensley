import ProductSorting from "@/components/Account/ProductSorting";
import { fetchAllCategoriesForSorting } from "@/services/subcategory";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const data = await fetchAllCategoriesForSorting();
        return (
            <ProductSorting data={data} />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
