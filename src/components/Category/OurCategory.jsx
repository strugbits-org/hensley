import React from 'react'
import SectionTitle from '../common/SectionTitle'

import image1 from '@/assets/house.png'
import ProductCard2 from '../common/ProductCard2'


const categories = [
  {
    id: 1,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
  {
    id: 2,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
  {
    id: 3,
    title: 'tents',
    description: 'The ease of the indoors, brought outside.',
    image: image1,
  },
]

function OurCategory() {
  return (
    <>
      <div className='w-full lg:border-none sm:px-0 px-[12px]'>
      <SectionTitle text="our categories" classes="text-[35px] pt-[40px] pb-[40px] border-t border-b" />
      </div>
      <ProductCard2 data={categories}/>
    </>
  )
}

export default OurCategory
