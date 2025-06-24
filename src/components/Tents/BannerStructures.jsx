import React from 'react'
import { Button } from './Button'
import { getAdditionalInfoSection } from '@/utils';
import { generateImageURL } from '@/utils/generateImageURL';
import { CustomLink } from '../common/CustomLink';
const BannerStructures = ({ tent, data = {} }) => {
    console.log("tent", tent);


    const { additionalInfoSections = [] } = data;
    const info = getAdditionalInfoSection(additionalInfoSections, "INFO");
    const pros = getAdditionalInfoSection(additionalInfoSections, "PROS");
    const cons = getAdditionalInfoSection(additionalInfoSections, "CONS");


    return (
        <div className='w-full flex flex-col items-center sm:px-0 px-[18px] lg:py-0 py-[48px] justify-between lg:h-[1872px] sm:h-[950px] bg-cover bg-center ' style={{ backgroundImage: `url(${generateImageURL({ wix_url: data.mainMedia })})` }}
        >
            <div className='lg:px-[10px] lg:max-w-[1557px] sm:max-w-[490px] lg:mt-[197px]  w-full flex flex-col justify-center items-center'>

                <div className='w-full flex items-center justify-between'>
                    <h3 className='lg:text-[120px] lg:leading-[55px]
                    sm:text-[58px]
                    sm:leading-[70px]
                    text-[45px]
                    leading-[55px]
                    text-white font-recklessRegular uppercase '>{tent?.tent?.name || ""}</h3>
                    <CustomLink to={`/tent/${tent?.tent?.slug}`} >
                        <Button text="add to quote" classes={"xl:!height-[130px] xl:!w-[450px] lg:!w-[300px] lg:!h-[130px] lg:block hidden"} />
                    </CustomLink>
                </div>

                <div className='w-full py-[16px] flex lg:flex-row flex-col lg:border-b border-t border-white'>
                    <div className='lg:w-1/2 flex flex-col gap-y-[24px] lg:mb-0 mb-[16px]'>

                        <span className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                            {info}
                        </span>
                    </div>

                    <div className='lg:w-1/2 lg:border-none border-t lg:pt-0 pt-[16px] text-white font-haasRegular uppercase'>
                        {pros}
                    </div>
                </div>
                <div className='lg:self-end lg:border-none sm:border-t border-white lg:py-0 py-[16px] lg:mt-[211px] lg:max-w-[292px] w-full lg:gap-y-[110px] gap-y-[16px] flex flex-col'>
                    <CustomLink to={"/types-of-tents"} className='flex justify-center items-center tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] lg:w-[292px] w-full text-white uppercase text-[12px] font-haasRegular'>
                        see gallery
                    </CustomLink>
                    <div className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                        {cons}
                    </div>
                </div>
            </div>
            <CustomLink to={`/tent/${tent?.tent?.slug}`} >
                <Button text="add to quote" classes={"lg:!hidden !block sm:!w-[492px] sm:!h-[90px]"} />
            </CustomLink>
        </div>
    )
}

export default BannerStructures

