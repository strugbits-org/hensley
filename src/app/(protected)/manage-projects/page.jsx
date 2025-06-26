import ManageProjects from "@/components/Account/ManageProjects";
import { fetchManageProjectsData } from "@/services/admin";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const data = await fetchManageProjectsData();
        return (
            <ManageProjects data={data} />
        );
    } catch (error) {
        logError("Error fetching manage projects data:", error);
        notFound();
    }
}

export const dynamic = "force-dynamic";