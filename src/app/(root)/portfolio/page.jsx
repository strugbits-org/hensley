import Portfolio from "@/components/Portfolio";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  try {
    
    return (
        <Portfolio />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
