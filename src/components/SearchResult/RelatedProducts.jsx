"use client"
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import SecondaryProductCard from '../common/SecondaryProductCard'
import image from '@/assets/chair.png'
import { PrimaryButton } from '../common/PrimaryButton'

const RelatedProducts = () => {
    return (
        <div className='px-[24px] w-full h-full'>
            <SectionTitle text="PRODUCTS RELATED TO YOUR SEARCH" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
            <div className='w-full h-full grid grid-cols-6 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-x-[24px] gap-y-[20px]'>
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
                <SecondaryProductCard data={{ product: { name: "POLTRONA MONTANA", mainMedia: image } }} onAddToCart={() => { console.log("Hello World") }} />
            </div>
            <div className='w-full flex justify-center items-center'>
                 <PrimaryButton
                            className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
                              max-h-[60px] max-w-[280px]
                              p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
                          >
                            see all
                          </PrimaryButton>
            </div>
        </div>
    )
}

export default RelatedProducts