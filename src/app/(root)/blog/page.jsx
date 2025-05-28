import Blogs from "@/components/Blogs";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({params}) {
  try {
    
    return (
      <Blogs />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
}
