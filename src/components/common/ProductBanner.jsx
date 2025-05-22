import React from 'react'
import { PrimaryImage } from './PrimaryImage';
import { CustomLink } from './CustomLink';
export const ProductBanner = ({ data }) => {
    const { title, image, url } = data;
    return (
        <li className="relative col-span-3 lg:h-[425px] sm:h-[230px] h-[600px] border my-[24px]">
            <PrimaryImage url={image} alt={`Banner for ${title}`} customClasses={"w-full h-full absolute inset-0 bg-cover bg-center "} />
            <CustomLink to={url} className='absolute inset-0 z-20 flex justify-end items-center lg:gap-x-[24px] sm:gap-x-[10px] lg:mr-[239px] sm:mr-[100px] gap-x-[15px] '>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 132.853 132.854"
                    className="lg:h-[132px] lg:w-[132px]
                sm:h-[70px]
                sm:w-[70px]
                h-[148px]
                w-[148px]
                "
                >
                    <g transform="translate(0.702 0.379)">
                        <g transform="translate(-0.377 0.121)">
                            <path
                                d="M.353.5H131.881V132.028"
                                transform="translate(0.147 -0.501)"
                                fill="none"
                                stroke="#F4F1EC"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                            <line
                                x1="132"
                                y2="132"
                                transform="translate(0.028 0)"
                                fill="none"
                                stroke="#F4F1EC"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                            <line
                                x1="132"
                                y2="132"
                                transform="translate(0.028 0)"
                                fill="none"
                                stroke="#F4F1EC"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                        </g>
                    </g>
                </svg>
                <h3 className="text-white font-haasRegular
            lg:text-[24px]
            lg:leading-[30px]
            sm:text-[12px]
            sm:leading-[12px]
            text-[27px]
            uppercase
            max-w-[200px]
            ">
                    {title}
                </h3>
            </CustomLink>
        </li>
    )
}