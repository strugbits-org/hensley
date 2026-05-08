import { fetchTentsData } from "@/services";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
    const tentsData = await fetchTentsData();
    if (!Array.isArray(tentsData)) return [];

    const paths = tentsData.map((data) => {
      const rawSlug = data.slug || data.tent?.slug || "";
      return { slug: rawSlug.replace(/^\//, "").trim() };
    });

  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/tent/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};