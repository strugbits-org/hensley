import React from 'react'
import { MarketsStudiosTags } from '../Blogs/MarketsStudiosTags';
import { formatDate, resolveCoreMediaUrl } from '@/utils';

const EventHighLight = ({ data }) => {
    const { author, blogRef, markets, studios } = data;
    const imageURL = resolveCoreMediaUrl(blogRef.coverImage, "tablet") || "";
    const authorName = author?.nickname || "";
    const formattedDate = blogRef?.publishedDate ? formatDate(blogRef.publishedDate) : "";
    const dateAuthorLine = [formattedDate, authorName].filter(Boolean).join(" - ");
    
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    }
    
    if (!data) return;
    return (
        <div className='px-[24px] 3xl:px-[40px] w-full'>
            <div className='w-full border-b py-[24px] 3xl:py-[36px]'>
                <div className='w-full h-[609px] 3xl:h-[900px] bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url("${imageURL}")` }}></div>
            </div>
            <div className='flex lg:flex-row flex-col gap-x-[182px] 3xl:gap-x-[280px] lg:px-0 sm:px-[70px] px-[20px] py-[40px] 3xl:py-[60px] justify-between relative'>
                <div className='lg:w-1/2 flex flex-col gap-y-[15px] 3xl:gap-y-[24px]'>
                    <span className='font-haasRegular uppercase text-[12px] 3xl:text-[18px] text-secondary-alt block '>{markets[0]?.category || ""}</span>

                    <span className='uppercase text-secondary-alt lg:text-[60px] lg:leading-[55px] 3xl:text-[90px] 3xl:leading-[82px] sm:text-[35px] sm:leading-[32px] text-[25px] leading-[23px] font-recklessRegular block
                '>
                        {blogRef.title}
                    </span>

                    <span className='font-haasRegular uppercase text-[12px] text-secondary-alt lg:hidden block '>{dateAuthorLine}</span>
                    <MarketsStudiosTags markets={markets} studios={studios} count={2} />

                </div>
                <div className='lg:w-1/2 text-right flex flex-col gap-y-[15px] 3xl:gap-y-[24px] '>
                    <span className='font-haasRegular uppercase text-[12px] 3xl:text-[18px] text-secondary-alt lg:block hidden '>{dateAuthorLine}</span>
                    <span className='font-haasRegular uppercase text-[12px] 3xl:text-[18px] 3xl:leading-[28px] text-secondary-alt text-left block max-lg:mt-[60px] '>{blogRef.excerpt}</span>
                </div>

                <button onClick={scrollToBottom}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36.355"
                        height="36.562"
                        className="absolute left-1/2 transform -translate-x-1/2 bottom-5 3xl:bottom-8 3xl:w-[52px] 3xl:h-[52px] lg:block hidden"
                        viewBox="0 0 36.355 36.562"
                    >
                        <g id="Group_3530" data-name="Group 3530" transform="translate(35.855 18.178) rotate(135)">
                            <path id="Path_3283" data-name="Path 3283" d="M.354.5h25v25" transform="translate(-0.354 -0.501)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            <line id="Line_13" data-name="Line 13" x1="25" y2="25" transform="translate(0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            <line id="Line_14" data-name="Line 14" x1="25" y2="25" transform="translate(0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                        </g>
                    </svg>
                </button>

            </div>
        </div>
    )
}

export default EventHighLight