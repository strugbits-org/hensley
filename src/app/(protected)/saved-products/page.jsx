
import MyAccount from "@/components/Account/MyAccount/MyAccount";
import SavedProducts from "@/components/Account/SavedProducts/SavedProducts";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    try {

        return (
            <SavedProducts />
        );
    } catch (error) {
        logError("Error fetching save products:", error);
        notFound();
    }
}
