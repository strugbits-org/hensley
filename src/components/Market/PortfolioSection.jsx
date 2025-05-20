import React from 'react'
import PortfolioSlider from '../common/PortfolioSlider'
import SectionTitle from '../common/SectionTitle'

const PortfolioSection = () => {

    return (
        <div className='bg-primary w-full'>
            <SectionTitle
                text="How we do it"
                classes={
                    "md:bg-primary lg:bg-primary-alt bg-primary pt-[36px] pb-[44px] hidden lg:block"
                } />
            <PortfolioSlider tab={true} />
        </div>
    )
}

export default PortfolioSection