import HeroSection from "./HeroSection"
import DreamTeam from "./DreamTeam"
import MeetFamily from "./MeetFamily"
import HowWeDoITSection from "./HowWeDoITSection"
import SliderComponent from "../common/SliderComponent"

export const About = ({ data }) => {
    const { heroSectionData, howWeDoItData, dreamTeamData, familySectionData, portfolioData, aboutPageDetails } = data

    const { meetFamilyTitle, dreamTeamTitle, howWeDoItTitle } = aboutPageDetails

    console.log("meetingfamily: ", meetFamilyTitle);

    const pageDetails = {
        buttonLabelPortfolioSlider: "View Portfolio",
    }

    return (
        <>
            <HeroSection heroSectionData={heroSectionData} />
            <HowWeDoITSection data={howWeDoItData} pageTitle={howWeDoItTitle} />
            <div className="h-screen lg:mt-[100px] lg:pl-[15px] lg:pr-[15px] border">
                <SliderComponent data={portfolioData} pageDetails={pageDetails} />
            </div>
            <DreamTeam dreamTeamData={dreamTeamData} pageTitle={dreamTeamTitle} />
            <MeetFamily data={familySectionData} pageTitle={meetFamilyTitle} />
        </>
    )
}