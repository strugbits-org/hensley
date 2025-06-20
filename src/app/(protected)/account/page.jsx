
import { MyAccount } from "@/components/Account/MyAccount/MyAccount";
import { fetchAccountPageDetails } from "@/services/auth";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        
        const response = await fetchAccountPageDetails();
        return (
            <MyAccount data={response}/>
        );
    } catch (error) {
        logError("Error fetching account details:", error);
        notFound();
    }
}
