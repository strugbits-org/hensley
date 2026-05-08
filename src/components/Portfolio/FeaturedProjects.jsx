import React from 'react';
import { fetchFeaturedProjects } from '@/services/projects';
import { generateImageURLAlternate } from '@/utils/generateImageURL';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';

const FeaturedProjectCard = ({ project }) => {
    const { slug, portfolioRef, excerpt, eventDate } = project;
    const imageUrl = generateImageURLAlternate({ wix_url: portfolioRef.heroImage || portfolioRef.coverImage.imageInfo });
    const displayExcerpt = excerpt || portfolioRef.description?.slice(0, 120) || '';
    const formattedDate = eventDate
        ? new Date(eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';

    return (
        <Link href={`/project/${slug}`} className='group flex flex-col border border-primary-border hover:bg-primary transition-all duration-300 ease-in-out'>
            <div className='overflow-hidden w-full aspect-[4/3]'>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={portfolioRef.title}
                        width={800}
                        height={600}
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                ) : (
                    <div className='w-full h-full bg-primary-border' />
                )}
            </div>
            <div className='p-[24px] flex flex-col gap-y-[12px] flex-1'>
                {formattedDate && (
                    <span className='font-haasRegular uppercase text-[11px] text-secondary-alt opacity-70'>{formattedDate}</span>
                )}
                <span className='font-recklessRegular text-[22px] leading-[24px] uppercase text-secondary-alt'>
                    {portfolioRef.title}
                </span>
                {displayExcerpt && (
                    <span className='font-haasRegular text-[13px] leading-[18px] uppercase text-secondary-alt line-clamp-3'>
                        {displayExcerpt}
                    </span>
                )}
                <span className='font-haasRegular uppercase text-[12px] text-secondary-alt mt-auto pt-[12px] tracking-[2px] group-hover:tracking-[4px] transition-all duration-300'>
                    View Project
                </span>
            </div>
        </Link>
    );
};

const FeaturedProjects = async ({ limit = 3, title = 'Featured Projects' }) => {
    const projects = await fetchFeaturedProjects(limit);

    if (!projects?.length) return null;

    return (
        <section className='w-full'>
            <SectionTitle text={title} classes='lg:bg-primary-alt pt-[36px] pb-[44px]' />
            <div className='w-full lg:px-[24px] px-[12px] py-[24px] grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[24px]'>
                {projects.map((project) => (
                    <FeaturedProjectCard key={project._id || project.slug} project={project} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProjects;
