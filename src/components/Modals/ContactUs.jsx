"use client";
import React, { useState } from 'react';

const InputField = ({ id, label, placeholder, classes, borderColor = 'black', type = "text" }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        if (!e.target.value.trim()) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        setIsEmpty(false);
    };

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm
                    border-b 
                    ${isEmpty ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
                    ${!isEmpty && 'hover:border-b-2'}
                    outline-none transition-all duration-300
                `}
            />
        </div>
    );
};


const TextareaField = ({ id, label, placeholder, borderColor = 'black' }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        if (!e.target.value.trim()) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        setIsEmpty(false);
    };

    return (
        <div className="sm:col-span-2 gap-y-[8px] flex flex-col">
            <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                {label}
            </label>
            <textarea
                id={id}
                rows={4}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm
                    border-b 
                    ${isEmpty ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
                    ${!isEmpty && 'hover:border-b-2'}
                    outline-none transition-all duration-300
                `}
            ></textarea>
        </div>
    );
};

const AddressBlock = ({ title, lines }) => (
    <div className='font-haasRegular uppercase text-[14px] leading-[18px]'>
        <p><b>{title}</b></p>
        {lines.map((line, idx) => (
            <p key={idx}>{line}</p>
        ))}
    </div>
);

const FormHeading = () => (
    <h3 className='w-full text-secondary-alt uppercase font-recklessRegular text-[45px] leading-[40px]'>
        send your <br /> message
    </h3>
);

const ContactUs = ({ classes }) => {
    return (
        <div className={`${classes} w-full flex justify-center items-center lg:py-[80px] z-[9999] relative lg:w-[762px]`}>
            <form className=' h-full w-full bg-primary-alt opacity-[0.5px] lg:px-[50px] sm:px-[12px] px-[36px] pt-[50px] pb-[55px]'>

                {/* Top Section */}
                <div className='w-full flex flex-col sm:flex-row justify-between gap-y-[31px] gap-x-[12px]'>
                    <FormHeading />
                    <div className='w-full flex lg:gap-x-[31px] sm:gap-x-[63px] justify-between sm:justify-start '>
                        <AddressBlock
                            title="San Francisco/Monterey"
                            lines={["Bay area", "180 Whill Place", "BRISBANE, CA 94005", "650.692.7007"]}
                        />
                        <AddressBlock
                            title="North Bay"
                            lines={["(By Appointment)", "ST HELENA, CA 94574", "650.692.7007"]}
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="w-full grid sm:grid-cols-2 grid-cols-1 pt-[77px] sm:gap-x-[24px] sm:gap-y-[31px] gap-y-[32px]">
                    <InputField id="firstName" label="First Name" placeholder="Name" borderColor="secondary-alt" />
                    <InputField id="lastName" label="Last Name" placeholder="Name" />
                    <InputField id="phone" label="Phone" placeholder="+1 (415) 000-00000" />
                    <InputField id="email" label="Email" placeholder="exemplo@myemail.com" />
                    <TextareaField id="message" label="Message" placeholder="Write your message" borderColor="secondary-alt" />

                    {/* Submit Button */}
                    <button className='group lg:w-[656px] w-full relative bg-primary lg:h-[130px] h-[90px] group transition-all duration-300 hover:bg-[#2c2216]'>
                        <span className='lg:block hidden font-haasLight uppercase text-[16px] hover:border-secondary-alt  group-hover:[letter-spacing:8px]
                        transition-all duration-300
                        tracking-[5px] group-hover:font-haasBold
                        group-hover:text-primary'>Sign in</span>
                        <span className='lg:hidden block font-haasLight uppercase text-[16px] hover:border-secondary-alt  group-hover:[letter-spacing:8px]
                        transition-all duration-300
                        tracking-[5px] group-hover:font-haasBold
                        group-hover:text-primary'>send message</span>
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
                </div>
            </form>
        </div>
    );
};

export default ContactUs;
