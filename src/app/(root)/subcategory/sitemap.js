const BASE_URL = process.env.BASE_URL;

export default async function sitemap() {
  // const categoriesData = await fetchAllCategoriesData();
  // const paths = getAllCategoriesPaths(categoriesData);
  const paths = [];

  const subCategories = paths.map((slug) => ({
    url: `${BASE_URL}/subCategory/${slug}`,
    lastModified: new Date(),
  }));

  return [...subCategories];
}
