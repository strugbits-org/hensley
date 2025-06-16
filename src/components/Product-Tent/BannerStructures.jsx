import React from 'react';
import { Button } from './Button';
import { generateImageURL } from '@/utils/generateImageURL';
import { getAdditionalInfoSection } from '@/utils';

const BannerStructures = ({ title, data }) => {
    const { additionalInfoSections } = data;
    const info = getAdditionalInfoSection(additionalInfoSections, "INFO");
    const pros = getAdditionalInfoSection(additionalInfoSections, "PROS");
    const cons = getAdditionalInfoSection(additionalInfoSections, "CONS");

    return (
        <div className='w-full flex flex-col items-center sm:px-0 px-[18px] lg:py-0 py-[48px] justify-between lg:h-[1872px] sm:h-[950px] bg-cover bg-no-repeat bg-top ' style={{ backgroundImage: `url(${generateImageURL({ wix_url: data.mainMedia })})` }}>
            <div className='lg:px-[10px] lg:max-w-[1557px] sm:max-w-[490px] lg:mt-[197px] w-full flex flex-col justify-center items-center'>

                <div className='w-full flex items-center justify-between mb-14'>
                    <h3 className='lg:text-[120px] lg:leading-[55px]
                    sm:text-[58px]
                    sm:leading-[70px]
                    text-[45px]
                    leading-[55px]
                    text-white font-recklessRegular uppercase'>{title}</h3>
                    {/* <Button text="add to quote" classes={"xl:!height-[130px] xl:!w-[450px] lg:!w-[300px] lg:!h-[130px] lg:block hidden"} /> */}
                    <button className='tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] lg:w-[292px] w-full text-white uppercase text-[12px] font-haasRegular'>
                        see gallery
                    </button>
                </div>

                <div className={`w-full py-[16px] flex lg:flex-row flex-col lg:border-b border-t border-t-primary-alt ${!info && !pros && !cons ? "lg:border-b-0" : ""}`}>
                    {[info, pros, cons].filter(Boolean).map((item, index) => (
                        <div key={index} className='lg:w-1/2 flex flex-col gap-y-[24px] lg:mb-0 mb-[16px] border-b border-b-primary-alt lg:border-0 pb-4'>
                            <div className="text-[16px] leading-[25px] text-white font-haasRegular uppercase">
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