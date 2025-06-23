"use client";
import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage'
import { formatDate } from '@/utils';
import { MarketsStudiosTags } from '../Blogs/MarketsStudiosTags';
import { CustomLink } from '../common/CustomLink';

const ProjectCard = ({ data, handleFilterChange, selectedTags, isRTL }) => {
    const { slug, portfolioRef, markets, studios } = data;

    return (
        <div className={`group border border-primary-border flex flex-col lg:flex-row hover:bg-primary transition-all duration-300 ease-in-out lg:h-[474px] gap-0 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            {/* Image Section */}
            <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] px-[12px] lg:h-auto h-[382px]">
                <CustomLink to={`/project/${slug}`} className="overflow-hidden h-full w-full">
                    <PrimaryImage url={portfolioRef.coverImage.imageInfo} useNextImage={true} alt={portfolioRef.title} type='alternate' q={"50"} customClasses="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </CustomLink>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 lg:px-[24px] lg:py-[24px] py-[13px] max-lg:px-[12px]">
                <div className="h-full w-full flex justify-between gap-x-2">
                    <div className="h-full flex flex-col justify-between">
                        <div className='flex flex-col gap-y-[15px]'>
                            <span className='font-haasRegular *: text-[12px] uppercase text-secondary-alt block '>{formatDate(portfolioRef._updatedDate)}</span>
                            <span className="font-recklessRegular 2xl:text-[35px] 2xl:leading-[35px] max-2xl:text-[20px] max-2xl:leading-[18px] text-[23px] leading-[25px] uppercase">
                                {portfolioRef.title}
                            </span>

                            <MarketsStudiosTags markets={markets} studios={studios} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
                            <span className='font-haasRegular uppercase 2xl:text-[12px] 2xl:leading-[16px] lg:text-[12px] text-secondary-alt block '>{portfolioRef.description.slice(0, 200)}{portfolioRef.description.length > 200 ? '...' : ''}</span>
                        </div>

                        <CustomLink to={`/project/${slug}`} className='pt-[10px]'>
                            <PrimaryImage
                                url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                                alt="Arrow"
                                customClasses="hidden lg:block arrow w-[25px] h-[25px] transition-all duration-300 ease-in-out group-hover:w-[70px] group-hover:h-[70px] lg:mb-[12px] group-hover:filter brightness-50"
                            />
                        </CustomLink>
                    </div>

                    <CustomLink to={`/project/${slug}`} >
                        <PrimaryImage
                            url="https://static.wixstatic.com/shapes/8ba81b_893a7cdd28814f1cbf0b299b6b211205.svg"
                            alt="Arrow"
                            customClasses="lg:hidden arrow w-[25px] h-[25px]"
                        />
                    </CustomLink>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;
