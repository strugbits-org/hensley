import React from 'react'
import Image from 'next/image'

export const Banner = ({ img }) => {
    return (
        <div
            className="w-full h-[425px] border bg-cover bg-center flex justify-end  items-center
            lg:my-[24px]
            "
            style={{ backgroundImage: `url(${img.src})` }}
        >
          <div className='lg:flex hidden  items-start gap-x-[24px]'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 132.853 132.854"
                className="lg:h-[132px] lg:w-[132px] sm:h-[25px] sm:w-[25px] mr-2"
            >
                <g transform="translate(0.702 0.379)">
                    <g transform="translate(-0.377 0.121)">
                        <path
                            d="M.353.5H131.881V132.028"
                            transform="translate(0.147 -0.501)"
                            fill="none"
                            stroke="#f4f1ec"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <line
                            x1="132"
                            y2="132"
                            transform="translate(0.028 0)"
                            fill="none"
                            stroke="#f4f1ec"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <line
                            x1="132"
                            y2="132"
                            transform="translate(0.028 0)"
                            fill="none"
                            stroke="#f4f1ec"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                    </g>
                </g>
            </svg>

            <h3 className="text-white font-haasRegular 
            lg:w-[199px] 
            lg:leading-[30px]
            lg:mr-[239px]
            ">
                Intimate wedding with a breathtaking view.
            </h3>
          </div>
        </div>


    )
}
