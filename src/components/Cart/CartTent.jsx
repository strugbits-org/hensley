import React from 'react'
import Image from 'next/image'
import image from '@/assets/small-tent.png';

const CartTent = () => {
    return (
        <div className='border px-[15px] py-[14px] flex w-full gap-x-[39px] relative'>
            <div className='
            h-[104px]
            w-[104px]
           bg-white
            '>
                <Image src={image} className='h-full w-full object-contain' />
            </div>
            <div className='flex lg:flex-row flex-col lg:items-center'>
                <div>
                    <span className='block text-[16px] text-secondary-alt font-haasLight uppercase'>Product</span>
                    <span className='block text-[16px] text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                lg:mb-[27px]
                '>structure</span>
                    <div className='grid sm:grid-cols-2 grid-cols-1 gap-x-[26px]'>
                        <div>
                            <span
                                className='
                text-[12px]
                text-secondary-alt
                font-haasBold
                uppercase
                mr-[20px]
                '
                            >Event Name</span>
                            <span className='
                text-[12px]
                text-secondary-alt
                font-haasLight
                uppercase
                '
                            >SI & BIEL WEDDING</span>
                        </div>

                        <div>

                            <span
                                className='
                text-[12px]
                text-secondary-alt
                font-haasBold
                uppercase
                mr-[20px]
                '
                            >Event Date</span>
                            <span className='
                text-[12px]
                text-secondary-alt
                font-haasLight
                uppercase
                
                '
                            >02/27/2024</span>
                        </div>


                        <div>
                            <span
                                className='
                text-[12px]
                text-secondary-alt
                font-haasBold
                uppercase
                mr-[20px]
                '
                            >Removal Date</span>
                            <span className='
                text-[12px]
                text-secondary-alt
                font-haasLight
                uppercase
                '
                            >02/27/2024</span>
                        </div>



                        <div>
                            <span
                                className='
                text-[12px]
                text-secondary-alt
                font-haasBold
                uppercase
                mr-[20px]
                '
                            >NUMBER OF GUESTS</span>
                            <span className='
                text-[12px]
                text-secondary-alt
                font-haasLight
                uppercase
                '
                            >220</span>
                        </div>


                        <div>
                            <span
                                className='
                text-[12px]
                text-secondary-alt
                font-haasBold
                uppercase
                mr-[20px]
                '
                            >ARE TH INSTALL/ REMOVAL DATES FLEXIBLE?</span>
                            <span className='
                text-[12px]
                text-secondary-alt
                font-haasLight
                uppercase
                '
                            >yes</span>
                        </div>


                    </div>
                </div>
                <div className='w-[280px] '>
                    <span className='block text-[12px] font-haasBold uppercase text-secondary-alt'>PLEASE PROVIDE ANY OTHER ADDICIONAL INFO</span>
                    <span className='block text-[12px] font-haasLight uppercase'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel diam est. Mauris mattis lacinia tellus, luctus accumsan libero euismod in. Aenean sagittis nibh odio, id vulputate mi ornare sit amet. In vitae sapien nec lorem vehicula ultrices sodales vitae lectus. Sed felis arcu, pretium eu mi sed, venenatis vulputate dui. Vivamus hendrerit velit et arcu placerat faucibus. Mauris ante dui, fringilla consectetur tortor nec, </span>
                </div>
            </div>
            <button className='absolute right-[24px] top-[66px]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                    <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                        <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                        <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                    </g>
                </svg>

            </button>
        </div>
    )
}


const CartCollection = () => {
    return (
        <div className='border px-[15px] py-[14px] flex w-full gap-x-[39px] relative'>
            <div className='
            h-[104px]
            w-[104px]
           bg-white
            '>
                <Image src={image} className='h-full w-full object-contain' />
            </div>
            <div className='w-full '>
                <div className='sm:flex hidden justify-between items-center sm:h-[104px]'>
                    <span className='block text-[16px] text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                lg:mb-[27px]
                '>romana collection</span>

                    <span className='block text-[16px] text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                lg:mb-[27px]
                mr-[100px]
                '>rs 210</span>
                    <button className='absolute right-[24px] top-[50px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                            <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                                <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                                <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                            </g>
                        </svg>

                    </button>
                </div>


                <div className='sm:hidden flex-col '>
                    <span className='block 
                    sm:text-[16px]
                    text-[20px]
                    text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                sm:mb-[27px]
                '>romana collection</span>

                    <span className='block 
                    sm:text-[16px]
                    text-[20px]
                     text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                sm:mb-[27px]
                mr-[100px]
                '>rs 210</span>
                    <button className='absolute right-[24px] top-[50px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                            <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                                <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                                <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" stroke-width="1" />
                            </g>
                        </svg>

                    </button>
                </div>
                <table className="sm:max-w-[766px] text-left border-separate border-spacing-y-[15px]">
                    <thead>
                        <tr className="text-xs uppercase text-gray-500 border-b border-black">
                            <td className="pb-2 w-1/4 lg:block hidden text-[16px] uppercase font-haasLight text-secondary-alt"></td>
                            <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt"></td>
                            <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt"></td>
                            <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { product: 'CHARGER', size: '-', price: '$5.80' },
                            { product: 'DINNER PLATE', size: '11"', price: '$2.65' },
                            { product: 'DINNER PLATE', size: '9"', price: '$2.65' },
                            { product: 'RICE BOWL', size: '-', price: '$2.65' },
                            { product: 'B&B', size: '-', price: '$2.65' },
                            { product: 'MUG', size: '-', price: '$2.65' },
                            { product: 'SERVING BOWL', size: '9"', price: '$10.80' },
                            { product: 'SERVING PLATTER', size: '12"', price: '$15.75' },
                        ].map((item, index) => (
                            <tr key={index}>
                                <td className="py-2 font-semibold lg:block hidden border-b ">{item.product}</td>
                                <td className="text-center border-b">{item.size}</td>
                                <td className="text-center border-b ">{item.price}</td>
                                <td className="border-b border-black">
                                    <div className="flex items-center justify-center gap-x-[30px]">
                                        <button className="text-xl font-light">−</button>
                                        <span className="font-bold">02</span>
                                        <button className="text-xl font-light">+</button>
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}



export { CartTent, CartCollection }