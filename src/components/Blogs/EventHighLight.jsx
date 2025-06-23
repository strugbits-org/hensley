'use client'
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { PrimaryImage } from '../common/PrimaryImage'
import { CustomLink } from '../common/CustomLink'
import { formatDate } from '@/utils'
import { MarketsStudiosTags } from './MarketsStudiosTags'

const EventHighLight = ({ data, handleFilterChange, selectedTags, pageTitle="" }) => {

    if (!data) return;

    const {hensleyNewsTitle} = pageTitle;

    const { slug, author, blogRef, markets, studios } = data;
    return (
        <div className='w-full group'>
            <SectionTitle
                text={hensleyNewsTitle || "HENSLEY NEWS"}
                classes={"lg:bg-primary-alt pt-[36px] pb-[44px]"}
            />
            <div className='w-full border border-primary-border p-[24px] gap-x-[24px] flex lg:flex-row flex-col '>
                <div className='lg:w-1/2 overflow-hidden'>
                    <PrimaryImage url={blogRef.coverImage} alt={blogRef.title} customClasses="h-full w-full min-h-[528px] max-h-[528px] object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className='lg:w-1/2  flex flex-row lg:flex-col gap-x-[20px] lg:px-0 max-lg:py-[40px] lg:gap-y-[15px] relative '>
                    <div className=' max-lg:w-1/2  flex flex-col gap-y-[15px]'>
                        <div className='w-full flex gap-x-[10px] justify-end'>
                            <span className='font-haasRegular uppercase text-[12px] text-secondary-altinline'>{author?.nickname || author?.firstName || author?.lastName} - {formatDate(blogRef.publishedDate)}</span>
                        </div>

                        <span className='uppercase text-secondary-alt lg:text-[60px] lg:leading-[55px] sm:text-[35px] sm:leading-[32px] text-[25px] leading-[23px] font-recklessRegular block '>
                            {blogRef.title}
                        </span>

                        <span className='font-haasRegular uppercase text-[12px] text-secondary-alt text-left lg:block hidden'>{blogRef.excerpt}</span>
                        <MarketsStudiosTags markets={markets} studios={studios} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
                    </div>

                    <div className='max-lg:w-1/2 lg:justify-end h-full text-right flex flex-col gap-y-[15px] '>
                        <p className='font-haasRegular uppercase text-[12px] text-secondary-alt text-left lg:hidden block '>{blogRef.excerpt}</p>
                        <CustomLink to={`/posts/${slug}`} className='font-haasRegular text-[12px] leading-[20px] uppercase text-secondary-alt text-left'>+ READ MORE</CustomLink>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EventHighLight;