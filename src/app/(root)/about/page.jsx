import { About } from "@/components/About";
import { fetchAboutPageData } from "@/services/about";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page() {  
  try {
    const data = await fetchAboutPageData();

    console.log("The data is the: ",data);
    
    return (
      <About data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}

export const dynamic = "force-dynamic";