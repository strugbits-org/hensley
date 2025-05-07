import HeroSection from "./HeroSection"
import AboutSection from "./AboutSection"
import PortfolioSection from "./PortfolioSection"
import SliderSection from "./SliderSection"
import ProfileCards from "./ProfileCards"
import WhatWeOffer from "./WhatWeOffer"
import StayConnected from "../common/StayConnected"

export const About = () => {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <PortfolioSection />
            <SliderSection />
            <ProfileCards />
            <WhatWeOffer />
            <StayConnected />
        </>
    )
}