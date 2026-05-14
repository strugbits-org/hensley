import React from 'react';
import Image from 'next/image';
import { PrimaryImage } from '../common/PrimaryImage';
import { MarketsStudiosTags } from './MarketsStudiosTags';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import arrowDark from '@/assets/icons/arrow-dark.svg';

function BlogCard({ data, handleFilterChange, selectedTags }) {
    const { slug, author, blogRef, markets, studios, blogCategories } = data;

    const redirectWithLoader = useRedirectWithLoader();

    const handleRedirection = () => {
        redirectWithLoader(`/posts/${slug}`);
    }

    return (
        <div onClick={handleRedirection} className="relative group border border-primary-border pb-6 cursor-pointer">
            <PrimaryImage
                alt={blogRef.title}
                url={blogRef.coverImage}
                size="card"
                customClasses="h-full w-full object-cover min-h-[528px] max-h-[528px]"
            />


            <div className='w-full flex gap-1 p-6 pb-0'>
                <div className='grow'>
                    <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular mb-3">
                        {blogRef.title}
                    </h2>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <Image
                        src={arrowDark}
                        alt="Arrow"
                        className="h-[20px] group-hover:lg:h-[44px] w-auto object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            <div className='px-6'>
                <p className='text-[12px] leading-[20px] text-secondary-alt font-haasRegular mb-3'>
                    {author?.nickname || author?.firstName || author?.lastName}
                </p>

                <MarketsStudiosTags markets={markets} studios={studios} categories={blogCategories} handleFilterChange={handleFilterChange} selectedTags={selectedTags} />
            </div>
        </div>
    );
}

export default BlogCard;
