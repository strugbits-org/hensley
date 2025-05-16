'use client'

import React, { useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import Image from 'next/image'
import chairImage from '@/assets/chair.png'
import catTab from '@/assets/icons/cat-tab.svg'
import FilterMenu from '../common/MenuFilter'
import SubCategories from '../common/SubCategories'

const filterData = [
  {
    title: "Tents",
    children: [
      { label: "Chargers" },
      { label: "Tension tents" },
      { label: "Frame tents" },
    ],
  },
  {
    title: "Lighting",
    children: [
      { label: "String Lights" },
      {
        title: "LED Options",
        children: [
          { label: "White LEDs" },
          { label: "RGB LEDs" },
        ],
      },
    ],
  },
];

function Listing({ slug, products }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleList = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className='w-full relative'>
        <SectionTitle text={slug} classes="text-[35px] pt-[40px] pb-[40px] border-none" />
        <div
          className={`lg:hidden absolute top-[40px] sm:right-[10%] right-[2%] z-[9999] ${isOpen ? 'min-h-[300px] w-[330px] px-[20px] py-[40px]' : 'h-[55px] w-[55px]'} rounded-[50px] bg-white flex flex-col`}
        >
          <div
            className={`flex flex-1 items-center ${isOpen ? 'justify-end px-4' : 'justify-center'
              }`}
          >

            <Image
              src={catTab}
              onClick={toggleList}
              className={`absolute ${isOpen && 'right-[18px] top-[19px]'}`}
            />
          </div>
          {isOpen && (
            <div>
              <FilterMenu items={filterData} />
            </div>
          )}
        </div>
      </div>

      <SubCategories />

      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:px-0 px-[12px]">
        <div className="lg:w-1/4 w-full lg:h-screen pl-[24px] lg:block hidden">
          <FilterMenu items={filterData} />
        </div>
        <div className="w-full lg:w-3/4 min-h-screen grid sm:grid-cols-3 grid-cols-2 lg:gap-x-[24px] sm:gap-x-[12px] lg:gap-y-[31px] gap-y-[13px] gap-x-[12px] sm:gap-y-[12px]
         lg:pb-[28px] lg:pt-[28px] 
         sm:pt-[12px] sm:pb-[12px]
         pb-[12px]
        lg:border-t lg:border-b">
          {products.map((productData, index) => {
            return (
              <ProductCard
                key={index}
                data={productData}
                onAddToCart={() => console.log('Added to cart')}
              />
            )
          })}
        </div>
      </div>
    </>
  );
}

export default Listing;
