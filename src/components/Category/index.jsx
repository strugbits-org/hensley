import React from 'react'
import Listing from './Listing'
import InstaFeedback from '../common/InstagramFeed'
import OurCategories from '../common/OurCategories'

export const Categories = ({ slug }) => {
  const categories = [
  {
    orderNumber: 1,
    _id: 'e4cc18b1-350f-47b5-9022-ac13c0bbd88b',
    _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
    categories: {
      name: 'TENTS',
      mainMedia: 'wix:image://v1/626075_557c9d69457d47db99843f9f6097ebbe~mv2.jpg/file.jpg#originWidth=4491&originHeight=2259',
      _id: 'd27f504d-05a2-ec30-c018-cc403e815bfa',
      slug: 'tents',
      categoryPageUrl: '/category/tents',
      'link-collections-name': '/subcategory/tents',
      'link-collections-name-2': '/collections/tents'
    },
    title: 'THE EASE OF THE INDOORS, BROUGHT OUTSIDE'
  },
  {
    orderNumber: 2,
    _id: 'fc5962ca-1e5f-41c8-b6eb-60649a1fd358',
    _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
    categories: {
      name: 'TABLETOP',
      mainMedia: 'wix:image://v1/626075_a0c9929c708a4855988454b61892c5e7~mv2.jpg/file.jpg#originWidth=5000&originHeight=5000',
      _id: '80318732-dfa7-93e3-7f90-b9b9b655a203',
      slug: 'tabletop',
      categoryPageUrl: '/category/tabletop',
      'link-collections-name': '/subcategory/tabletop',
      'link-collections-name-2': '/collections/tabletop'
    },
    title: 'DISCOVER THE ART OF PERFECT TABLE SETTINGS'
  },
  {
    orderNumber: 3,
    _id: 'f6b2523c-5a9a-4388-85fe-6ccac622736d',
    _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
    categories: {
      name: 'CATERING',
      mainMedia: 'wix:image://v1/626075_bf065261d72f4c8f9eb4d2010055a55b~mv2.jpg/file.jpg#originWidth=5881&originHeight=5881',
      _id: '67cdab0b-89d7-bc4f-95fe-7fc4de5f2a11',
      slug: 'catering',
      categoryPageUrl: '/category/catering',
      'link-collections-name': '/subcategory/catering',
      'link-collections-name-2': '/collections/catering'
    },
    title: 'CRAFTED FOR CULINARY PERFECTION'
  },
  {
    orderNumber: 4,
    _id: 'b30ecc21-917b-40c7-b8c8-b4f30a3a6653',
    _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
    rtl: true,
    categories: {
      name: 'FURNISHINGS',
      mainMedia: 'wix:image://v1/626075_8016717c01f248c9a1514b5877442e91~mv2.jpg/file.jpg#originWidth=2000&originHeight=2000',
      _id: 'ca36a87a-3e56-171b-a8e0-9ec2f5e2a874',
      slug: 'furnishings',
      categoryPageUrl: '/category/furnishings',
      'link-collections-name': '/subcategory/furnishings',
      'link-collections-name-2': '/collections/furnishings'
    },
    title: 'TRANSFORM SPACES INTO MASTERPIECES'
  },
  {
    orderNumber: 5,
    _id: '260364e6-7c01-4de9-8f2b-2a847594ad66',
    _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
    rtl: true,
    categories: {
      name: 'PAVILIONS',
      mainMedia: 'wix:image://v1/626075_c12c67a6681e4729abb7f8105865611f~mv2.jpg/file.jpg#originWidth=1280&originHeight=1280',
      _id: '8726071f-ef4b-b6f4-db99-fc23a62b4023',
      slug: 'pavilions',
      categoryPageUrl: '/category/pavilions',
      'link-collections-name': '/subcategory/pavilions',
      'link-collections-name-2': '/collections/pavilions'
    },
    title: 'PAVILIONS DESIGNED TO INSPIRE AND PROTECT'
  }
]
  return (
    <>
      <Listing slug={slug} />
      <OurCategories data={categories} />
      <InstaFeedback />
    </>
  )
}
