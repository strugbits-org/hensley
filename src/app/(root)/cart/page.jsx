import Cart from "@/components/Cart";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    return <Cart />;
  } catch (error) {
    logError("Error fetching cart page data:", error);
    notFound();
  }
}
