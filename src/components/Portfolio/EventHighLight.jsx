'use client'
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import Image from 'next/image'
import { generateImageURLAlternate } from '@/utils/generateImageURL'
import { formatDate } from '@/utils'
import { MarketsStudiosTags } from '../Blogs/MarketsStudiosTags'

const EventHighLight = ({ data, handleFilterChange, selectedTags }) => {
    if (!data) return;

    const { slug, portfolioRef, markets, studios } = data;

    const coverImage = generateImageURLAlternate({ wix_url: portfolioRef.coverImage.imageInfo });
    return (
        <div className='w-full'>
            <SectionTitle text="our projects" classes={"lg:bg-primary-alt pt-[36px] pb-[44px]"} />
            <div className='w-full border' >
                <div className='lg:h-[686px] h-[730px] flex sm:justify-end justify-start w-full bg-no-repeat bg-center bg-[length:100%_100%] lg:pr-[186px] lg:pt-[202px] sm:pr-[55px] sm:pt-[104px] px-[22px] py-[31px] overflow-hidden transition-all duration-500 ease-in-out hover:bg-[length:110%_110%] ' style={{ backgroundImage: `url(${coverImage})` }}>
                    <div className='group flex lg:flex-row flex-col items-start mt-[20px] gap-x-[27px] gap-y-[15px]'>
                        <Image
                            className='order-2 lg:order-1 z-10 lg:w-[176px] lg:h-[176px] w-[34px] h-[34px] lg:group-hover:w-[342px] lg:group-hover:h-[342px] transition-all duration-300 ease-in-out'
                            height={176}
                            width={176}
                            src={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                        />
                        <div className='order-1 lg:order-2 flex flex-col gap-y-[15px] max-w-md'>
                            <span className='font-haasRegular uppercase text-[12px] text-secondary-alt text-white block '>{formatDate(portfolioRef._updatedDate)}</span>
                            <span className='uppercase text-secondary-alt text-[35px] text-white leading-[40px] font-recklessRegular block'>{portfolioRef.title}</span>
                            <MarketsStudiosTags markets={markets} studios={studios} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
                            <span className='font-haasRegular uppercase text-[16px] text-white leading-[20px] text-secondary-alt block'>{portfolioRef.description.slice(0, 200)}{portfolioRef.description.length > 200 ? '...' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventHighLight;