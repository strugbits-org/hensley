import React from 'react'

export const Button = ({ text, onClick, classes }) => {
    return (
        <button onClick={onClick} className={`lg:w-full lg:h-[150px]  sm:mt-[40px] mt-[33px] w-full h-[90px] my-[33px]  bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative ${classes} `}>
            <span className='font-haasLight uppercase lg:text-[16px] group-hover:font-haasBold'>{text}</span>
        </button>
    )
}
