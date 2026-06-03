import { fetchProductPaths } from "@/services/products";

const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  // Tents and pool covers have their own canonical sitemaps/routes
  // (/tent, /pool-covers) — keep them out of the product sitemap so each
  // product is advertised under a single canonical URL.
  const paths = await fetchProductPaths({ excludeTypes: ["tent", "pool_cover"] });
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};