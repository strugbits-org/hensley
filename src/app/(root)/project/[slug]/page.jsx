import PortfolioDetails from "@/components/PortfolioDetails";
import { fetchPageMetaData } from "@/services";
import { fetchProjectPageData, fetchProjects } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);

    const [
      metaData,
      projectData
    ] = await Promise.all([
      fetchPageMetaData("projects"),
      fetchProjectPageData(slug)
    ]);

    const { title, noFollowTag } = metaData;
    const { project } = projectData;
    const { portfolioRef } = project;
    const fullTitle = portfolioRef?.title + " " + title;
    const metadata = { title: fullTitle };
    if (process.env.ENVIRONMENT === "PRODUCTION" && noFollowTag) {
      metadata.robots = "noindex,nofollow";
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(project page):", error);
  }
}

export const generateStaticParams = async () => {
  try {
    const projectData = await fetchProjects();
    const paths = projectData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
    return paths;
  } catch (error) {
    logError("Error generating static params(project page):", error);
    return [];
  }
}

export default async function Page({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }
    const data = await fetchProjectPageData(slug);

    return (
      <PortfolioDetails data={data} />
    );
  } catch (error) {
    logError("Error fetching category page data:", error);
    notFound();
  }
};