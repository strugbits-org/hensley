
import { MyAccount } from "@/components/Account/MyAccount/MyAccount";
import { fetchAccountPageDetails } from "@/services/auth";
import { fetchPageMetaData } from "@/services";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export async function generateMetadata() {
    try {
        const metaData = await fetchPageMetaData("account");
        const { title, robotsTag } = metaData;
        const metadata = { title };
        if (process.env.ENVIRONMENT === "PRODUCTION" && robotsTag) metadata.robots = robotsTag;
        return metadata;
    } catch (error) {
        logError("Error in metadata(account page):", error);
    }
}

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
