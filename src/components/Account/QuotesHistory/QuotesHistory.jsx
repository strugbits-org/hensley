"use client"
import React, { useState } from 'react'
import { FiArrowUpRight } from "react-icons/fi";
import LightboxForm from './QuoteHistoryModal';

function QuotesHistory() {
    const [isOpen, setIsOpen] = useState(false);
    const data = {
        heading: "QUOTES HISTORY",

    }
    const onClose = () => {
        setIsOpen(false)
    }
    const orders = [
        {
            client: "ANNA & JOHN",
            category: "WEDDING",
            date: "February, 09h, 2024",
            amount: "$ 45.000"
        },
        {
            client: "NIKE",
            category: "PRODUCT LAUNCH",
            date: "March, 12th, 2024",
            amount: "$ 45.000"
        },
        {
            client: "AMAZON",
            category: "CORPORATE EVENT",
            date: "April, 20th, 2024",
            amount: "$ 45.000"
        },
        {
            client: "GOOGLE",
            category: "CONFERENCE",
            date: "May, 1st, 2024",
            amount: "$ 45.000"
        },
        {
            client: "FORBES",
            category: "GALA NIGHT",
            date: "January, 15th, 2024",
            amount: "$ 45.000"
        }
    ];
    return (
        <div className='QuotesHistory'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[125px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.heading}</h2>
            </div>
            <div className='quotesTable w-full px-6 pt-[70px] max-lg:pt-[6.5px]'>
                <div className='max-w-[1240px] max-sm:pt-[50px] max-sm:pb-[77px] w-full mx-auto'>
                    <table className='border-collapse w-full  table-auto'>
                        <tbody>
                            {orders.map((a, i) => (
                                <>
                                    <tr className='sm:block hidden border-b first:border-t border-[#E0D6CA]'>
                                        <td className=" pt-[35px] max-lg:pt-5 pb-[32px] pr-[10px] max-lg:pb-5 w-full whitespace-nowrap">
                                            <div className='font-recklessRegular text-xl text-wrap'>{a.client}</div>
                                            <div className="w-fit font-haasLight text-xs text-wrap">{a.category} - {a.date}</div>
                                            <div className="w-fit font-haasLight text-xs text-wrap"></div>
                                        </td>

                                        <td className=" pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap xl:pr-[105px] lg:pr-[20px] max-lg:hidden">
                                            <div className="w-fit font-haasLight text-xs ">{a.category}</div>
                                        </td>
                                        <td className=" pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap xl:pr-[46px] lg:pr-[20px] max-lg:hidden">
                                            <div className="w-fit font-haasLight text-xs">{a.date}</div>
                                        </td>
                                        <td className=" pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap xl:pr-[77px] lg:pr-[20px] max-lg:pr-[30px]">
                                            <div className="w-fit font-recklessRegular text-xl">{a.amount}</div>
                                        </td>
                                        <td className=" pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap">
                                            <div className="flex gap-x-6 max-lg:gap-x-3">
                                                <button className="bg-[#F0DEA2] font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                                                    onClick={() => {
                                                        setIsOpen(true)
                                                    }}
                                                >
                                                    VIEW <span className="absolute right-3"><FiArrowUpRight className="inline group-hover:text-white" /></span>
                                                </button>
                                                <button className="bg-transparent border border-black font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary">
                                                    ORDER AGAIN <span className="absolute right-3"><FiArrowUpRight className="inline group-hover:text-white" /></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className=" sm:hidden block border-t first:border-t border-[#E0D6CA]">
                                        <td className="pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 w-full whitespace-nowrap">
                                            <div className="font-recklessRegular text-xl">{a.client}</div>
                                            <div className="w-fit font-haasLight text-xs">{a.category} - {a.date}</div>
                                        </td>
                                        <td className="pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap pr-[105px] max-lg:hidden">
                                            <div className="w-fit font-haasLight text-xs">{a.category}</div>
                                        </td>
                                        <td className="pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap pr-[46px] max-lg:hidden">
                                            <div className="w-fit font-haasLight text-xs">{a.date}</div>
                                        </td>
                                        <td className="pt-[35px] max-lg:pt-5 pb-[32px] max-lg:pb-5 whitespace-nowrap pr-[77px] max-lg:pr-[30px]">
                                            <div className="w-fit font-recklessRegular text-xl">{a.amount}</div>
                                        </td>
                                    </tr>

                                    {/* Full-width button row */}
                                    <tr className='border-b'>
                                        <td colSpan="4" className="sm:hidden block pb-[35px] whitespace-nowrap">
                                            <div className="w-full flex gap-x-6 max-lg:gap-x-3">
                                                <button
                                                    className="!w-full bg-[#F0DEA2] font-haasLight text-xs h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                                                    onClick={() => setIsOpen(true)}
                                                >
                                                    VIEW <span className="absolute right-3"><FiArrowUpRight className="inline group-hover:text-white" /></span>
                                                </button>
                                                <button className="!w-full bg-transparent border border-black font-haasLight text-xs h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary">
                                                    ORDER AGAIN <span className="absolute right-3"><FiArrowUpRight className="inline group-hover:text-white" /></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                    <button type='submit' className={`mt-[39px] w-full h-[150px] max-lg:h-[90px]  bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative flex items-center justify-center`}>
                        <span
                            className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'
                        >LOAD MORE</span>
                        <svg className='rotate-45 size-[13px] group-hover:w-4 transition-all duration-300 ease-in-out absolute right-[26.3px] text-[#2c2216] group-hover:text-white hidden max-lg:block' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <LightboxForm isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose} />
        </div>
    )
}

export default QuotesHistory