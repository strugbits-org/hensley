import Careers from "@/components/Careers";
import { fetchCareersPageData } from "@/services/careers";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  const data = await fetchCareersPageData();


  try {
    return (
        <Careers data={data}/>
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
