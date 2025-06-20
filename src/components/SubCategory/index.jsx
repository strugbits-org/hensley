import React from 'react'
import { ProductListing } from './ProductListing'
import OurCategories from '../common/OurCategories'

export const SubCategoryPage = ({ data, pageDetails }) => {
  const { ourCategoriesData } = data;
  console.log("cating: ",ourCategoriesData);
  const { ourCategoriesTitle } = pageDetails

  return (
    <>
      <ProductListing data={data} />
      <OurCategories classes={"lg:block hidden"} data={ourCategoriesData} pageDetails={{ ourCategoriesTitle: ourCategoriesTitle }} />
    </>
  )
}
