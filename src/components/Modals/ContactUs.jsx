import React from 'react'

const ContactUs = () => {
    return (
        <div className=' w-full flex justify-center items-center lg:py-[80px]'>
            <form className='lg:w-[762px] h-full w-full bg-primary-alt opacity-[0.5px] lg:px-[50px] sm:px-[12px] px-[36px] pt-[50px] pb-[55px]'>
                <div className='w-full flex flex-col sm:flex-row justify-between gap-y-[31px] gap-x-[12px]'>
                    <h3 className='w-full text-secondary-alt uppercase font-recklessRegular text-[45px] leading-[40px]'>
                        send your <br /> message
                    </h3>
                    <div className='w-full flex lg:gap-x-[31px] sm:gap-x-[63px] justify-between sm:justify-start '>
                        <div className='font-haasRegular text-[14px] leading-[18px]'>
                            <p><b>San Francisco/</b></p>
                            <p><b>Monterey</b></p>
                            <p>Bay area</p>
                            <p>180 Whill Place</p>
                            <p>BRISBANE, CA 94005</p>
                            <p>650.692.7007</p>
                        </div>
                        <div className='font-haasRegular text-[14px] leading-[18px]'>
                            <p><b>North Bay</b></p>
                            <p><b>(By Appointment)</b></p>
                            <p>ST HELENA, CA 94574</p>
                            <p>650.692.7007</p>
                        </div>
                    </div>

                </div>

                <div className="w-full grid sm:grid-cols-2 grid-cols-1 pt-[77px]
                sm:gap-x-[24px]
                sm:gap-y-[31px]
                gap-y-[32px]
                ">
                    <div className='gap-y-[8px] flex flex-col'>
                        <label htmlFor="firstName" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className='w-full placeholder-secondary-alt border-b border-secondary-alt px-[24px] py-[20px] h-[60px]'
                            placeholder='Name'
                        />
                    </div>
                    <div className='gap-y-[8px] flex flex-col'>
                        <label htmlFor="lastName" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]'
                            placeholder='Name'
                        />
                    </div>
                    <div className='gap-y-[8px] flex flex-col'>
                        <label htmlFor="phone" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]'
                            placeholder='+1 (415) 000-00000'
                        />
                    </div>
                    <div className='gap-y-[8px] flex flex-col'>
                        <label htmlFor="email" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]'
                            placeholder='exemplo@myemail.com'
                        />
                    </div>
                    <div className="sm:col-span-2 gap-y-[8px] flex flex-col">
                        <label htmlFor="message" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px]"
                            placeholder="+1 (415) 000-00000"
                        ></textarea>
                    </div>
                    <button className='lg:col-span-2 relative bg-primary lg:h-[130px] h-[90px] w-full my-[33px] group'>
                        <span className='lg:block hidden font-haasLight uppercase text-[16px]  tracking-[5px]'>
                            Sign in
                        </span>
                        <span className='lg:hidden block font-haasLight uppercase text-[16px] tracking-[5px]'>
                            send message
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19.877"
                            height="19.67"
                            viewBox="0 0 19.877 19.67"
                            className='ml-2 transition-all duration-300 stroke-[#2c2216] absolute right-[5%] top-1/2 -translate-y-1/2'
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
                </div>
            </form>
        </div>
    )
}

export default ContactUs
