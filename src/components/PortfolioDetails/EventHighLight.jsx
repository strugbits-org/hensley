import React from 'react'
import { formatDate } from '@/utils';
import { resolveCoreMediaUrl } from '@/utils';

const formatEventDate = (dateString) => {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
        return "";
    }
};

const EventHighLight = ({ data }) => {
    const { portfolioRef, markets, publishDate, eventDate, client, location } = data;
    // Prefer heroImage, fall back to coverImage
    const rawBgImageUrl = resolveCoreMediaUrl(portfolioRef.heroImage || portfolioRef.coverImage?.imageInfo, "tablet");
    const bgImageUrl = rawBgImageUrl ? rawBgImageUrl.replace(/\s/g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29") : "";
    const displayDate = eventDate ? formatEventDate(eventDate) : formatDate(publishDate);

    return (
        <div className='px-[24px] 3xl:px-[40px] w-full'>
            <div className='w-full border-b py-[24px] 3xl:py-[36px]'>
                <div className='w-full h-screen bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${bgImageUrl})` }}></div>
            </div>
            <div className='flex lg:flex-row flex-col gap-x-[182px] 3xl:gap-x-[280px] xl:px-[182px] 3xl:px-[280px] sm:px-[70px] lg:pt-[200px] lg:pb-[129px] 3xl:pt-[300px] 3xl:pb-[190px] py-[60px] justify-between relative'>
                <div className='lg:w-1/2 flex flex-col gap-y-[15px] 3xl:gap-y-[24px]'>
                    <span className='font-haasRegular uppercase text-[18px] 3xl:text-[26px] text-secondary-alt block '>{markets[0]?.category || ""}</span>
                    <span className='uppercase text-secondary-alt lg:text-[60px] lg:leading-[55px] 3xl:text-[90px] 3xl:leading-[82px] sm:text-[35px] sm:leading-[32px] text-[25px] leading-[23px] font-recklessRegular block '>
                        {portfolioRef.title}
                    </span>
                    <span className='font-haasRegular uppercase text-[18px] 3xl:text-[26px] text-secondary-alt lg:hidden mt-[39px] mb-[20px] block'>{displayDate}</span>
                </div>
                <div className='lg:w-1/2 text-left flex flex-col lg:gap-y-[15px] 3xl:gap-y-[24px] '>
                    <span className='font-haasRegular uppercase text-[18px] 3xl:text-[26px] text-secondary-alt lg:block hidden'>{displayDate}</span>
                    <span className='font-haasRegular uppercase text-[16px] 3xl:text-[24px] 3xl:leading-[34px] text-secondary-alt text-left block whitespace-pre-line '>{portfolioRef.description}</span>
                </div>
            </div>
        </div>
    )
}

export default EventHighLight;
