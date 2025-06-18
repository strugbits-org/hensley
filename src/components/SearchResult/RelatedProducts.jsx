"use client"
import React, { useEffect, useState } from 'react'
import SectionTitle from '../common/SectionTitle'
import SecondaryProductCard from '../common/SecondaryProductCard'
import { PrimaryButton } from '../common/PrimaryButton'
import AutoClickWrapper from '../common/helpers/AutoClickWrapper'
import Loading from '@/app/loading'
import { searchProducts } from '@/services/search'
import { logError } from '@/utils'

const RelatedProducts = ({ data, term, pageSize, savedProducts, setSavedProducts }) => {
    const [loading, setLoading] = useState(false);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [products, setProducts] = useState([]);

    const handleLoadMore = async () => {
        try {
            setLoading(true);
            const ids = products.map((x) => x.product._id);
            const productsData = await searchProducts({ term, pageLimit: 24, skipProducts: ids });
            if (productsData.length < pageSize) setSearchCompleted(true);

            setProducts([...products, ...productsData]);
        } catch (error) {
            logError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data.length > 0) {
            setProducts(data);
        }

        if (data.length === 0 || data.length < pageSize) {
            setSearchCompleted(true);
        }
    }, [data]);

    return (
        <div className='px-[24px] w-full h-full border-b border-primary-border pb-12'>
            <SectionTitle text="PRODUCTS RELATED TO YOUR SEARCH" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
            <div className='w-full h-full grid grid-cols-6 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-x-[24px] gap-y-[20px]'>
                {products.map((item, index) => (
                    <SecondaryProductCard
                        key={index}
                        data={item}
                        savedProducts={savedProducts}
                        setSavedProducts={setSavedProducts}
                    />
                ))}
            </div>
            <div className='w-full flex justify-center items-center'>
                {!loading && !searchCompleted && products.length > 0 && (
                    <div className="flex-center">
                        <AutoClickWrapper onIntersect={handleLoadMore}>
                            <PrimaryButton
                                onClick={handleLoadMore}
                                className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt max-h-[60px] max-w-[280px] p-0 lg:mt-[60px] sm:mt-[59px] mt-[40px] hover:[letter-spacing:4px]"
                            >
                                see all
                            </PrimaryButton>
                        </AutoClickWrapper>
                    </div>
                )}
                {loading && (
                    <div className="flex-center mt-12">
                        <Loading custom={true} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default RelatedProducts;