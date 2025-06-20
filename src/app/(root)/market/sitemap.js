import { fetchMarketsData } from "@/services";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const marketsData = await fetchMarketsData();
  const paths = marketsData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/market/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};