import React from 'react'
import Image from 'next/image'
import image from '@/assets/hens-logo.png'

const SignIn = () => {
    return (
        <div className='w-full flex justify-center items-center lg:py-[80px]'>
            <form className='lg:w-[762px] flex flex-col gap-y-[41px] justify- items-center h-full w-full bg-primary-alt opacity-[0.5px] lg:px-[50px] sm:px-[12px] px-[36px] pt-[121px] pb-[55px] relative'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24.5" height="24.5" className='lg:block hidden absolute left-10 top-10' viewBox="0 0 24.5 24.5">
  <g id="Group_3530" data-name="Group 3530" transform="translate(0.5 24.5) rotate(-90)">
    <path id="Path_3283" data-name="Path 3283" d="M.354.5h24v24" transform="translate(-0.354 -0.501)" fill="none" stroke="#2c2216" stroke-miterlimit="10" stroke-width="1"/>
    <line id="Line_13" data-name="Line 13" x1="23.501" y2="23.501" transform="translate(0.499)" fill="none" stroke="#2c2216" stroke-miterlimit="10" stroke-width="1"/>
    <line id="Line_14" data-name="Line 14" x1="23.501" y2="23.501" transform="translate(0.499)" fill="none" stroke="#2c2216" stroke-miterlimit="10" stroke-width="1"/>
  </g>
</svg>

                <Image src={image} className='border' />
                <div className='w-full'>
                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">email</label>
                    <input
                        type={"email"}
                        placeholder='exemplo@myemail.com'
                        className="text w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    />
                </div>
                <div className='w-full grid grid-cols-2'>
                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">email</label>
                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2 text-right">forget your password?</label>
                    <input
                        type={"email"}
                        placeholder='exemplo@myemail.com'
                        className="col-span-2 text w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none  shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    />
                </div>

                <button className='group sm:w-[656px] w-full relative bg-primary lg:h-[130px] h-[90px] group transition-all duration-300 hover:bg-[#2c2216]'>
                    <span className='font-haasLight uppercase text-[16px] hover:border-secondary-alt  group-hover:[letter-spacing:8px]
                        transition-all duration-300
                        tracking-[5px] group-hover:font-haasBold
                        group-hover:text-primary
                        '>
                        Sign in
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19.877"
                        height="19.67"
                        viewBox="0 0 19.877 19.67"
                        className='ml-2 transition-all duration-300 stroke-[#2c2216]  group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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

                <div className='w-full flex justify-center items-center'>
                    <span className='text-[12px] leading-[16px] text-secondary-alt font-haasRegular uppercase'>
                        By continuing, you are agreeing with
                        <a href="" className='text-secondary underline'>Blueprint <br /> Studios Terms & Conditions</a>
                        and
                        <a href="" className='text-secondary underline'>Privacy Policy.</a>
                    </span>

                </div>

                <span className='font-recklessLight text-[35px] leading-[20px] text-secondary-alt block'>NEW TO HENSLEY?</span>

                <button className='tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-secondary-alt h-[45px] lg:w-[292px] w-full text-secondary-alt uppercase text-[12px] font-haasRegular'>
                    create account
                </button>
            </form>
        </div>
    )
}

export default SignIn
