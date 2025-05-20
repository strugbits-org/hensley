import React from 'react'
import HeroSection from './HeroSection'
import SliderComponent from '../common/SliderComponent'
import { BestSellers } from '../Home/BestSellers'
import { Banner } from '../common/Banner'
import { Testimonials } from '../common/Testimonials'
import { MarketSection } from '../common/MarketSection'
import { HensleyNews } from '../common/HensleyNews'
import HowWeDoIt from './HowWeDoIt'

export const MarketPage = ({ data }) => {

    const { marketPageDetails, selectedMarket, otherMarketsData, portfolioData, howWeDoItData, bannerData, bestSellers, testimonials, blogsData } = data;

    return (
        <>
            <HeroSection data={selectedMarket} />
            <SliderComponent data={portfolioData} classes={"flex p-6"} pageDetails={marketPageDetails} />
            <HowWeDoIt data={howWeDoItData} pageDetails={marketPageDetails} />
            <Banner data={bannerData} />
            <BestSellers data={bestSellers} pageDetails={marketPageDetails} />
            <Testimonials data={testimonials} pageDetails={marketPageDetails} />
            <MarketSection data={otherMarketsData} pageDetails={marketPageDetails} />
            <HensleyNews data={blogsData} pageDetails={marketPageDetails} loop={false} origin="start" />
        </>
    )
}
