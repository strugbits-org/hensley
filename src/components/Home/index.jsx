import OurCategories from "../common/OurCategories";
import { HeroSection } from "./HeroSection"

export const HomePage = ({ data }) => {
    const { heroSectionData, categoriesData } = data;
    return (
        <>
            <HeroSection data={heroSectionData} />
            <OurCategories data={categoriesData} />
        </>
    )
}
