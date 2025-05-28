"use client"
import React, { useState } from 'react';
import FormHeading from './FormHeading';
import Button from './Button';

const data = [
    { label: "First Name", placeholder: "Enter your first name", name: "firstName", type: "text" },
    { label: "Last Name", placeholder: "Enter your last name", name: "lastName", type: "text" },
    { label: "Email", placeholder: "exemplo@myemail.com", name: "email", type: "email" },
    { label: "Phone Number", placeholder: "+1 (415) 000-00000", name: "phone", type: "tel" },
    { label: "Password", placeholder: "********", name: "password", type: "password" },
    { label: "Confirm Password", placeholder: "********", name: "confirmPassword", type: "password" },
];

const Form = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword((prev) => !prev);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="26.674" height="19.001" viewBox="0 0 26.674 19.001">
            <g fill="none">
                <path d="M0,9.5A14.416,14.416,0,0,1,13.337,0,14.417,14.417,0,0,1,26.674,9.5,14.417,14.417,0,0,1,13.337,19,14.416,14.416,0,0,1,0,9.5Z" stroke="none" />
                <path d="M13.337 1C10.628 1 8.019 1.854 5.792 3.471C3.708 4.983 2.083 7.062 1.076 9.5C2.083 11.938 3.708 14.017 5.792 15.53C8.019 17.146 10.628 18.001 13.337 18.001C16.046 18.001 18.655 17.146 20.882 15.53C22.966 14.017 24.591 11.938 25.598 9.5C24.591 7.062 22.966 4.983 20.882 3.471C18.655 1.854 16.046 1 13.337 1ZM13.337 0C19.373 0 24.54 3.93 26.674 9.5C24.54 15.071 19.373 19.001 13.337 19.001C7.301 19.001 2.134 15.071 0 9.5C2.134 3.93 7.301 0 13.337 0Z" fill="#2c2216" />
            </g>
            <g fill="none" stroke="#2c2216" strokeWidth="1">
                <circle cx="13.5" cy="9.5" r="5.5" stroke="none" />
                <circle cx="13.5" cy="9.5" r="5" fill="none" />
            </g>
        </svg>
    );

    return (
        <div>
            <FormHeading />
            <div className="w-full flex justify-center items-center py-[62px] sm:px-0 px-[37px]">
                <form className="lg:max-w-[924px] sm:max-w-[491px] grid lg:grid-cols-2 grid-cols-1 gap-x-[24px] justify-center items-center w-full gap-y-[39px]">
                    {data.map((field, index) => {
                        const isPasswordField = field.name === 'password';
                        const isConfirmPasswordField = field.name === 'confirmPassword';
                        const show = isPasswordField ? showPassword : isConfirmPasswordField ? showConfirmPassword : null;
                        return (
                            <div key={index} className="relative">
                                {field.label && (
                                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                                        {field.label}
                                    </label>
                                )}
                                <input
                                    type={isPasswordField ? (showPassword ? "text" : "password")
                                        : isConfirmPasswordField ? (showConfirmPassword ? "text" : "password")
                                            : field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                                />
                                {(isPasswordField || isConfirmPasswordField) && (
                                    <span
                                        onClick={() => togglePasswordVisibility(field.name)}
                                        className="absolute right-3 top-10 cursor-pointer"
                                    >
                                        <EyeIcon />
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    <div className='lg:col-span-2 w-full flex justify-center items-center'>
                        <Button text="create account" />
                    </div>
                    <div className='lg:col-span-2 w-full flex justify-center items-center'>
                        <span className='text-[12px] leading-[16px] text-secondary-alt font-haasRegular uppercase'>
                            By continuing, you are agreeing with
                            <a href="" className='text-secondary underline'>Blueprint <br /> Studios Terms & Conditions</a>
                            and
                            <a href="" className='text-secondary underline'>Privacy Policy.</a>
                        </span>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
