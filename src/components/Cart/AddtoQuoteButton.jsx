import React from 'react'

export const AddToQuote = ({ text, classes }) => {
    return (

        <button className={`
        lg:w-full lg:h-[150px] 
        lg:mt-[110px]
        sm:mt-[40px]
        mt-[33px]
        w-full
        h-[90px]
        sm:my-[33px]
         bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
        relative
        ${classes}
        `}>
            <span
                className='
             font-haasLight uppercase 
        lg:text-[25px] leading-[30px]
        group-hover:font-haasBold
            '
            >{text}</span>


        </button>

    )
}
