'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import image from '@/assets/product-set-1.png'




const CustomDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Select Any Product');
    const options = [
        "12\" BRONZE FLOOR FAN",
        "12\" SQUARE RIM BOWL",
        "14' ROUND BAR - GRACE W/CUSTOM PAINT COLOR",
        "14' WHITE ROUND - BAR",
        "16\" CANOE BOWL",
        "16\" ROUND BOWL WITH HANDLES"
    ];

    return (
        <div className="relative w-[460px]">
            <div
                className="h-[60px] px-5  border-b border-black bg-white cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="uppercase font-haasLight">{selected}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" />
                </svg>
            </div>
            {isOpen && (
                <ul className="bg-white w-full shadow-md z-[99999]">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="px-5 text-left py-3 transform transition-all duration-300 hover:bg-[#F0DEA2] cursor-pointer uppercase font-haasLight"
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const ProductListUpdate = () => {
    return (
        <div className='w-full  flex flex-col justify-center items-center  text-center py-[50px] gap-y-[40px] relative '>

            <svg
                data-bbox="63 62.951 74.049 74.049"
                viewBox="0 0 200 200"
                height="57"
                width="57"
                className="absolute top-9 left-0 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                data-type="shape"
                style={{ transform: "rotate(45deg)" }}  // Rotate 45 degrees counterclockwise
            >
                <g>
                    <path d="M137 133a4 4 0 0 1-4 4H67c-.263 0-.525-.027-.783-.079-.117-.023-.225-.067-.339-.1-.137-.04-.275-.072-.408-.127-.133-.055-.253-.131-.379-.199-.103-.057-.211-.102-.309-.168a4.023 4.023 0 0 1-1.109-1.109c-.065-.097-.109-.203-.165-.304-.07-.127-.146-.25-.202-.384-.055-.132-.086-.271-.126-.407-.033-.113-.077-.222-.101-.339A4.056 4.056 0 0 1 63 133V67a4 4 0 0 1 8 0v56.344l59.172-59.172a4 4 0 1 1 5.656 5.656L76.656 129H133a4 4 0 0 1 4 4z"></path>

                </g>
            </svg>



            <span className='block
        font-haasRegular
        uppercase
        text-[25px]
        text-secondary-alt
        '>update your set</span>


            <div className='w-full lg:max-w-[500px] flex gap-y-[10px] gap-x-[20px] py-[15px] px-[15px] cursor-pointer border border-primary-border hover:bg-primary transform transition-all duration-30'>
                <div className=' bg-white w-[100px] h-[90px] '>
                    <Image src={image} className='h-full w-full object-contain' />
                </div>
                <div className='w-full text-left flex flex-col gap-y-[10px] justify-center'>
                    <span className='
                        font-haasRegular
                        text-secondary-alt
                        uppercase
                        text-[20px]
                        block
                        '>
                        vintage - dance floor
                    </span>
                </div>
            </div>

            <CustomDropdown />

            <div className='w-full flex  justify-center items-center gap-[20px]'>
                <div className='w-full  min-h-[85px] border border-primary-border'></div>
                <div className='w-full  min-h-[85px] border border-primary-border'></div>
            </div>

        </div>
    )
}

export default ProductListUpdate