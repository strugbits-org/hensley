import React from 'react'

export const AddToCartButton = ({ text, classes, onClick, disabled, showArrow = false }) => {
    return (
        <button onClick={onClick} className={`flex items-center justify-center select-none lg:w-full lg:h-[150px] lg:mt-[110px] sm:mt-[40px] mt-[33px] w-full h-[90px] sm:w-[492px] sm:my-[33px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative ${disabled ? 'pointer-events-none opacity-50' : ''} ${classes}`} disabled={disabled}>
            <span className='font-haasLight uppercase lg:text-[25px] leading-[30px] group-hover:font-haasBold'>{text}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="19.877" height="19.67" viewBox="0 0 19.877 19.67" className={`block ${showArrow ? '' : 'lg:hidden'} ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2`}>
                <g transform="translate(9.835 0.5) rotate(45)">
                    <path d="M0,0H13.2V13.2" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                    <line x1="13.202" y2="13.202" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                </g>
            </svg>
        </button>

    )
}
export const AddToCartButtonInline = ({ text, classes, onClick, disabled }) => {
    return (
        <button onClick={onClick} className={`relative w-full bg-primary flex justify-center items-center tracking-[4px] group hover:tracking-[10px] transition-all duration-300 hover:bg-secondary-alt hover:text-primary ${disabled ? 'pointer-events-none opacity-50' : ''} ${classes}`} disabled={disabled}>
            <span className='font-haasLight uppercase lg:text-[25px] leading-[30px] group-hover:font-haasRegular'>{text}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="19.877" height="19.67" viewBox="0 0 19.877 19.67" className={`transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-5`}>
                <g transform="translate(9.835 0.5) rotate(45)">
                    <path d="M0,0H13.2V13.2" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                    <line x1="13.202" y2="13.202" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                </g>
            </svg>
        </button>

    )
}
