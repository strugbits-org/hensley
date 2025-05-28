import React from 'react'

export const Button = ({ text, classes }) => {
    return (

        <button className={`
        lg:w-full lg:h-[150px] 
        sm:mt-[40px]
        mt-[33px]
        w-full
        h-[90px]
        my-[33px]
         bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary
        relative
        ${classes}
        `}>
            <span
                className='
             font-haasLight uppercase 
        lg:text-[16px] 
        group-hover:font-haasBold
            '
            >{text}</span>
        </button>

    )
}
