import React from 'react'
import { formatDate } from '@/utils';
import { generateImageURLAlternate } from '@/utils/generateImageURL';

const EventHighLight = ({ data }) => {
    const { portfolioRef, markets } = data;
    const imageURL = generateImageURLAlternate({ wix_url: portfolioRef.coverImage.imageInfo });

    console.log("portfolioRef", portfolioRef);
    

    return (
        <div className='px-[24px] w-full'>
            <div className='w-full border-b py-[24px]'>
                <div className='w-full h-screen bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${imageURL})` }}></div>
            </div>
            <div className='flex lg:flex-row flex-col gap-x-[182px] xl:px-[182px] sm:px-[70px] lg:pt-[200px] lg:pb-[129px] py-[60px] justify-between relative'>
                <div className='lg:w-1/2 flex flex-col gap-y-[15px]'>
                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                block
                '>{markets[0]?.category || ""}</span>

                    <span className='
                uppercase
                text-secondary-alt
                lg:text-[60px]
                lg:leading-[55px]
                sm:text-[35px]
                sm:leading-[32px]
                text-[25px]
                leading-[23px]
                font-recklessRegular
                block
                '>
                        {portfolioRef.title}
                    </span>

                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                lg:hidden
                mt-[39px]
                mb-[20px]
                block
                '>{formatDate(portfolioRef._updatedDate)} </span>

                </div>
                <div className='lg:w-1/2 text-left flex flex-col lg:gap-y-[15px] '>
                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                lg:block
                hidden
                '>{formatDate(portfolioRef._updatedDate)} </span>
                    <span className='
                font-haasRegular
                uppercase
                text-[16px]
                text-secondary-alt
                text-left
                block
                whitespace-pre-line
                '>{portfolioRef.description}</span>
                </div>
            </div>
        </div>
    )
}

export default EventHighLight