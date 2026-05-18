"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { lightboxActions } from '@/store/lightboxStore';
import { logError } from '@/utils';
import { resetPassword } from '@/services/auth/authentication';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import eyeOpenIcon from '@/assets/icons/eye-open.svg';
import eyeClosedIcon from '@/assets/icons/eye-closed.svg';

// Validation schema
const schema = yup.object({
    password: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: yup
        .string()
        .required('Please confirm your new password')
        .oneOf([yup.ref('password')], 'Passwords must match')
}).required();

const InputField = ({
    id,
    label,
    placeholder,
    classes,
    borderColor = 'black',
    type = "text",
    register,
    error,
    disabled = false,
    togglePassWord = false,
    showPassword,
    onToggle
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const hasError = !!error;

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
            <div className='relative'>
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    {...register}
                    className={`
                        w-full placeholder-secondary font-haasLight p-3 rounded-sm
                        border-b transition-all duration-300 outline-none
                        ${hasError ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
                        ${!hasError ? 'hover:border-b-2' : ''}
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                    `}
                />
                {togglePassWord && (
                    <button
                        type="button"
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${disabled ? 'cursor-not-allowed' : ''}`}
                        onClick={onToggle}
                        disabled={disabled}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <Image className="size-6" src={showPassword ? eyeOpenIcon : eyeClosedIcon} alt="" width={24} height={24} />
                    </button>
                )}
            </div>
            {hasError && (
                <p className="text-red-500 text-sm mt-1 font-haasLight">{error}</p>
            )}
        </div>
    );
};

const PAGE_DATA = {
    heading: "reset password",
    messages: {
        success: {
            title: "Password Reset Successfully!",
            description: "Your password has been reset. You can now login with your new password.",
            buttonText: "Login Now"
        },
        error: {
            title: "Password Reset Failed",
            description: "There was an error resetting your password. The link may have expired.",
            buttonText: "Try Again"
        },
        invalidToken: {
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired. Please request a new reset link.",
            buttonText: "Request New Link"
        }
    }
};

function ResetPassword({ token }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const redirectWithLoader = useRedirectWithLoader();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (formData) => {
        if (!token) {
            lightboxActions.setBasicLightBoxDetails({
                title: PAGE_DATA.messages.invalidToken.title,
                description: PAGE_DATA.messages.invalidToken.description,
                buttonText: PAGE_DATA.messages.invalidToken.buttonText,
                open: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await resetPassword(
                { password: formData.password },
                token
            );

            if (result?.error) {
                throw new Error(result.message || "Password reset failed");
            }

            setIsSuccess(true);
            toast.success("Password reset successfully!");
            
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: PAGE_DATA.messages.success.title,
                    description: PAGE_DATA.messages.success.description,
                    buttonText: PAGE_DATA.messages.success.buttonText,
                    open: true,
                    onClose: () => redirectWithLoader('/login')
                });
                reset();
                setIsSubmitting(false);
            }, 500);

        } catch (error) {
            logError(error);
            toast.error(error.message || "Failed to reset password");
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: PAGE_DATA.messages.error.title,
                    description: error.message || PAGE_DATA.messages.error.description,
                    buttonText: PAGE_DATA.messages.error.buttonText,
                    open: true,
                });
                setIsSubmitting(false);
            }, 500);
        }
    };

    const handleBackToLogin = () => {
        lightboxActions.showLightBox('login');
    };

    const canSubmit = isDirty && isValid && !isSubmitting && !isSuccess;

    return (
        <div className='ResetPassword w-full max-lg:mb-[85px] mb-12'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {PAGE_DATA.heading}
                </h2>
            </div>
            <div className='px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
                <div className='max-w-[608px] w-full mx-auto'>
                    {isSuccess ? (
                        <div className='w-full flex flex-col items-center mt-[103px] max-lg:mt-[43px] gap-y-9'>
                            <div className='text-center'>
                                <svg className="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2c2216" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <h3 className='text-2xl font-haasBold text-secondary-alt mb-2'>Password Reset Successful!</h3>
                                <p className='text-secondary font-haasLight'>Your password has been updated. You can now login with your new password.</p>
                            </div>
                            <button
                                onClick={handleBackToLogin}
                                className='w-full h-[60px] max-lg:h-[90px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative'
                            >
                                <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                    go to login
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25px"
                                    height="25px"
                                    viewBox="0 0 19.877 19.67"
                                    className='lg:hidden block ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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
                        </div>
                    ) : (
                        <form
                            className='w-full flex flex-wrap gap-x-6 mt-[103px] max-lg:mt-[43px] gap-y-9 max-lg:gap-y-8 items-center justify-center'
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <p className='w-full text-center text-secondary font-haasLight mb-4'>
                                Enter your new password below to reset your account password.
                            </p>

                            <div className='w-full'>
                                <InputField
                                    id="password"
                                    label="Enter new password"
                                    placeholder="*****"
                                    borderColor="secondary-alt"
                                    type={showPassword ? "text" : "password"}
                                    classes="col-span-2 !gap-y-0"
                                    register={register('password')}
                                    error={errors.password?.message}
                                    disabled={isSubmitting}
                                    togglePassWord={true}
                                    showPassword={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            <div className='w-full'>
                                <InputField
                                    id="confirmPassword"
                                    label="Confirm new password"
                                    placeholder="*****"
                                    borderColor="secondary-alt"
                                    type={showConfirmPassword ? "text" : "password"}
                                    classes="col-span-2 !gap-y-0"
                                    register={register('confirmPassword')}
                                    error={errors.confirmPassword?.message}
                                    disabled={isSubmitting}
                                    togglePassWord={true}
                                    showPassword={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>

                            <button
                                type='submit'
                                className={`
                                    w-full
                                    h-[60px]
                                    max-lg:h-[90px]
                                    bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary
                                    relative
                                    ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                disabled={!canSubmit}
                            >
                                <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                    {isSubmitting ? 'resetting password...' : 'reset password'}
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25px"
                                    height="25px"
                                    viewBox="0 0 19.877 19.67"
                                    className='lg:hidden block ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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

                            <button
                                onClick={handleBackToLogin}
                                type="button"
                                disabled={isSubmitting}
                                className={`tracking-[3px] border border-secondary-alt h-[45px] w-full
                                    text-secondary-alt uppercase text-[12px] font-haasRegular
                                    transition-all duration-300
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' :
                                        'hover:tracking-[5px] hover:bg-primary hover:font-haasBold hover:text-primary-alt'}`}
                            >
                                Back to login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
