import { fetchSubCategoryPagePaths } from "@/services/subcategory";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const paths = await fetchSubCategoryPagePaths();
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/subcategory/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};