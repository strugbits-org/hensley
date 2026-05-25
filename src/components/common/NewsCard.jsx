import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { CustomLink } from './CustomLink';
import { MarketsStudiosTags } from '../Blogs/MarketsStudiosTags';

function NewsCard({ data, classes }) {

    const { blogRef, author, slug, markets, studios, blogCategories } = data;
    const { title, publishedDate, coverImage } = blogRef;

    let formattedDate = "";
        
    if (publishedDate) {
        const dateObj = new Date(publishedDate);
        formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
   
    const metaInfoArray = [
        formattedDate,
        author?.nickname || ""
    ].filter(Boolean);

    const metaInfoString = metaInfoArray.join('-');

    return (
        <CustomLink to={`/posts/${slug}`} className={`relative group border cursor-pointer border-primary-border hover:border-secondary-alt pb-6 ${classes}`}>
            <div className='overflow-hidden'>
                <PrimaryImage alt={title} url={coverImage} size="card" customClasses={"h-full w-full min-h-[300px] max-h-[300px] lg:min-h-[528px] lg:max-h-[528px] 3xl:min-h-[900px] 3xl:max-h-[900px] object-cover transition-transform duration-300 group-hover:scale-105"} />
            </div>

            <div className='w-full flex gap-1 p-6 pb-0'>
                <div className='grow'>
                    <h2 className="uppercase text-[16px] leading-[18px] lg:text-[18px] lg:leading-[20px] 3xl:text-[28px] 3xl:leading-[32px] text-secondary-alt font-haasRegular mb-3">
                        {title}
                    </h2>
                </div>
                <div className='w-1/3 flex justify-end'>
                    <PrimaryImage
                        url={"/icons/0e0ac5_87d58241be704c008a2500d6691fb318.png"}
                        alt="Arrow"
                        customClasses="h-[20px] group-hover:lg:h-[44px] object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>
            <div className='px-6'>
                <p className='text-[12px] 3xl:text-[18px] leading-[20px] 3xl:leading-[28px] text-secondary-alt font-haasRegular mb-3 uppercase'>{metaInfoString}</p>

                <MarketsStudiosTags markets={markets} studios={studios} categories={blogCategories} />
            </div>
        </CustomLink>
    );
}

export default NewsCard;
