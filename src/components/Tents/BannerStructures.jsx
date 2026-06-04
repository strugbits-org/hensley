import React from 'react'
import { Button } from './Button'
import { getAdditionalInfoSection, resolveCoreMediaUrl } from '@/utils';
import { CustomLink } from '../common/CustomLink';

const BannerStructures = ({ tent, data = {} }) => {
    const { additionalInfoSections = [] } = data;
    const info = getAdditionalInfoSection(additionalInfoSections, "INFO");
    const pros = getAdditionalInfoSection(additionalInfoSections, "PROS");
    const cons = getAdditionalInfoSection(additionalInfoSections, "CONS");

    const bgUrl = resolveCoreMediaUrl(data.mainMedia, "tablet");

    // Derive the tent slug for linking, stripping any leading slash
    const tentSlug = (data.slug || tent?.tent?.slug || tent?.slug || "").replace(/^\//, "");
    const tentName = data.name || tent?.tent?.name || tent?.title || "";

    return (
        <div className='w-full flex flex-col items-center sm:px-0 px-[18px] lg:py-0 py-[48px] justify-between lg:h-[1872px] 3xl:h-[97.5vw] sm:h-[950px] bg-cover bg-center ' style={{ backgroundImage: `url(${bgUrl})` }}
        >
            <div className='lg:px-[10px] lg:max-w-[1557px] 3xl:max-w-[2400px] sm:max-w-[490px] lg:mt-[197px] 3xl:mt-[280px] w-full flex flex-col justify-center items-center'>

                <div className='w-full flex items-center justify-between'>
                    <h3 className='lg:text-[120px] lg:leading-[55px]
                    3xl:text-[170px]
                    3xl:leading-[90px]
                    sm:text-[58px]
                    sm:leading-[70px]
                    text-[45px]
                    leading-[55px]
                    text-white font-recklessRegular uppercase '>{tentName}</h3>
                    <CustomLink to={`/tent/${tentSlug}`} >
                        <Button text="add to quote" classes={"xl:!height-[130px] xl:!w-[450px] lg:!w-[300px] lg:!h-[130px] 3xl:!w-[600px] 3xl:!h-[180px] lg:block hidden"} />
                    </CustomLink>
                </div>

                <div className='w-full py-[16px] 3xl:py-[28px] flex lg:flex-row flex-col lg:border-b border-t border-white'>
                    <div className='lg:w-1/2 flex flex-col gap-y-[24px] 3xl:gap-y-[40px] lg:mb-0 mb-[16px]'>

                        <span className='text-[16px] leading-[25px] 3xl:text-[24px] 3xl:leading-[34px] text-white font-haasRegular uppercase block'>
                            {info}
                        </span>
                    </div>

                    <div className='lg:w-1/2 lg:border-none border-t lg:pt-0 pt-[16px] text-white font-haasRegular uppercase text-[16px] leading-[25px] 3xl:text-[24px] 3xl:leading-[34px]'>
                        {pros}
                    </div>
                </div>
                <div className='lg:self-end lg:border-none sm:border-t border-white lg:py-0 py-[16px] lg:mt-[211px] 3xl:mt-[300px] lg:max-w-[292px] 3xl:max-w-[440px] w-full lg:gap-y-[110px] 3xl:gap-y-[150px] gap-y-[16px] flex flex-col'>
                    <CustomLink to={"/types-of-tents"} className='flex justify-center items-center tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] 3xl:h-[80px] lg:w-[292px] 3xl:w-[440px] w-full text-white uppercase text-[12px] 3xl:text-[20px] font-haasRegular'>
                        see gallery
                    </CustomLink>
                    <div className='text-[16px] leading-[25px] 3xl:text-[24px] 3xl:leading-[34px] text-white font-haasRegular uppercase block'>
                        {cons}
                    </div>
                </div>
            </div>
            <CustomLink to={`/tent/${tentSlug}`} >
                <Button text="add to quote" classes={"lg:!hidden !block sm:!w-[492px] sm:!h-[90px]"} />
            </CustomLink>
        </div>
    )
}

export default BannerStructures

