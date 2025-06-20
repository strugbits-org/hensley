import { fetchProductPaths } from "@/services/products";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const paths = await fetchProductPaths();
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};