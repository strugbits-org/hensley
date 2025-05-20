import React from 'react'
import SectionTitle from '../common/SectionTitle'
import CardsSliderComponent from '../common/CardsSliderComponent'

const HowWeDoIt = ({ data, pageDetails }) => {
    const { howWeDoItTitle } = pageDetails;

    return (
        <div className='bg-primary w-full'>
            <SectionTitle
                text={howWeDoItTitle}
                classes={"md:bg-primary lg:bg-primary-alt bg-primary pt-[36px] pb-[44px] hidden lg:block"} />
            <CardsSliderComponent data={data} tablet={true} />
        </div>
    )
}

export default HowWeDoIt;