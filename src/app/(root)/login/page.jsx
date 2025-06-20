import Login from "@/components/Login";
import { fetchLoginPageDetails } from "@/services/auth";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {

    const response = await fetchLoginPageDetails();

    console.log("the login response is the: ",response);

    return (
      <Login isLightbox={false} data={response}/>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
