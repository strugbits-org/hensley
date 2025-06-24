import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { formatDate } from '@/utils';
import { CustomLink } from './CustomLink';
import { MarketsStudiosTags } from '../Blogs/MarketsStudiosTags';

function NewsCard({ data, classes }) {

    const { blogRef, author, slug, markets, studios, blogCategories } = data;
    const { title, coverImage } = blogRef;

    return (
        <CustomLink to={`/posts/${slug}`} className={`relative group border cursor-pointer border-primary-border hover:border-secondary-alt pb-6 ${classes}`}>
            <div className='overflow-hidden'>
                <PrimaryImage alt={title} url={coverImage} customClasses={"h-full w-full min-h-[528px] max-h-[528px] object-cover transition-transform duration-300 group-hover:scale-105"} />
            </div>

            <div className='w-full flex gap-1 p-6 pb-0'>
                <div className='grow'>
                    <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular mb-3">
                        {title}
                    </h2>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <PrimaryImage
                        url={"https://static.wixstatic.com/media/0e0ac5_87d58241be704c008a2500d6691fb318~mv2.png"}
                        alt="Arrow"
                        customClasses="h-[20px] group-hover:lg:h-[44px] object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>
            <div className='px-6'>
                <p className='text-[12px] leading-[20px] text-secondary-alt font-haasRegular mb-3 uppercase'>{formatDate(blogRef.publishedDate)} - {author.nickname}</p>
                <MarketsStudiosTags markets={markets} studios={studios} categories={blogCategories} />
            </div>
        </CustomLink>
    );
}

export default NewsCard;