import { fetchAllPagesMetaData } from "@/services";

export async function GET() {
  const BASE_URL = process.env.BASE_URL || 'https://www.hensleyeventresources.com';

  const pages = await fetchAllPagesMetaData();

  const page_routes = pages.reverse().map((x) => x.slug);
  const dynamicPages = ["collections", "posts", "product", "project", "subcategory", "tent", "pool-cover", "market"];
  const filtered_routes = page_routes.filter(route => !dynamicPages.includes(route));

  const sitemaps = filtered_routes.map((slug) => ({
    loc: slug === "home" ? BASE_URL : `${BASE_URL}/${slug}`,
    lastmod: new Date().toISOString(),
  }));

  const sitemapIndex = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps
      .map(
        (sitemap) => `
            <url>
              <loc>${sitemap.loc}</loc>
              <lastmod>${sitemap.lastmod}</lastmod>
            </url>
          `
      )
      .join('')}
    </urlset>
  `;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}