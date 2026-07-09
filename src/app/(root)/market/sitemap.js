import { fetchMarketsData } from "@/services";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const marketsData = await fetchMarketsData();
  const paths = (marketsData || [])
    .map((data) => {
      const raw = typeof data?.slug === "string" ? data.slug.trim() : "";
      const slug = raw.replace(/^\//, "");
      return slug ? { slug } : null;
    })
    .filter(Boolean);

  return paths.map(({ slug }) => ({
    url: `${BASE_URL}/market/${slug}`,
    lastModified: new Date(),
  }));
};