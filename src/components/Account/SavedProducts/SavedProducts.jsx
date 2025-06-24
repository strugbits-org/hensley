"use client";
import AutoClickWrapper from '@/components/common/helpers/AutoClickWrapper';
import SecondaryProductCard from '@/components/common/SecondaryProductCard'
import { fetchSavedProductData } from '@/services/products';
import { loaderActions } from '@/store/loaderStore';
import { logError } from '@/utils';
import React, { useEffect, useState } from 'react'

function SavedProducts() {
    const pageSize = 5;
    const [savedProducts, setSavedProducts] = useState([]);
    const [pageLimit, setPageLimit] = useState(pageSize);

    const data = {
        heading: "SAVED PRODUCTS",
    }

    const fetchSavedProducts = async () => {
        try {
            const savedProducts = await fetchSavedProductData(true);
            setSavedProducts(savedProducts);
            loaderActions.hide();
        } catch (error) {
            logError("Error while fetching Saved Product", error);
        }
    };

    useEffect(() => {
        fetchSavedProducts();
    }, []);

    const handleAutoSeeMore = () => {
        setPageLimit((prev) => prev + pageSize);
    }
    return (
        <div className='MyAccount w-full max-lg:mb-[85px] '>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[120px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.heading}</h2>
            </div>
            <div className='pl-[23px] pr-[18px] pt-[23px] pb-[96px] max-lg:p-3 max-md:pt-[30px]'>
                <div className='grid grid-cols-5 max-2xl:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 gap-x-6 max-lg:gap-x-3 max-md:gap-x-[10px] gap-y-5 max-lg:gap-y-3 border-none border-0 border-transparent'>
                    {savedProducts.length === 0 ? (
                        <div className='w-full col-span-5 max-2xl:col-span-3 max-lg:col-span-3 max-md:col-span-2 text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>NO SAVED PRODUCTS</div>
                    ) : (
                        savedProducts.slice(0, pageLimit).map((productData) => {
                            return (
                                <SecondaryProductCard
                                    key={productData._id}
                                    data={productData}
                                    type="listing"
                                    savedProducts={savedProducts}
                                    setSavedProducts={setSavedProducts}
                                />
                            );
                        })
                    )}
                </div>
                {pageLimit < savedProducts.length && (
                    <div className="flex-tablet-center mt-lg-60 mt-tablet-40 mt-phone-45">
                        <AutoClickWrapper onIntersect={handleAutoSeeMore}>
                            <button onClick={handleAutoSeeMore} className={`mt-[25px] w-full h-[150px] max-lg:h-[90px]  bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative flex items-center justify-center`}>
                                <span
                                    className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'
                                >LOAD MORE CHAIRS</span>
                                <svg className='rotate-45 size-[13px] group-hover:w-4 transition-all duration-300 ease-in-out absolute right-[26.3px] text-secondary-alt group-hover:text-white hidden max-lg:block' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                                    <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                        <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                        <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                    </g>
                                </svg>
                            </button>
                        </AutoClickWrapper>
                    </div>
                )}
            </div>

        </div>
    )
}

export default SavedProducts;