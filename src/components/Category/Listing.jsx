'use client'

import React, { useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'
import arrow from '@/assets/icons/arrow-down.svg'
import arrowDown from '@/assets/icons/arrow-down-stick.svg'
import Image from 'next/image'
import chairImage from '@/assets/chair.png'
import catTab from '@/assets/icons/cat-tab.svg'

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

const Checkbox = ({ label }) => (
  <label className="flex items-center cursor-pointer">
    <input type="checkbox" className="peer hidden" />
    <div className="w-4 h-4 border-[1.5px] border-black lg:bg-[#F4F1EC] sm:bg-white peer-checked:bg-black peer-checked:p-[2px]">
      <div className="w-full h-full" />
    </div>
    <span className="lg:text-[18px] font-haasLight sm:text-[14px] ml-[8px] text-[#2B2218] uppercase">{label}</span>
  </label>
);

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button
        className="lg:text-[18px] sm:text-[14px] sm:mt-[10px] font-haasLight uppercase text-left text-gray-800 py-1 flex gap-x-[8px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src={arrow} alt="arrow" />
        {title}
      </button>
      {isOpen && <div className="ml-4 space-y-1">{children}</div>}
    </>
  );
};

const renderFilters = (items) =>
  items.map((item, index) => {
    if (item.children) {
      return (
        <CollapsibleSection key={index} title={item.title || item.label}>
          {renderFilters(item.children)}
        </CollapsibleSection>
      );
    }
    return <Checkbox key={index} label={item.label} />;
  });

const FilterMenu = () => {
  return (
    <div className="text-[#3E3E3E] font-sans w-full ">
      <div className="lg:border-t border-b w-full lg:py-[14px]">
        <h4 className="font-bold font-haasBold uppercase lg:text-[18px] sm:text[14px]">Products</h4>
      </div>
      <div className="flex flex-col h-full">
        {renderFilters(filterData)}
      </div>
    </div>
  );
};

const SubCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleList = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className='flex justify-center items-center pb-[18px]'>
        <div className='lg:w-[924px] sm:w-[681px] w-[344px] bg-white py-[25px] sm:px-[71px] px-[21px] flex flex-col justify-between items-center'>
          <div className='flex flex-row w-full justify-between items-center' onClick={toggleList}>
            <h3 className='lg:text-[45px] text-[25px] font-recklessRegular uppercase text-[#2C2216]'>all categories</h3>
            <Image src={arrowDown} className='w-[16px] h-[16px] lg:h-[24px] lg:w-[24px]' />
          </div>
          {isOpen && (
            <ul className="grid grid-cols-2 gap-y-4 gap-x-4 w-full list-none py-[23px]">
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">Premium Collection</li>
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">China</li>
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">Chargers</li>
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">Flatware</li>
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">Stemware</li>
              <li className="text-[18px] text-[#2C2216] uppercase font-recklessLight">Barware</li>
            </ul>
          )}
        </div>
      </div>

    </>
  )
}

function Listing() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleList = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className='w-full relative'>
        <SectionTitle text="tabletop" classes="text-[35px] pt-[40px] pb-[40px] border-none" />
        <div
          className={`lg:hidden absolute top-[40px] sm:right-[10%] right-[2%] z-[9999] ${isOpen ? 'min-h-[300px] w-[330px] px-[20px] py-[40px]' : 'h-[55px] w-[55px]'} rounded-[50px] bg-white flex flex-col`}
        >
          <div
            className={`flex flex-1 items-center ${isOpen ? 'justify-end px-4' : 'justify-center'
              }`}
          >

            <Image src={catTab} onClick={toggleList} />
          </div>
          {isOpen && (
            <div>
              <FilterMenu />
            </div>
          )}
        </div>
      </div>

      <SubCategory />

      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:px-0 px-[12px]">
        <div className="lg:w-1/4 w-full lg:h-screen pl-[24px] lg:block hidden">
          <FilterMenu />
        </div>
        <div className="w-full lg:w-3/4 min-h-screen grid sm:grid-cols-3 grid-cols-2 lg:gap-x-[24px] sm:gap-x-[12px] lg:gap-y-[31px] gap-y-[13px] gap-x-[12px] sm:gap-y-[12px]
         lg:pb-[28px] lg:pt-[28px] 
         sm:pt-[12px] sm:pb-[12px]
         pb-[12px]
        lg:border-t lg:border-b">
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
          <ProductCard
            imageSrc={chairImage}
            title="POLTRONA MONTANA"
            code="MODCH39"
            dimensions='24”L X 30”W X 37”H'
            onAddToCart={() => console.log('Added to cart')}
          />
        </div>
      </div>
    </>
  );
}

export default Listing;
