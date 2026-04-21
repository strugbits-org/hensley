"use client";
import React from 'react'
import EventHighLight from './EventHighLight'
import EventGallery from './EventGallery'
import { FeaturedProducts } from '../Product/FeaturedProducts';
import OurProjects from '../Collections/OurProjects';
import SectionTitle from '../common/SectionTitle';
import { generateImageURLAlternate } from '@/utils/generateImageURL';
import Image from 'next/image';

const formatEventDate = (dateString) => {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
        return "";
    }
};

const PortfolioDetails = ({ data }) => {
    const { project, otherProjects, pageDetails } = data;
    const { storeProducts = [], testimonial, eventDate, client, location, markets = [], studios = [], portfolioCategories = [] } = project;

    const { otherProjectsTitle, featuredProductTitle } = pageDetails;

    const testimonialAuthorImg = testimonial?.authorImage
        ? generateImageURLAlternate({ wix_url: typeof testimonial.authorImage === 'string' ? testimonial.authorImage : testimonial.authorImage?.url || '' })
        : null;

    return (
        <>
            <EventHighLight data={project} />
            <EventGallery data={project?.galleryImages || []} />

            {/* Project Meta Row */}
            {(client || location || eventDate || markets.length > 0 || studios.length > 0) && (
                <div className='w-full xl:px-[182px] sm:px-[70px] px-[24px] py-[60px] border-b border-primary-border'>
                    <div className='flex flex-wrap gap-x-[48px] gap-y-[24px]'>
                        {client && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Client</span>
                                <span className='font-haasRegular uppercase text-[14px] text-secondary-alt'>{client}</span>
                            </div>
                        )}
                        {location && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Location</span>
                                <span className='font-haasRegular uppercase text-[14px] text-secondary-alt'>{location}</span>
                            </div>
                        )}
                        {eventDate && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Date</span>
                                <span className='font-haasRegular uppercase text-[14px] text-secondary-alt'>{formatEventDate(eventDate)}</span>
                            </div>
                        )}
                        {markets.length > 0 && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Market</span>
                                <span className='font-haasRegular uppercase text-[14px] text-secondary-alt'>{markets.map(m => m.category || m.title).join(', ')}</span>
                            </div>
                        )}
                        {studios.length > 0 && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Studio</span>
                                <span className='font-haasRegular uppercase text-[14px] text-secondary-alt'>{studios.map(s => s.name).join(', ')}</span>
                            </div>
                        )}
                        {portfolioCategories.length > 0 && (
                            <div className='flex flex-col gap-y-[4px]'>
                                <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-60'>Category</span>
                                <div className='flex flex-wrap gap-[6px]'>
                                    {portfolioCategories.map((cat, i) => (
                                        <span key={i} className='font-haasRegular uppercase text-[12px] border border-secondary-alt px-[8px] py-[2px] text-secondary-alt'>{cat.title || cat.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Testimonial */}
            {testimonial?.quote && (
                <div className='w-full xl:px-[182px] sm:px-[70px] px-[24px] py-[80px] border-b border-primary-border bg-primary-alt'>
                    <blockquote className='flex flex-col gap-y-[24px]'>
                        <span className='font-recklessRegular lg:text-[40px] lg:leading-[44px] text-[24px] leading-[28px] text-secondary-alt italic'>&ldquo;{testimonial.quote}&rdquo;</span>
                        {(testimonial.authorName || testimonial.authorImage) && (
                            <div className='flex items-center gap-x-[16px]'>
                                {testimonialAuthorImg && (
                                    <div className='w-[56px] h-[56px] rounded-full overflow-hidden flex-shrink-0'>
                                        <Image src={testimonialAuthorImg} alt={testimonial.authorName || ''} width={56} height={56} className='object-cover w-full h-full' />
                                    </div>
                                )}
                                <div className='flex flex-col gap-y-[2px]'>
                                    {testimonial.authorName && (
                                        <span className='font-haasBold uppercase text-[14px] text-secondary-alt'>{testimonial.authorName}</span>
                                    )}
                                    {testimonial.authorRole && (
                                        <span className='font-haasRegular uppercase text-[12px] text-secondary-alt opacity-70'>{testimonial.authorRole}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </blockquote>
                </div>
            )}

            <FeaturedProducts classes={'z-10'} data={storeProducts.map((product) => ({ product }))} pageDetails={{ featuredProjectTitle: featuredProductTitle || "Products featured in this PROJECT entry:" }} loop={false} origin="auto" />
            <div className='mt-16 sm:px-0 px-[12px] pb-12 flex items-center flex-col lg:border-b max-lg:border border-primary-border'>
                <SectionTitle text={otherProjectsTitle || "OTHER PROJECTS"} classes="lg:!text-[200px] lg:!leading-[160px] sm:!text-[65px] sm:!leading-[50px] lg:py-[20px] py-[20px] md:mt-6 lg:mt-0" />
            </div>
            <OurProjects data={otherProjects} />
        </>
    )
}

export default PortfolioDetails
