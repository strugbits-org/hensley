"use client";
import SecondryProductCard from '@/components/common/SecondryProductCard'
import React from 'react'

function SavedProducts() {
    const data = {
        heading: "SAVED PRODUCTS",

    }
    const mockProductData = [
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
        {
            product: {
                name: "Vintage Leather Jacket",
                mainMedia: "https://example.com/images/leather-jacket.jpg",
                sku: "VLJ-2025-BRN-M",
                additionalInfoSections: [
                    {
                        title: "Size",
                        description: "<strong>M</strong> - Medium fit with adjustable cuffs"
                    },
                    {
                        title: "Material",
                        description: "100% Genuine Leather"
                    }
                ]
            }
        },
    ];
    function handleAddToCart() {
        console.log("Product added to cart!");
    }
    return (
        <div className='MyAccount w-full max-lg:mb-[85px] '>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[85px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.heading}</h2>
            </div>
            <div className='pl-[23px] pr-[18px] pt-[23px] pb-[96px] max-lg:p-3 max-md:pt-[30px]'>
                <div className='grid grid-cols-5 max-2xl:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 gap-x-6 max-lg:gap-x-3 max-md:gap-x-[10px] gap-y-5 max-lg:gap-y-3 border-none border-0 border-transparent'>
                    {mockProductData.map((a, i) => (
                        <SecondryProductCard data={a} onAddToCart={handleAddToCart} type="listing" />
                    ))}
                </div>
                <button type='submit' className={`mt-[25px] w-full h-[150px] max-lg:h-[90px]  bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative flex items-center justify-center`}>
                    <span
                        className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'
                    >LOAD MORE CHAIRS</span>
                    <svg className='rotate-45 size-[13px] group-hover:w-4 transition-all duration-300 ease-in-out absolute right-[26.3px] text-[#2c2216] group-hover:text-white hidden max-lg:block' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                        <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                            <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                            <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SavedProducts