import Careers from "@/components/Careers";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  try {
    
    return (
        <Careers />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
