import { Category } from "@/components/Category";
import { logError } from "@/components/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    return (
        <Category />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
