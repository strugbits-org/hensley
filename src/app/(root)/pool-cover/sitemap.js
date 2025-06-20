import { fetchPoolCovers } from "@/services/poolcover";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const poolCovers = await fetchPoolCovers();
  const paths = poolCovers.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/pool-cover/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};