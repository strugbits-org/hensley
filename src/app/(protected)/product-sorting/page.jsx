
import ManageBlogs from "@/components/Account/ManageBlogs";
import ProductSorting from "@/components/Account/ProductSorting";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        return (
            <ProductSorting />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
