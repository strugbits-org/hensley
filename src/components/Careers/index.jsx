import React from 'react'
import CareerOppurtunities from './CareerOppurtunities'
import { Testimonials } from '../common/Testimonials'
import PortfolioSlider from '../common/PortfolioSlider'

const Careers = ({ data }) => {
  const { heroSectionData, howWeDoItData, whoWorksCareersPageData, lastSectionCareersPageData, jobsData } = data;


  return (
    <>
      <CareerOppurtunities data={heroSectionData} />
      <Testimonials data={whoWorksCareersPageData} lgPreview={1} titleClass="lg:!mt-[80px]" cardClasses={'!max-w-[1556px] lg:!flex-row-reverse !items-center !border-none lg:hover:bg-none lg:!gap-x-[150px]'} sliderClasses={'lg:!pl-0'} pageDetails={{ testimonialsTitle: "who works" }} imageExp={false} />
      <PortfolioSlider data={howWeDoItData} cardCss={'!border !border-primary-border'} />
      {/* <JobBoard data={lastSectionCareersPageData} jobs={jobsData} /> */}

    </>
  )
}

export default Careers