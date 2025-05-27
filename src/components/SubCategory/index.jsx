import React from 'react'
import { ProductListing } from './ProductListing'
import OurCategories from '../common/OurCategories'

export const SubCategoryPage = ({ data }) => {
  const { ourCategoriesData } = data;

  return (
    <>
      <ProductListing data={data} />
      <OurCategories classes={"lg:block hidden"} data={ourCategoriesData} pageDetails={{ ourCategoriesTitle: "Our Categories" }} />
    </>
  )
}
