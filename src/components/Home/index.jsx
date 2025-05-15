import { Banner } from "../common/Banner";
import { MarketSection } from "../common/MarketSection";
import OurCategories from "../common/OurCategories";
import { BestSellers } from "./BestSellers";
import { HeroSection } from "./HeroSection"
import OurProjects from "./OurProjects";
import { Testimonials } from "./Testimonials";

export const HomePage = ({ data }) => {
    const { homePageDetails, heroSectionData, categoriesData, portfolioData, bannerData, bestSellers, testimonials, marketsData } = data;
    return (
        <>
            {/* <HeroSection data={heroSectionData} />
            <OurCategories data={categoriesData} pageDetails={homePageDetails} />
            <OurProjects data={portfolioData} pageDetails={homePageDetails} />
            <Banner data={bannerData} />
            <BestSellers data={bestSellers} pageDetails={homePageDetails} />
            <Testimonials data={testimonials} pageDetails={homePageDetails} /> */}
            <MarketSection data={marketsData} pageDetails={homePageDetails} />
        </>
    )
}
