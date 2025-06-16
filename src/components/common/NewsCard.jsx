import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { formatDate } from '@/utils';
import { Tag } from './helpers/Tag';

function NewsCard({ data }) {

    const { blogRef, author, slug, markets, studios } = data;
    const { title, coverImage } = blogRef;

    return (
        <div className="relative group border cursor-pointer border-primary-border pb-6">
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
                <p className='text-[12px] leading-[20px] text-secondary-alt font-haasRegular mb-3'>{formatDate(blogRef.publishedDate)} - {author.nickname}</p>

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
                    {studios.length > 1 ? (
                        <Tag text={`+${studios.length - 1} studios`} />
                    ) : null}
                </ul>
            </div>
        </div>
    );
}

export default NewsCard;