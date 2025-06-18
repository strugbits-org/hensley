import React from 'react';
import { PrimaryImage } from '../common/PrimaryImage';
import { formatDate } from '@/utils';
import { Tag } from '../common/helpers/Tag';
import { CustomLink } from '../common/CustomLink';

function BlogCard({ data }) {
    const { slug, author, blogRef, markets, studios } = data;

    const arrowImageUrl = "https://static.wixstatic.com/media/0e0ac5_87d58241be704c008a2500d6691fb318~mv2.png";

    return (
        <div className="relative group border border-primary-border pb-6">
            <CustomLink to={`/posts/${slug}`}>
                <PrimaryImage
                    alt={blogRef.title}
                    url={blogRef.coverImage}
                    customClasses="h-full w-full object-cover min-h-[528px] max-h-[528px]"
                />
            </CustomLink>


            <div className='w-full flex gap-1 p-6 pb-0'>
                <div className='grow'>
                    <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular mb-3">
                        {blogRef.title}
                    </h2>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <PrimaryImage
                        url={arrowImageUrl}
                        alt="Arrow"
                        customClasses="h-[20px] group-hover:lg:h-[44px] object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            <div className='px-6'>
                <p className='text-[12px] leading-[20px] text-secondary-alt font-haasRegular mb-3'>
                    {formatDate(blogRef.publishedDate)} - {author?.nickname || author?.firstName || author?.lastName}
                </p>

                <ul className="flex gap-2 flex-wrap">
                    {markets.map((market, index) => (
                        <Tag key={index} text={market.category} />
                    ))}
                    {studios.map((studio, index) => (
                        <React.Fragment key={index}>
                            {index < 1 && (
                                <Tag text={studio.name} />
                            )}
                        </React.Fragment>
                    ))}
                    {studios.length > 1 && (
                        <Tag text={`+${studios.length - 1} studios`} />
                    )}
                </ul>
            </div>
        </div>
    );
}

export default BlogCard;
