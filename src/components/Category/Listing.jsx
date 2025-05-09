'use client'

import React,{useState} from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'


const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="font-bold text-left text-gray-800 py-1 hover:underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div className="ml-4 space-y-1">{children}</div>}
    </>
  );
};


const FilterMenu = () => {
  return (
    <div className="bg-[#F9F7F2] text-[#3E3E3E] font-sans p-5 w-full">
      <h4 className="text-xs font-bold uppercase mt-5 mb-2 pt-2 border-t border-[#E2E0DB] text-[#444]">Products</h4>
      <div className='flex flex-col border border-black h-full'>
      <CollapsibleSection title="Tents">
        <label><input type="checkbox" className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all duration-200" /> Structures</label><br />
        <label><input type="checkbox"  className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all duration-200" /> Tension Tents</label><br />
        <label><input type="checkbox"  className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all duration-200" /> Frame Tents</label>
      </CollapsibleSection>

      <CollapsibleSection title="Tabletop">
        <label><input type="checkbox"  className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all duration-200" /> Flatware</label><br />
        <label><input type="checkbox"  className="appearance-none w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-gray-800 checked:border-gray-800 transition-all duration-200" /> Glassware</label><br />
        <label><input type="checkbox" className="mr-2" /> Specialty Linen</label><br />
        <label><input type="checkbox" className="mr-2" /> Specialty Napkins</label><br />
        <label><input type="checkbox" className="mr-2" /> Table Runners</label><br />
        <CollapsibleSection title="You Linen">
          <label><input type="checkbox" className="mr-2" /> Poly Linen Napkins</label><br />
          <label><input type="checkbox" className="mr-2" /> Table Runners</label>
        </CollapsibleSection>
      </CollapsibleSection>

      <CollapsibleSection title="Furnishings">
        <CollapsibleSection title="Chairs">
          <label><input type="checkbox" className="mr-2" /> Dining</label><br />
          <label><input type="checkbox" className="mr-2" /> Barstools</label><br />
          <label><input type="checkbox" className="mr-2" /> Cushions</label><br />
          <label><input type="checkbox" className="mr-2" /> Children's</label>
        </CollapsibleSection>
        <CollapsibleSection title="Tables">
          <label><input type="checkbox" className="mr-2" /> Dining</label><br />
          <label><input type="checkbox" className="mr-2" /> Cocktail</label><br />
          <label><input type="checkbox" className="mr-2" /> Lounge Furniture</label><br />
          <label><input type="checkbox" className="mr-2" /> Coffee & Backbars</label><br />
          <label><input type="checkbox" className="mr-2" /> Outdoor</label><br />
          <label><input type="checkbox" className="mr-2" /> Screens</label><br />
          <label><input type="checkbox" className="mr-2" /> Pavilions</label><br />
          <label><input type="checkbox" className="mr-2" /> Pillows</label>
        </CollapsibleSection>
      </CollapsibleSection>
</div>
    </div>
  );
};


function Listing() {
  return (
    <>
    <SectionTitle text="tabletop" classes={"pt-[40px] pb-[40px] "}/>
    <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6">
  <div className="lg:w-1/4 w-full border h-screen  ">
    <FilterMenu />
  </div>
  <div className="w-full lg:w-3/4 border min-h-screen grid sm:grid-cols-3 grid-cols-2 gap-[4px] gap-y-[24px]">
  <ProductCard />
  <ProductCard />
  <ProductCard />
  <ProductCard />
  <ProductCard />
  <ProductCard />
  </div>
</div>

    </>
  )
}

export default Listing