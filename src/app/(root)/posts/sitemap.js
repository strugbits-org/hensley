import { fetchBlogs } from "@/services/blogs";
const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const blogData = await fetchBlogs();
  const paths = blogData.map((data) => ({ slug: data.slug.trim().replace("/", "") }));
  const sitemap = paths.map(({ slug }) => ({
    url: `${BASE_URL}/posts/${slug}`,
    lastModified: new Date(),
  }));

  return [...sitemap];
};