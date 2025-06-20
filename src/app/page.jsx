import { HomePage } from "@/components/Home";
import { fetchPageMetaData } from "@/services";
import { fetchHomePageData } from "@/services/home";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("home");
    const { title, noFollowTag } = metaData;
    const metadata = { title };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) metadata.robots = "noindex,nofollow";
    return metadata;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}

export default async function Home() {
  const data = await fetchHomePageData();

  return (
    <HomePage data={data} />
  );
}
