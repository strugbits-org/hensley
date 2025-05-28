import Signup from "@/components/Signup";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
        <Signup />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
