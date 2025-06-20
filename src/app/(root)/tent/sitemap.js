import { fetchTentsData } from "@/services";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
    const tentsData = await fetchTentsData();
    const paths = tentsData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/tent/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};