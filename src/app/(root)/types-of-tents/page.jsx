import Tents from "@/components/Tents";
import { fetchTentListingPageDetails, fetchTentsData, fetchTentsWithProjectsAndBlogs } from "@/services"; // multiple services
import { fetchFeaturedBlogs, fetchTentPageData } from "@/services/tents";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {

    const projectandblog = await fetchTentsWithProjectsAndBlogs();

    const [tents, pageDetails] = await Promise.all([
      fetchTentsData(),
      fetchTentListingPageDetails()
    ]);

    console.log("The dynamic page details is: ",pageDetails);

    const data = {
      tents,
      projectandblog,
      pageDetails
    };

    return <Tents data={data}/>
    // return <h1>Hello World</h1>

  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
