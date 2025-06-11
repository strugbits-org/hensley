'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import image from '@/assets/product-set-1.png'

// Initial Product Data
const initialProductData = [
    { id: 1, name: "vintage dance floor 1" },
    { id: 2, name: "vintage dance floor 2" },
    { id: 3, name: "vintage dance floor 3" },
    { id: 4, name: "vintage dance floor 4" },
    { id: 5, name: "vintage dance floor 5" },
]

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
        <div className="relative w-[460px] z-[9999]">
            <div
                className="h-[60px] px-5 border-b border-black bg-white cursor-pointer flex items-center justify-between"
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

const Cards = ({ classes, data, onClick }) => {
    return (
        <div
            className={`${classes ?? ''} w-full border text-left border-primary-border flex flex-col gap-y-[10px] p-[10px] cursor-pointer`}
        // Attach the click handler
        >
            <div className='flex justify-between'>
                <span className='font-haasRegular text-secondary-alt uppercase text-[16px] block'>
                    {data.name}
                </span>
                <div onClick={onClick} className='flex items-center justify-center rounded-full w-[25px] h-[25px] border border-primary-border transform transition-all duration-300 group cursor-pointer hover:bg-black'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className='group-hover:hidden' fill="black">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className="hidden group-hover:block fill-white">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

const BlogListUpdate = ({ toggle, data, currentProd }) => {
    const [productList, setProductList] = useState(initialProductData);

    const handleRemove = (id) => {
        setProductList(productList.filter(item => item.id !== id));
    }

    const isEven = productList.length % 2 === 0;
    const lastIndex = productList.length - 1;

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px] relative'>
            <svg
                data-bbox="63 62.951 74.049 74.049"
                viewBox="0 0 200 200"
                height="57"
                width="57"
                onClick={() => toggle()}
                className="absolute top-9 left-0 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                data-type="shape"
                style={{ transform: "rotate(45deg)" }}
            >
                <g>
                    <path d="M137 133a4 4 0 0 1-4 4H67c-.263 0-.525-.027-.783-.079-.117-.023-.225-.067-.339-.1-.137-.04-.275-.072-.408-.127-.133-.055-.253-.131-.379-.199-.103-.057-.211-.102-.309-.168a4.023 4.023 0 0 1-1.109-1.109c-.065-.097-.109-.203-.165-.304-.07-.127-.146-.25-.202-.384-.055-.132-.086-.271-.126-.407-.033-.113-.077-.222-.101-.339A4.056 4.056 0 0 1 63 133V67a4 4 0 0 1 8 0v56.344l59.172-59.172a4 4 0 1 1 5.656 5.656L76.656 129H133a4 4 0 0 1 4 4z"></path>
                </g>
            </svg>

            <div className='w-full grid gap-x-[10px] gap-y-[20px] grid-cols-3 mt-[30px]'>
                <div className='flex flex-col gap-y-[5px] col-span-2'>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        blog title
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-recklessRegular'
                    >
                        Halo Moments by the Sea: An Event Pavilion Affair at Rosewood Miramar Beach
                    </span>
                </div>
                <div className='flex flex-col  gap-y-[5px] '>
                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-haasBold'
                    >
                        Author name
                    </span>

                    <span
                        className='text-[16px] block text-secondary-alt uppercase font-recklessRegular'
                    >
                        Carolina Ortiz
                    </span>
                </div>
                <button onClick={() => {
                   setProductList( [
                        { id: 1, name: "vintage dance floor 1" },
                        { id: 2, name: "vintage dance floor 2" },
                        { id: 3, name: "vintage dance floor 3" },
                        { id: 4, name: "vintage dance floor 4" },
                        { id: 5, name: "vintage dance floor 5" },
                    ])
                }} className='px-[10px] py-[20px] border border-primary-border text-[16px] block text-secondary-alt uppercase font-haasBold transform transition-all duration-300 hover:bg-primary'>
                    products
                </button>
                <button onClick={() => {
                    setProductList([
                        { id: 1, name: "vintage studio 1" },
                        { id: 2, name: "vintage studio 2" },
                        { id: 3, name: "vintage studio 3" },
                        { id: 4, name: "vintage studio 4" },
                        { id: 5, name: "vintage studio 5" },
                    ])
                }} className='px-[10px] py-[20px] border border-primary-border text-[16px] block text-secondary-alt uppercase font-haasBold transform transition-all duration-300 hover:bg-primary'>
                    studios
                </button>
                <button onClick={()=>{
                     setProductList([
                        { id: 1, name: "non-profit" },
                        { id: 2, name: "corporate" },
                        { id: 3, name: "social" },
                    ])
                }} className='px-[10px] py-[20px] border border-primary-border text-[16px] block text-secondary-alt uppercase font-haasBold transform transition-all duration-300 hover:bg-primary'>
                    markets
                </button>
            </div>

            <div className='relative h-[60px]'>
                <CustomDropdown />
            </div>

            <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-[20px] items-center justify-center">
                {productList.map((item, index) => {
                    const isLast = !isEven && index === lastIndex;
                    return isLast ? (
                        <div key={item.id} className="w-full  sm:col-span-2 flex flex-col justify-center items-center">
                            <Cards data={item} classes="lg:w-[600px]" onClick={() => handleRemove(item.id)} />
                        </div>
                    ) : (
                        <Cards key={item.id} data={item} onClick={() => handleRemove(item.id)} />
                    );
                })}
            </div>

            <div className='w-full flex justify-center items-center'>
                <button className='w-[400px] tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transform transition-all duration-300 h-[58px] lg:w-[280px] text-secondary-alt uppercase text-[14px] font-haasRegular'>
                    Save
                </button>
            </div>
        </div>
    )
}

export default BlogListUpdate;
