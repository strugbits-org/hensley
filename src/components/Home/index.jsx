import { Banner } from "../common/Banner";
import OurCategories from "../common/OurCategories";
import { BestSellers } from "./BestSellers";
import { HeroSection } from "./HeroSection"
import OurProjects from "./OurProjects";

export const HomePage = ({ data }) => {
    const { homePageDetails, heroSectionData, categoriesData, portfolioData, bannerData, bestSellers } = data;
    return (
        <>
            <HeroSection data={heroSectionData} />
            <OurCategories data={categoriesData} pageDetils={homePageDetails} />
            <OurProjects data={portfolioData} pageDetils={homePageDetails} />
            <Banner data={bannerData} />
            <BestSellers data={bestSellers} />
        </>
    )
}
