import { fetchBlogs } from "@/services/blogs";
const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  const blogData = await fetchBlogs();
  const paths = (blogData || [])
    .map((data) => {
      const raw = typeof data?.slug === "string" ? data.slug.trim() : "";
      const slug = raw.replace(/^\//, "");
      return slug ? { slug } : null;
    })
    .filter(Boolean);

  return paths.map(({ slug }) => ({
    url: `${BASE_URL}/posts/${slug}`,
    lastModified: new Date(),
  }));
};