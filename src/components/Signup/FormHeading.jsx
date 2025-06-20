import React from 'react'
import SectionTitle from '../common/SectionTitle'

const FormHeading = ({pageTitle}) => {
  return (
   <SectionTitle text={pageTitle} classes="lg:!text-[140px] lg:!leading-[110px] !text-[55px] !leading-[55px]  py-[40px] md:mt-6 lg:mt-0 lg:border-b border-black" />
  )
}

export default FormHeading