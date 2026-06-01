import React from 'react'

export const AddToQuoteButton = ({ text, classes, onClick, disabled }) => {
    return (
        <button onClick={onClick} className={`flex items-center justify-center select-none lg:w-full lg:h-[150px] lg:mt-[110px] sm:mt-6 mt-4 w-full h-[50px] sm:h-[60px] sm:my-6 bg-primary tracking-[3px] sm:tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative px-[34px] sm:px-0 ${disabled ? 'pointer-events-none opacity-50' : ''} ${classes}`} disabled={disabled}>
            <span className='font-haasLight uppercase lg:text-[14px] leading-[16px] whitespace-nowrap group-hover:font-haasBold'>{text}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="19.877" height="19.67" viewBox="0 0 19.877 19.67" className='shrink-0 ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary sm:absolute sm:right-[5%] sm:top-1/2 sm:-translate-y-1/2'>
                <g transform="translate(9.835 0.5) rotate(45)">
                    <path d="M0,0H13.2V13.2" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                    <line x1="13.202" y2="13.202" transform="translate(0 0)" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                </g>
            </svg>
        </button>

    )
}
