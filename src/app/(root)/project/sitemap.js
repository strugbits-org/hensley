import { fetchProjects } from "@/services/projects";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const projectData = await fetchProjects();
  const paths = projectData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/project/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};