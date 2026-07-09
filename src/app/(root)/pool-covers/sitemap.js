import { fetchPoolCovers } from "@/services/poolcover";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const poolCovers = await fetchPoolCovers();
  const paths = (poolCovers || [])
    .map((data) => {
      const raw = typeof data?.slug === "string" ? data.slug.trim() : "";
      const slug = raw.replace(/^\//, "");
      return slug ? { slug } : null;
    })
    .filter(Boolean);

  return paths.map(({ slug }) => ({
    url: `${BASE_URL}/pool-covers/${slug}`,
    lastModified: new Date(),
  }));
};