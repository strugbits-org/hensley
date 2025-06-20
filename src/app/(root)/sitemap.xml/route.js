export async function GET() {
  const baseUrl = process.env.BASE_URL || 'https://www.hensleyeventresources.com';

  const sitemaps = [
    { loc: `${baseUrl}/pages-sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/collections/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/posts/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/product/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/project/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/subcategory/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/tent/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/pool-cover/sitemap.xml`, lastmod: new Date().toISOString() },
    { loc: `${baseUrl}/market/sitemap.xml`, lastmod: new Date().toISOString() },
  ];

  const sitemapIndex = `
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemaps
      .map(
        (sitemap) => `
              <sitemap>
                <loc>${sitemap.loc}</loc>
                <lastmod>${sitemap.lastmod}</lastmod>
              </sitemap>
            `
      )
      .join('')}
      </sitemapindex>
    `;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}


//   <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" generatedBy="WIX">
// <sitemap>
// <loc>https://www.hensleyeventresources.com/store-products-sitemap.xml</loc>
// <lastmod>2025-06-18</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/store-categories-sitemap.xml</loc>
// <lastmod>2025-06-19</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/blog-posts-sitemap.xml</loc>
// <lastmod>2025-06-11</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/dynamic-market-sitemap.xml</loc>
// <lastmod>2025-05-08</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/portfolio-projects-sitemap.xml</loc>
// <lastmod>2024-12-18</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/dynamic-project-sitemap.xml</loc>
// <lastmod>2025-06-19</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/dynamic-posts-sitemap.xml</loc>
// <lastmod>2025-06-11</lastmod>
// </sitemap>
// <sitemap>
// <loc>https://www.hensleyeventresources.com/pages-sitemap.xml</loc>
// <lastmod>2025-06-02</lastmod>
// </sitemap>
// </sitemapindex>