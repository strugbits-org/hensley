import React from 'react'
import Image from 'next/image'
import image from '@/assets/tent-image-2.png'
import { Button } from './Button'
import { getAdditionalInfoSection } from '@/utils';
import { generateImageURL } from '@/utils/generateImageURL';
const BannerStructures = ({ title, data = {} }) => {

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
                    text-white font-recklessRegular uppercase '>{title}</h3>
                    <Button text="add to quote" classes={"xl:!height-[130px] xl:!w-[450px] lg:!w-[300px] lg:!h-[130px] lg:block hidden"} />
                </div>

                <div className='w-full py-[16px] flex lg:flex-row flex-col lg:border-b border-t border-white'>
                    <div className='lg:w-1/2 flex flex-col gap-y-[24px] lg:mb-0 mb-[16px]'>

                        <span className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                            {info}
                        </span>
                    </div>

                    <div className='lg:w-1/2 lg:border-none border-t lg:pt-0 pt-[16px] text-white font-haasRegular uppercase'>
                        {/* <span className='text-[16px] leading-[20px] text-white font-haasRegular uppercase'>
                            <b>pros</b>
                        </span>
                        <ul className="list-disc mt-2 ml-4 text-white marker:text-white">
                            <li className="mb-1 text-[16px] leading-[20px] font-haasRegular uppercase">
                                Heavy rig loads
                            </li>
                            <li className="mb-1 text-[16px] leading-[20px] font-haasRegular uppercase">
                                No scissor cables
                            </li>
                            <li className="mb-1 text-[16px] leading-[20px] font-haasRegular uppercase">
                                Multiple ballast types
                            </li>
                            <li className="text-[16px] leading-[20px] font-haasRegular uppercase">
                                No wallpole angle brace
                            </li>
                        </ul> */}

                        {pros}

                    </div>
                </div>
                <div className='lg:self-end lg:border-none sm:border-t border-white lg:py-0 py-[16px] lg:mt-[211px] lg:max-w-[292px] w-full lg:gap-y-[110px] gap-y-[16px] flex flex-col'>
                    <button className='tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] lg:w-[292px] w-full text-white uppercase text-[12px] font-haasRegular'>
                        see gallery
                    </button>
                    <div className='text-[16px] leading-[25px] text-white font-haasRegular uppercase block'>
                        {/* <span className='text-[16px] leading-[20px] mb-2 text-white font-haasRegular uppercase block'>
                            <b>pros</b>
                        </span>
                        <ul className="list-disc ml-4">
                            <li className="mb-1 text-[16px] leading-[20px] text-white font-haasRegular uppercase">
                                Heavy rig loads
                            </li>
                            <li className="mb-1 text-[16px] leading-[20px] text-white font-haasRegular uppercase">
                                No scissor cables
                            </li>
                            <li className="mb-1 text-[16px] leading-[20px] text-white font-haasRegular uppercase">
                                Multiple ballast types
                            </li>
                            <li className="text-[16px] leading-[20px] text-white font-haasRegular uppercase">
                                No wallpole angle brace
                            </li>
                        </ul> */}

                        {cons}

                    </div>
                </div>
            </div>
            <Button text="add to quote" classes={"lg:!hidden !block sm:!w-[492px] sm:!h-[90px]"} />
        </div>
    )
}

export default BannerStructures

