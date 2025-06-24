// import React from 'react'

// export const Button = ({ text, classes }) => {
//     return (

//         <button className={`
//         lg:h-[150px] 
//         sm:mt-[40px]
//         w-full
//         h-[90px]
//         my-[33px]
//          bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
//         relative
//         ${classes}
//         `}>
//         </button>

//     )
// }






import React from 'react'

export const Button = ({ text, classes, iconTrue }) => {
    return (

        <button className={`
            lg:h-[150px] 
       sm:mt-[40px]
w-full
         h-[90px]
         my-[33px]
         bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
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
                width="19.877"
                height="19.67"
                viewBox="0 0 19.877 19.67"
                className={`${iconTrue ? "lg:block":"lg:hidden"} block ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2`}
            >
                <g transform="translate(9.835 0.5) rotate(45)">
                    <path
                        d="M0,0H13.2V13.2"
                        transform="translate(0 0)"
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                    <line
                        x1="13.202"
                        y2="13.202"
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
