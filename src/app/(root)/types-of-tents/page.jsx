import Tents from "@/components/Tents";
import { fetchTentsData, fetchTentsWithProjectsAndBlogs } from "@/services"; // multiple services
import { fetchFeaturedBlogs, fetchTentPageData } from "@/services/tents";
import { logError } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  try {

    const projectandblog = await fetchTentsWithProjectsAndBlogs();
    console.log("response is the--: ",projectandblog);

    const [tents] = await Promise.all([
      fetchTentsData(),
    ]);

    console.log("--Tents is--",tents);

    const data = {
      tents,
      projectandblog,
    };

    return <Tents data={data}/>
    // return <h1>Hello World</h1>

  } catch (error) {
    logError("Error fetching product page data:", error);
    notFound();
  }
}
