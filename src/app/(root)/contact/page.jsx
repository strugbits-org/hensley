import Contact from "@/components/Contact";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
        <Contact />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
