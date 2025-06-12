import React from 'react'
import CareerOppurtunities from './CareerOppurtunities'
import JobBoard from './JobBoard'
import { Testimonials } from '../common/Testimonials'
import PortfolioSlider from '../common/PortfolioSlider'

const Careers = ({ data }) => {
  const { heroSectionData, howWeDoItData, whoWorksCareersPageData, lastSectionCareersPageData, jobsData } = data;

  return (
    <>
      <CareerOppurtunities data={heroSectionData} />
      <Testimonials data={whoWorksCareersPageData} pageDetails={{ testimonialsTitle: "who works" }} />
      <PortfolioSlider data={howWeDoItData} tab={true} display={true} cardCss={'border border-primary-border'} />
      <JobBoard data={lastSectionCareersPageData} jobs={jobsData} />

    </>
  )
}

export default Careers