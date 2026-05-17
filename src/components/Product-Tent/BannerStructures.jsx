import React from 'react';
import { Button } from './Button';
import { getAdditionalInfoSection, resolveCoreMediaUrl } from '@/utils';
import { CustomLink } from '../common/CustomLink';

const BannerStructures = ({ title, data }) => {
    const { additionalInfoSections = [] } = data;
    const info = getAdditionalInfoSection(additionalInfoSections, "INFO");
    const pros = getAdditionalInfoSection(additionalInfoSections, "PROS");
    const cons = getAdditionalInfoSection(additionalInfoSections, "CONS");

    const bgUrl = resolveCoreMediaUrl(data.mainMedia, "tablet");

    return (
        <div className='w-full flex flex-col items-center sm:px-0 px-[18px] lg:py-0 py-[48px] justify-between lg:h-[1872px] sm:h-[950px] bg-cover bg-no-repeat bg-top ' style={{ backgroundImage: `url(${bgUrl})` }}>
            <div className='lg:px-[10px] lg:max-w-[1557px] sm:max-w-[490px] lg:mt-[197px] w-full flex flex-col justify-center items-center border-t border-t-primary-alt'>

                <div className='w-full flex items-center justify-between mb-14 mt-14'>
                    <h3 className='text-[45px] sm:text-[58px] lg:text-[120px] 
                        leading-[48px] sm:leading-[60px] lg:leading-[120px] 
                        text-white font-recklessRegular uppercase'>{title}</h3>
                    <CustomLink to={"/types-of-tents"} className='flex items-center justify-center tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] lg:w-[292px] w-full text-white uppercase text-[12px] font-haasRegular'>
                        see gallery
                    </CustomLink>
                </div>

                <div className={`w-full py-[16px] flex lg:flex-row flex-col lg:border-b border-t border-t-primary-alt ${!info && !pros && !cons ? "lg:border-b-0" : ""}`}>
                    {[info, pros, cons].filter(Boolean).map((item, index) => (
                        <div key={index} className='lg:w-1/2 flex flex-col gap-y-[24px] lg:mb-0 mb-[16px] border-b border-b-primary-alt lg:border-0 pb-4'>
                            <div className="text-[16px] leading-[25px] text-white font-haasRegular uppercase [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
                                {item}
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
            <Button text="add to quote" classes={"lg:!hidden !block sm:!w-[492px] sm:!h-[90px]"} />
        </div>
    )
}

export default BannerStructures;