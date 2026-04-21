import PortfolioDetails from "@/components/PortfolioDetails";
import { fetchProjectPageData, fetchProjects, fetchSelectedProject } from "@/services/projects";
import { logError } from "@/utils";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    const projectData = await fetchProjectPageData(slug);
    const { project } = projectData;
    const { portfolioRef, meta } = project;

    const title = meta?.title || portfolioRef?.title || "Project";
    const description = meta?.description || project?.excerpt || project?.portfolioRef?.description?.slice(0, 160) || "";
    const imageUrl = meta?.image || portfolioRef?.heroImage || portfolioRef?.coverImage?.imageInfo || undefined;

    const metadata = { title, description };
    if (imageUrl) metadata.openGraph = { images: [{ url: imageUrl }] };
    if (process.env.ENVIRONMENT === "PRODUCTION" && project?.noFollowTag) {
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

export default async function Page({ params, searchParams }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      throw new Error("Slug is required");
    }

    // Draft preview support: bypass published filter when preview token is present
    const isPreview = !!(await searchParams)?.['payload-preview'];
    const data = isPreview
      ? await fetchProjectPageData(slug, { draft: true })
      : await fetchProjectPageData(slug);

    if (!data?.project) notFound();

    return (
      <PortfolioDetails data={data} />
    );
  } catch (error) {
    logError("Error fetching project page data:", error);
    notFound();
  }
};
