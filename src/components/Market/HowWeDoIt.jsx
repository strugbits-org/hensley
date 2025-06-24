import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { CardsSlider } from '../common/CardsSliderComponent'

const HowWeDoIt = ({ data, pageDetails }) => {
    const { howWeDoItTitle } = pageDetails;

    return (
        <div className='bg-primary w-full'>
            <SectionTitle text={howWeDoItTitle} classes={"border-t border-primary-border md:bg-primary lg:bg-primary-alt bg-primary pt-[36px] lg:pb-[44px]"} />
            <CardsSlider data={data} />
        </div>
    )
}

export default HowWeDoIt;