import Login from "@/components/Login";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    return (
      <Login isLightbox={false} />
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
