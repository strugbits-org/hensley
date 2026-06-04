import React from 'react';
import { Tag } from '../common/helpers/Tag';
import { PrimaryImage } from '../common/PrimaryImage';
import { CustomLink } from '../common/CustomLink';

function FeaturedBlogCard({ data, classes }) {
    const { blogRef, markets, studios, slug, author } = data;
    const title = blogRef?.title;
    const coverImage = blogRef?.coverImage;

    return (
        <CustomLink to={`/posts/${slug}`} className={`${classes} relative group border border-primary-border pb-2 3xl:pb-4`}>
            <PrimaryImage alt={title} url={coverImage} size="card" customClasses={"h-full w-full object-cover min-h-[528px] max-h-[528px] 3xl:min-h-[760px] 3xl:max-h-[760px]"} />
            <div className='w-full flex gap-1 p-6 3xl:p-8 pb-0 3xl:pb-0'>
                <div className='grow'>
                    <h2 className="uppercase lg:text-[18px] lg:leading-[20px] 3xl:text-[26px] 3xl:leading-[30px] text-secondary-alt font-haasRegular mb-3 3xl:mb-5">
                        {title}
                    </h2>
                </div>
                <div className='w-1/3 flex  justify-end'>
                    <PrimaryImage
                        url={"/icons/0e0ac5_87d58241be704c008a2500d6691fb318.png"}
                        alt="Arrow"
                        customClasses=" h-[20px] 3xl:h-[30px] group-hover:lg:h-[44px] object-contain transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>
            <div className='px-6 3xl:px-8'>
                <p className='text-[12px] leading-[20px] 3xl:text-[18px] 3xl:leading-[26px] text-secondary-alt font-haasRegular mb-3 3xl:mb-5'>{author?.nickname}</p>

                <ul className="flex gap-2 flex-wrap">
                    {markets?.map((market, index) => (
                        <Tag key={index} text={market.category} />
                    ))}
                    {studios?.map((studio, index) => (
                        <React.Fragment key={index}>
                            {index < 1 && (
                                <Tag text={studio.name} />
                            )}
                        </React.Fragment>
                    ))}
                    {studios?.length > 1 ? (
                        <Tag text={`+${studios.length - 1} studios`} />
                    ) : null}
                </ul>
            </div>
        </CustomLink>
    );
}

export default FeaturedBlogCard;

