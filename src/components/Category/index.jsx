import React from 'react';
import Listing from './Listing';
import OurCategories from '../common/OurCategories';

export const ProductsListing = ({ data }) => {
  const { ourCategoriesData } = data;

  return (
    <>
      <Listing data={data} />
      <OurCategories data={ourCategoriesData} pageDetails={{ ourCategoriesTitle: "Our Categories" }} />
    </>
  );
}
