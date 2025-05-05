import { About } from "@/components/About";
import { logError } from "@/components/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    return (
      <About />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
