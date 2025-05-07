import HeroSection from "./HeroSection"
import AboutSection from "./AboutSection"
import CartDetailSection from "./CartDetails"
import SliderSection from "./SliderSection"
import ProfileCards from "./ProfileCards"
import WhatWeOffer from "./WhatWeOffer"
import StayConnected from "../common/StayConnected"

export const About = () => {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <CartDetailSection />
            <SliderSection />
            <ProfileCards />
            <WhatWeOffer />
            <StayConnected />
        </>
    )
}