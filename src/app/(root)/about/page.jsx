import { logError } from "@/components/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    return (
      <h1 className="">About</h1>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
