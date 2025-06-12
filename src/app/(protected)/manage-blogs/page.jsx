
import ManageBlogs from "@/components/Account/ManageBlogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        return (
            <ManageBlogs />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
