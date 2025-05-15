import { Banner } from "../common/Banner";
import OurCategories from "../common/OurCategories";
import ContactUs from "../Modals/ContactUs";
import { BestSellers } from "./BestSellers";
import { HeroSection } from "./HeroSection"
import OurProjects from "./OurProjects";
import { Testimonials } from "./Testimonials";

export const HomePage = ({ data }) => {
    const { homePageDetails, heroSectionData, categoriesData, portfolioData, bannerData, bestSellers, testimonials } = data;
    return (
        <>
            {/* <HeroSection data={heroSectionData} />
            <OurCategories data={categoriesData} pageDetils={homePageDetails} />
            <OurProjects data={portfolioData} pageDetils={homePageDetails} />
            <Banner data={bannerData} /> */}
            {/* <BestSellers data={bestSellers} pageDetils={homePageDetails} /> */}
            <ContactUs />
            <BestSellers data={bestSellers} pageDetils={homePageDetails} />
            <Testimonials data={testimonials} pageDetils={homePageDetails} />
        </>
    )
}
