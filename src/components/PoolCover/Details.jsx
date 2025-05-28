"use client";
import React, { useEffect, useState } from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { AddToQuote } from './AddtoQuoteButton'
import { PrimaryImage } from '../common/PrimaryImage'
import CheckBox from './CheckBox';

const infoHeaders = [
    {
        title: 'Product',
        setItem: true,
    },
    {
        title: 'Size',
        setItem: false,
    },
    {
        title: 'Price',
        setItem: false,
    },
    {
        title: 'Quantity',
        setItem: false,
    }
]

export const Details = ({ data }) => {
    //   const { productData } = data;
    //   const { product } = productData;
    const [productInfoSection, setProductInfoSection] = useState([]);
    const [productQuantity, setProductQuantity] = useState(1);
    const [checked, setChecked] = useState(false);

    // Handler for checkbox change
    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    //   console.log("Product data:", productData);

    const setAdditionalInfoSections = () => {
        if (product.productSetItem) {
            const productInfoSection = [
                { product: 'CHARGER', size: '-', price: '$5.80' },
                { product: 'DINNER PLATE', size: '11"', price: '$2.65' },
                { product: 'DINNER PLATE', size: '9"', price: '$2.65' },
                { product: 'RICE BOWL', size: '-', price: '$2.65' },
                { product: 'B&B', size: '-', price: '$2.65' },
                { product: 'MUG', size: '-', price: '$2.65' },
                { product: 'SERVING BOWL', size: '9"', price: '$10.80' },
                { product: 'SERVING PLATTER', size: '12"', price: '$15.75' },
            ]
            setProductInfoSection(productInfoSection);
            return;
        }

        const productSize = product.additionalInfoSections.find((x) => x.title === "Size") || "—";
        const productInfoSection = [
            { size: productSize, price: product.formattedPrice },
        ]
        setProductInfoSection(productInfoSection);
    }

    //   useEffect(() => {
    //     setAdditionalInfoSections();
    //   }, [productData]);

    return (
        <>
            <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px] '>
                <div className='xl:w-1/2 '>
                    <ProductSlider />
                    <ProductSlider_tab />
                </div>
                <div className='xl:w-1/2 flex flex-col items-center relative'>
                    <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
                        <span className='text-secondary-alt 
          lg:text-[16px]
          text-[12px]
          uppercase font-haasLight'>Home/pool cover</span>
                        <h3 className='uppercase text-secondary-alt font-recklessRegular 
          lg:text-[90px] 
          lg:leading-[85px]
          text-[35px]
          leading-[30px]
          '>POOL COVER</h3>
                        <p className='
            font-haasRegular
            lg:text-[16px]
            lg:leading-[19px]
            text-[14px]
            leading-[17px]
            text-secondary-alt
            '>Pool Covering is a creative alternative to expanding your backyard event space.  Starting at the standard 20x40 pool size and including custom shapes, our pool covering equipment creates surface areas that can be installed both elevated or flush, based on characteristics of the pool.  Our equipment provides a safe foundation for then either plexiglass, wood or carpet coverings to be installed. ​</p>

                        <form action="" className='w-full grid grid-cols-2 justify-between gap-x-[24px] gap-y-[39px] mt-[20px]'>
                            <span className=' 
                            col-span-2
                            uppercase
                text-[30px] 
                leading-[30px] 
                text-secondary-alt'>PLEASE FILL THE BELLOW RFP FORM & A SPECIALIST WILL PROVIDE A CUSTOM QUOTE
                            </span>
                            <div className='col-span-2'>
                                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">PLEASE SHARE THE APPROX. SIZE OF THE AREA YOU YOUR POOL IS*</label>
                                <textarea
                                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                                    rows={4}
                                ></textarea>

                            </div>

                            <CheckBox data={{ label: "how is your pool edge?*", options: ["flat", "raised"] }} />
                            <CheckBox data={{ label: "HOW MUCH OF THE POOL ARE YOU LOOKING TO COVER? *", options: ["entire pool", "partial pool covering"] }} />


                              <div className='col-span-2'>
                                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">PLEASE SHARE ANY RELEVANT VENUE OR INSPIRATION IMAGES</label>
                                <button className='bg-primary py-[10px] uppercase font-haasRegular text-[25px] w-full'>upload +</button>
                            </div>

                        </form>

                    </div>
                    <AddToQuote text="add to quote" />

                    <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer">
                        <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
                        <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
                    </div>

                </div>
            </div>
        </>
    )
}