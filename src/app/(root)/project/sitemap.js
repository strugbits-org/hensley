import { fetchProjects } from "@/services/projects";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const projectData = await fetchProjects();
  const paths = (projectData || [])
    .map((data) => {
      const raw = typeof data?.slug === "string" ? data.slug.trim() : "";
      const slug = raw.replace(/^\//, "");
      return slug ? { slug } : null;
    })
    .filter(Boolean);

  return paths.map(({ slug }) => ({
    url: `${BASE_URL}/project/${slug}`,
    lastModified: new Date(),
  }));
};