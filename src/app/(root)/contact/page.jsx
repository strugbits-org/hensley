import Contact from "@/components/Contact";
import { fetchContactPageData } from "@/services/contact/contact";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const data = await fetchContactPageData();


    return (
      <Contact data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
