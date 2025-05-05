import { HomePage } from "@/components/Home";
import { fetchHeaderData } from "@/services";

export default async function Home() {

  const data = await fetchHeaderData();
  console.log("data", data);
  
  return (
    <HomePage />
  );
}
