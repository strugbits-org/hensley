"use client";
import React from 'react'
import EventHighLight from './EventHighLight'
import EventGallery from './EventGallery'
import { FeaturedProducts } from '../Product/FeaturedProducts';
import OurProjects from '../Collections/OurProjects';
import SectionTitle from '../common/SectionTitle';

const PortfolioDetails = ({ data }) => {
    const { project, otherProjects, pageDetails } = data;
    const { storeProducts = [] } = project;

    const { otherProjectsTitle, featuredProductTitle } = pageDetails;

    return (
        <>
            <EventHighLight data={project} />
            <EventGallery data={project?.galleryImages || []} />
            <FeaturedProducts classes={'z-10'} data={storeProducts.map((product) => ({ product }))} pageDetails={{ featuredProjectTitle: featuredProductTitle || "Products featured in this PROJECT entry:" }} loop={false} origin="auto" />
            <div className='mt-16 sm:px-0 px-[12px] pb-12 flex items-center flex-col lg:border-b max-lg:border border-primary-border'>
                <SectionTitle text={otherProjectsTitle || "OTHER PROJECTS"} classes="lg:!text-[200px] lg:!leading-[160px] sm:!text-[65px] sm:!leading-[50px] lg:py-[20px] py-[20px] md:mt-6 lg:mt-0" />
            </div>
            <OurProjects data={otherProjects} />
        </>
    )
}

export default PortfolioDetails