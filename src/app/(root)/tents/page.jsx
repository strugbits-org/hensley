import Tents from "@/components/Tents";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {

    return (
        <Tents />
    );
  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
