
import ChangePassword from "@/components/Account/ChangePassword/ChangePassword";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        return (
            <ChangePassword />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
