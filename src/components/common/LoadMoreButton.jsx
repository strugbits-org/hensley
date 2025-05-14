import React from 'react'

export const LoadMoreButton = ({ text }) => {
    return (

        <button className='w-full h-[150px] font-haasLight uppercase text-[25px] leading-[30px] bg-[#F0DEA2] lg:mt-[22px] tracking-wider hover:tracking-[10px] hover:font-haasBold transform transition-all duration-300 hover:bg-[#2C2216] hover:text-[#F0DEA2]'>
            {text}
        </button>

    )
}
