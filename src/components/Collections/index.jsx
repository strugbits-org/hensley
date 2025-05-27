import React from 'react';
import ProductListing from './ProductListing';
import OurCategories from '../common/OurCategories';

export const CollectionPage = ({ data }) => {
  const { ourCategoriesData } = data;

  return (
    <>
      <ProductListing data={data} />
      <OurCategories data={ourCategoriesData} pageDetails={{ ourCategoriesTitle: "Our Categories" }} />
    </>
  );
}
