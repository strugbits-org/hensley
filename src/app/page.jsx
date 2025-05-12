import { HomePage } from "@/components/Home";
import { fetchHomePageData } from "@/services/home";

export default async function Home() {
  const data = await fetchHomePageData();

  return (
    <HomePage data={data} />
  );
}
