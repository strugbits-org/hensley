import { fetchCollectionPagePaths } from "@/services/collections";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const paths = await fetchCollectionPagePaths();
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/collections/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};