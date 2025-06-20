import React from 'react'
import { ProductListing } from './ProductListing'
import OurCategories from '../common/OurCategories'

export const SubCategoryPage = ({ data, pageDetails }) => {
  const { ourCategoriesData } = data;
  const {ourCategoriesTitle} = pageDetails

  // console.log("got our cate head: ",ourCategoriesTitle);

  return (
    <>
      <ProductListing data={data} />
      <OurCategories classes={"lg:block hidden"} data={ourCategoriesData} pageDetails={{ ourCategoriesTitle:ourCategoriesTitle }} />
    </>
  )
}
