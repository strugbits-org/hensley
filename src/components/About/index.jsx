import HeroSection from "./HeroSection"
import AboutSection from "./AboutSection"
import SliderSection from "./SliderSection"
import DreamTeam from "./DreamTeam"
import MeetFamily from "./MeetFamily"
import HowWeDoITSection from "./HowWeDoITSection"
import SliderComponent from "../common/SliderComponent"

export const About = ({data}) => {
    const {heroSectionData,howWeDoItData,dreamTeamData,familySectionData,portfolioData} = data
    console.log("meet family",familySectionData);
    const pageDetails = {
        buttonLabelPortfolioSlider: "View Portfolio",
    }
   
    return (
        <>
            <HeroSection heroSectionData={heroSectionData}/>
            <HowWeDoITSection data={howWeDoItData}/>
            <div className="h-screen lg:mt-[100px] lg:pl-[15px] lg:pr-[15px] border">
                <SliderComponent data={portfolioData} pageDetails={pageDetails} />
            </div>
            <DreamTeam dreamTeamData={dreamTeamData}/>
            <MeetFamily data={familySectionData}/>
        </>
    )
}