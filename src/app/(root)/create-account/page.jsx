import { SignupForm } from "@/components/Signup";
import { fetchSignupPageDetails } from "@/services/auth";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    
    const response = await fetchSignupPageDetails();

    console.log("Signup response: ",response);

    return (
      <SignupForm data={response}/>
    );
  } catch (error) {
    logError("Error fetching quote request form data:", error);
    notFound();
  }
}
