"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import image from '@/assets/hens-logo.png';
import { lightboxActions } from '@/store/lightboxStore';
import { PrimaryImage } from '@/components/common/PrimaryImage';
import { forgotPassword, resetPassword } from '@/services/auth/authentication';

// Validation schema
const schema = yup.object({
    email: yup.string().email('Email is invalid').required('Email is required'),
}).required();

const InputField = ({
    id,
    label,
    placeholder,
    borderColor = 'black',
    type = "text",
    register,
    error,
    disabled = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    return (
        <div className="gap-y-[8px] flex flex-col w-full">
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                {...register}
                className={`w-full placeholder-secondary font-haasLight p-3 rounded-sm
                    border-b transition-all duration-300 outline-none
                    ${hasError ? 'border-red-500 border-b-2' :
                        isFocused ? `border-${borderColor} border-b-2` :
                            `border-${borderColor} border-b hover:border-b-2`}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {/* {hasError && <p className="text-red-500 text-sm mt-1 font-haasLight">{error}</p>} */}
        </div>
    );
};

export const ForgotPassword = ({ classes, close, isLightbox = true }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await forgotPassword({ email: data.email });

            toast.success("Password reset instructions have been sent to your email.");
            setTimeout(() => {
                reset();
                setIsSubmitting(false);
                if (isLightbox && close) {
                    close();
                    lightboxActions.hideLightBox("forgotPassword");
                }
            }, 1500);
        } catch (error) {
            toast.error(error.message || "Failed to send reset email.");
            setTimeout(() => setIsSubmitting(false), 3000);
        }
    };

    const handleBackToLogin = () => {
        lightboxActions.hideLightBox("forgotPassword");
        lightboxActions.showLightBox("login");
    };

    return (
        <div className={`${classes} lg:bg-transparent bg-[#F4F1EC] w-full flex justify-center items-center z-[99] relative lg:w-[762px] lg:py-[80px] py-[60px] px-[20px] mx-auto`}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full flex flex-col justify-center items-center bg-primary-alt lg:px-[50px] sm:px-[120px] px-[20px] lg:pt-[121px] pt-[60px] pb-[40px] gap-y-[28px] lg:gap-y-[41px] relative"
            >
                {isLightbox && (
                    <button onClick={handleBackToLogin}>
                        <PrimaryImage
                            url="https://static.wixstatic.com/media/0e0ac5_823b38fd131f45499b4a78acdd4cb214~mv2.png"
                            customClasses={`lg:block hidden absolute left-11 top-11 transition-opacity duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-70'}`}
                        />
                    </button>
                )}

                <Image src={image} className="lg:block hidden" alt="Hensley Logo" />

                <h3 className="lg:hidden block uppercase text-[32px] leading-[36px] sm:text-[40px] text-secondary-alt font-recklessRegular text-center">
                    Forgot Password
                </h3>

                <InputField
                    id="email"
                    label="Email"
                    placeholder="example@myemail.com"
                    borderColor="secondary-alt"
                    type="email"
                    register={register("email")}
                    error={errors.email?.message}
                    disabled={isSubmitting}
                />

                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`group w-full relative bg-primary h-[60px] sm:h-[90px] lg:h-[130px]
                transition-all duration-300 hover:bg-[#2c2216]
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className={`font-haasLight uppercase text-[14px] sm:text-[16px] transition-all duration-300 tracking-[4px]
                ${!isSubmitting ? 'group-hover:tracking-[6px] group-hover:font-haasBold group-hover:text-primary' : ''}`}>
                        {isSubmitting ? 'Sending...' : 'Send reset link'}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19.877"
                        height="19.67"
                        viewBox="0 0 19.877 19.67"
                        className={`ml-2 transition-all duration-300 stroke-[#2c2216] absolute right-[5%] top-1/2 -translate-y-1/2
                    ${!isSubmitting ? 'group-hover:stroke-primary' : ''}`}
                    >
                        <g transform="translate(9.835 0.5) rotate(45)">
                            <path d="M0,0H13.2V13.2" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                            <line x1="13.202" y2="13.202" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                        </g>
                    </svg>
                </button>

                <button
                    onClick={handleBackToLogin}
                    type="button"
                    disabled={isSubmitting}
                    className={`tracking-[3px] border border-secondary-alt h-[45px] lg:w-[292px] w-full 
                text-secondary-alt uppercase text-[12px] font-haasRegular
                transition-all duration-300
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' :
                            'hover:tracking-[5px] hover:bg-primary hover:font-haasBold hover:text-primary-alt'}`}
                >
                    Back to login
                </button>
            </form>
        </div>
    );
};