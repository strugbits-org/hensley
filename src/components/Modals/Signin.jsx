import React, { useState } from 'react';
import Image from 'next/image';
import image from '@/assets/hens-logo.png';


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




const SignIn = ({ classes, close }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`${classes} lg:bg-transparent bg-[#F4F1EC] w-full flex justify-center items-center z-[9999] relative lg:w-[762px] lg:py-[80px]`}>
            <form className='w-full flex flex-col gap-y-[41px] justify- items-center bg-primary-alt opacity-[0.5px] lg:px-[50px] sm:px-[120px] px-[36px] pt-[121px] pb-[55px] relative'>

                {/* Existing SVG and Image */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24.5" height="24.5" onClick={close} className='lg:block hidden absolute left-11 top-11 cursor-pointer' viewBox="0 0 24.5 24.5">
                    <g id="Group_3530" data-name="Group 3530" transform="translate(0.5 24.5) rotate(-90)">
                        <path id="Path_3283" data-name="Path 3283" d="M.354.5h24v24" transform="translate(-0.354 -0.501)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                        <line id="Line_13" data-name="Line 13" x1="23.501" y2="23.501" transform="translate(0.499)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                        <line id="Line_14" data-name="Line 14" x1="23.501" y2="23.501" transform="translate(0.499)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                    </g>
                </svg>

                <Image src={image} className='lg:block hidden ' />

                <h3 className='lg:hidden block uppercase text-[55px] leading-[30px] text-secondary-alt font-recklessRegular'>Login</h3>

                <div className='w-full'>
                    {/* <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">email</label>
                    <input
                        type="email"
                        placeholder='exemplo@myemail.com'
                        className="text w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    /> */}
                        <InputField id="email" label="Email" placeholder="exemplo@myemail.com" borderColor="secondary-alt" />
                </div>

                <div className='w-full grid grid-cols-2 relative'>
                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">password</label>
                    <label className="block text-[16px] leading-[19px] font-haasLight text-secondary-alt mb-2 text-right">
                        <a href="" className="underline text-secondary-alt">Forget your password?</a>
                    </label>

                    {/* <input
                        type={showPassword ? "text" : "password"}
                        placeholder='*****'
                        className="col-span-2 text w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    /> */}
                    <InputField id="password" placeholder="*****" borderColor="secondary-alt" type={showPassword ? "text" : "password"} classes={'col-span-2 !gap-y-0'}/>

                    {/* Eye SVG Button */}
                    <button
                        type="button"
                        className="absolute right-4 bottom-4"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <svg id="Group_3264" xmlns="http://www.w3.org/2000/svg" width="26.674" height="19.001" viewBox="0 0 26.674 19.001">
                            <g transform="translate(0 0)" fill="none">
                                <path d="M0,9.5A14.416,14.416,0,0,1,13.337,0,14.417,14.417,0,0,1,26.674,9.5,14.417,14.417,0,0,1,13.337,19,14.416,14.416,0,0,1,0,9.5Z" stroke="none" />
                                <path d="M 13.33714199066162 1 C 10.62823104858398 1 8.019302368164062 1.854301452636719 5.792402267456055 3.47053050994873 C 3.708070755004883 4.983296394348145 2.08344841003418 7.062363624572754 1.076192855834961 9.500349998474121 C 2.08344841003418 11.93832969665527 3.708070755004883 14.01740455627441 5.792402267456055 15.53016090393066 C 8.019302368164062 17.14640045166016 10.62823104858398 18.00070190429688 13.33714199066162 18.00070190429688 C 16.04579162597656 18.00070190429688 18.65460205078125 17.14640045166016 20.88152122497559 15.53016090393066 C 22.96593856811523 14.01735687255859 24.59062385559082 11.93830490112305 25.59795570373535 9.500349998474121 C 24.59062385559082 7.06238842010498 22.96593856811523 4.983345031738281 20.88152122497559 3.470541000366211 C 18.65460205078125 1.854301452636719 16.04579162597656 1 13.33714199066162 1 M 13.33714199066162 0 C 19.37283134460449 0 24.54047203063965 3.929810523986816 26.67416191101074 9.500350952148438 C 24.54047203063965 15.07088088989258 19.37283134460449 19.00070190429688 13.33714199066162 19.00070190429688 C 7.300832748413086 19.00070190429688 2.133501052856445 15.07088088989258 1.9073486328125e-06 9.500350952148438 C 2.133501052856445 3.929810523986816 7.300832748413086 0 13.33714199066162 0 Z" stroke="none" fill="#2c2216" fillOpacity={showPassword ? 1 : 0.5} />
                            </g>
                            <g transform="translate(8 4)" fill="none" stroke="#2c2216" strokeWidth="1">
                                <circle cx="5.5" cy="5.5" r="5.5" stroke="none" />
                                <circle cx="5.5" cy="5.5" r="5" fill="none" />
                            </g>
                        </svg>
                    </button>
                </div>

                {/* Rest of form */}
                <button className='group lg:w-[656px] w-full relative bg-primary lg:h-[130px] h-[90px] group transition-all duration-300 hover:bg-[#2c2216]'>
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

                <span className='font-recklessLight text-[35px] leading-[20px] text-secondary-alt block lg:mt-0 mt-[100px]'>NEW TO HENSLEY?</span>

                <button className='tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-secondary-alt h-[45px] lg:w-[292px] w-full text-secondary-alt uppercase text-[12px] font-haasRegular'>
                    create account
                </button>
            </form>
        </div>
    );
}

export default SignIn;
