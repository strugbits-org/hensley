import { logError } from "@/components/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    return (
      <h1>{slug}</h1>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
