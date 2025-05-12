import React from 'react'
import Listing from './Listing'
import OurCategories from './OurCategories'
import InstaFeedback from '../common/InstaFeedback'

export const Categories = ({slug}) => {
  return (
    <>
    <Listing slug={slug}/>
    <OurCategories slug={slug} />
    <InstaFeedback />
    </>
  )
}
