
import ManageBlogs from "@/components/Account/ManageBlogs";
import { fetchManageBlogsData } from "@/services/admin";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const data = await fetchManageBlogsData();
        return (
            <ManageBlogs data={data} />
        );
    } catch (error) {
        logError("Error fetching manage blogs data:", error);
        notFound();
    }
}

export const dynamic = "force-dynamic";