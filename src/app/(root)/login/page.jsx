import SignIn from "@/components/SignIn";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
      <SignIn />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
