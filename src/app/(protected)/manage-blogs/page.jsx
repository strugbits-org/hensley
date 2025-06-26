
import ManageBlogs from "@/components/Account/ManageBlogs";
import { fetchBlogsData } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const data = await fetchBlogsData();
        return (
            <ManageBlogs data={data} />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
