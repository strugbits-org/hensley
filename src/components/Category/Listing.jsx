import React from 'react'
import SectionTitle from '../common/SectionTitle'
import ProductCard from '../common/ProductCard'

function Listing() {
  return (
    <>
    <SectionTitle text="tabletop" classes={"pt-[40px] pb-[40px] "}/>
    <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6">
  <div className="lg:w-1/4 w-full border h-screen  ">
    <h1>hello</h1>
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