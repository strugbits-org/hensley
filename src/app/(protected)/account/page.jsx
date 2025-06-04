
import { MyAccount } from "@/components/Account/MyAccount/MyAccount";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        return (
            <MyAccount />
        );
    } catch (error) {
        logError("Error fetching account details:", error);
        notFound();
    }
}
