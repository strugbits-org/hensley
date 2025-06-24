import React from 'react'

const Button = ({ text, disabled }) => {
    return (
        <button disabled={disabled} className='group sm:w-[656px] w-full relative bg-primary lg:h-[130px] h-[90px] group transition-all duration-300 hover:bg-secondary-alt'>
            <span className='font-haasLight uppercase text-[16px] hover:border-secondary-alt  group-hover:[letter-spacing:8px]
                        transition-all duration-300
                        tracking-[5px] group-hover:font-haasBold
                        group-hover:text-primary
                        '>
                {text}
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.877"
                height="19.67"
                viewBox="0 0 19.877 19.67"
                className='ml-2 transition-all duration-300 stroke-secondary-alt  group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
            >
                <g transform="translate(9.835 0.5) rotate(45)">
                    <path
                        d="M0,0H13.2V13.2"
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                    <line
                        x1="13.202"
                        y2="13.202"
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                </g>
            </svg>
        </button>
    )
}

export default Button