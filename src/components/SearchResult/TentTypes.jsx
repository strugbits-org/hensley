import React from 'react'
import Image from 'next/image'
import SectionTitle from '../common/SectionTitle'
import { PrimaryImage } from '../common/PrimaryImage'
import { getAdditionalInfoSection } from '@/utils'
import { CustomLink } from '../common/CustomLink'


const TentCards = ({ data }) => {
    const { product } = data;
    const info = getAdditionalInfoSection(product.additionalInfoSections, "INFO");


    return (
        <CustomLink to={`/tent/${product.slug}`} className="group p-[24px] h-[973px] border overflow-hidden ">
            <div className="w-full border h-full flex lg:flex-col lg:justify-between justify-center sm:px-[50px] px-[20px] lg:py-[24px] py-[44px] relative">
                <PrimaryImage url={product?.mainMedia} alt={product?.name} customClasses="absolute top-0 left-0 w-full h-full object-cover" />
                <div className='z-10 w-full'>
                    <span className='
                            text-white
                            text-[70px]
                            leading-[55px]
                            uppercase
                            font-recklessRegular
                            w-full break-words
                            '>{product?.name}</span>
                    <div className='mt-[21px] flex flex-col gap-y-[10px] border-t border-b border-white py-7 text-[16px] leading-[25px] text-white font-haasRegular uppercase'>
                        {info}
                    </div>
                </div>
                <Image
                    className='z-10 self-start lg:block hidden group-hover:w-[400px] group-hover:h-[400px] transition-all duration-300 ease-in-out'
                    height={34}
                    width={34}
                    src={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
                />

            </div>
        </CustomLink>
    )
}

const TentTypes = ({ data }) => {
    return (
        <div className='lg:px-[24px] px-[12px] w-full h-full'>
            <SectionTitle text="TENTS OF TYPE" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
            <div className='w-full h-full grid lg:grid-cols-3 sm:grid-cols-1 gap-x-[24px] lg:gap-y-[20px] gap-y-[13px]'>
                {data.map((item, index) => (
                    <TentCards key={index} data={item} />
                ))}
            </div>
        </div>
    )
}

export default TentTypes