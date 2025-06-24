

import React from 'react'

export const DownloadButton = ({ text, classes, iconTrue }) => {
    return (

        <button className={`
            lg:h-[150px] 
       sm:mt-[40px]
         h-[90px]
         my-[33px]
         bg-primary tracking-[4px] group  transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
        relative
        ${classes}
        `}>
            <span
                className='
             font-haasLight uppercase 
             text-[16px]
        group-hover:font-haasBold
            '
            >{text}</span>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36.355"
                height="36.562"
                viewBox="0 0 36.355 36.562"
                className={`${iconTrue ? "lg:block" : "lg:hidden"
                    } border-b pb-[7px] block ml-2 transition-all duration-300
  border-secondary-alt stroke-secondary-alt group-hover:stroke-primary group-hover:border-primary
  absolute right-[5%] top-1/2 -translate-y-1/2`}
            >
                <g id="Group_3547" data-name="Group 3547" transform="translate(35.855 18.178) rotate(135)">
                    <path
                        id="Path_3283"
                        data-name="Path 3283"
                        d="M.354.5h25v25"
                        transform="translate(-0.354 -0.501)"
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                    <line
                        id="Line_14"
                        data-name="Line 14"
                        x1="25"
                        y2="25"
                        transform="translate(0 0)"
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                </g>
            </svg>




        </button>

    )
}
