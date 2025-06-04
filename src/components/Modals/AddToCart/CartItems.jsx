import React from 'react'
import { AddToQuoteButton } from './AddtoQuoteButton';

const NormalCart = () => {

    return (
        <div className='w-full flex flex-col gap-y-[15px]'>
            <div className='w-full flex justify-between relative '>
                <span className='
            text-[35px]
            leading-[30px]
            text-secondary-alt
            font-recklessRegular
            uppercase
            '>RAMONA
                    DISH</span>
                <button className=' '>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                        <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                            <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                            <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                        </g>
                    </svg>

                </button>
            </div>
            <div className='w-full flex gap-x-[20px] justify-end '>
                <span
                    className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        block
        '
                >$70</span>
                <span
                    className='
        text-[25px]
        text-secondary-alt
        font-recklessRegular
        block
        uppercase
        '
                >(total)</span>
            </div>
            <table className="w-full text-left border-separate border-spacing-y-[15px]">
                <thead>
                    <tr className="text-xs max-lg:hidden uppercase text-gray-500 border-b border-black">
                        <td className="pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt">Product</td>
                        <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Size</td>
                        <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Price</td>
                        <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Quantity</td>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { product: 'CHARGER', size: '-', price: '$5.80' },
                    ].map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 font-semibold lg:block hidden border-b ">{item.product}</td>
                            <td className="text-center border-b">{item.size}</td>
                            <td className="text-center border-b ">{item.price}</td>
                            <td className="border-b border-black">
                                <div className="flex items-center justify-between ">
                                    <button className="text-xl font-light">−</button>
                                    <span className="font-bold">02</span>
                                    <button className="text-xl font-light">+</button>
                                </div>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <div className='w-full flex flex-col gap-y-[10px]'>
                <span
                    className='
        text-[16px]
        text-secondary-alt
        font-haasRegular
        block
        uppercase
        '
                >description</span>
                 <span
                    className='
        text-[16px]
        leading-[19px]
        text-secondary-alt
        font-haasRegular
        block
        '
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices ipsum purus, at aliquam mauris interdum nec. Maecenas in pellentesque sapien, ut sodales augue. Sed magna lacus, scelerisque quis dui eu, tempus auctor nunc. In pulvinar sapien id mi mattis pulvinar. Vivamus lobortis nibh in blandit pulvinar.</span>
            </div>
            <AddToQuoteButton text="add to quote" classes={"!mt-0 !p-0 !h-[70px] !text-[14px]"}/>
        </div>
    )
}

export { NormalCart }