import { HomePage } from "@/components/Home";
import { fetchPageMetaData, buildPageMetadata } from "@/services";
import { fetchHomePageData } from "@/services/home";

export async function generateMetadata() {
  try {
    const metaData = await fetchPageMetaData("home");
    return buildPageMetadata(metaData);
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
