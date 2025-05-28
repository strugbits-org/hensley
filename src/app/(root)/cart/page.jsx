import Cart from "@/components/Cart";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {

    return (
      <Cart />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
