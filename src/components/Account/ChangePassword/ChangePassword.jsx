"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { lightboxActions } from '@/store/lightboxStore';
import { logError } from '@/utils';
// import { changePassword } from '@/services/auth/authentication'; // Add your API service

// Validation schema
const schema = yup.object({
    oldPassword: yup
        .string()
        .required('Current password is required')
        .min(1, 'Current password is required'),
    newPassword: yup
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
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
}).required();

const InputField = ({ id, label, placeholder, classes, borderColor = 'black', type = "text", register, error, disabled }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const isEmpty = error ? true : false;

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
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
                    border-b 
                    ${isEmpty ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
                    ${!isEmpty && 'hover:border-b-2'}
                    outline-none transition-all duration-300
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

const PAGE_DATA = {
    heading: "change password",
    messages: {
        success: {
            title: "Password Changed Successfully!",
            description: "Your password has been updated successfully.",
            buttonText: "Continue"
        },
        error: {
            title: "Password Change Failed",
            description: "There was an error changing your password. Please try again.",
            buttonText: "Try Again"
        }
    }
};

function ChangePassword({ content }) {
    // Use provided content or fall back to defaults
    const pageContent = { ...PAGE_DATA, ...content };

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            // Replace with your actual API call
            // await changePassword({
            //     oldPassword: formData.oldPassword,
            //     newPassword: formData.newPassword
            // });


            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: pageContent.messages.success.title,
                    description: pageContent.messages.success.description,
                    buttonText: pageContent.messages.success.buttonText,
                    open: true,
                });
                reset(); // Clear form on success
                setIsSubmitting(false);
            }, 500);

        } catch (error) {
            logError(error);
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: pageContent.messages.error.title,
                    description: pageContent.messages.error.description,
                    buttonText: pageContent.messages.error.buttonText,
                    open: true,
                });
                setIsSubmitting(false);
            }, 500);
        }
    };

    const renderEyeIcon = (show, toggle) => (
        <button type="button" className="absolute right-4 bottom-4" onClick={toggle} disabled={isSubmitting}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26.674" height="19.001" viewBox="0 0 26.674 19.001">
                <g fill="none">
                    <path d="M0,9.5A14.416,14.416,0,0,1,13.337,0,14.417,14.417,0,0,1,26.674,9.5,14.417,14.417,0,0,1,13.337,19,14.416,14.416,0,0,1,0,9.5Z" stroke="none" />
                    <path d="M13.337 1C10.628 1 8.019 1.854 5.792 3.471 3.708 4.983 2.083 7.062 1.076 9.5c1.007 2.438 2.632 4.517 4.716 6.03 2.227 1.616 4.836 2.471 7.545 2.471s5.318-.855 7.545-2.471c2.084-1.513 3.709-3.592 4.716-6.03-1.007-2.438-2.632-4.517-4.716-6.03C18.655 1.854 16.046 1 13.337 1zm0-1C19.373 0 24.54 3.93 26.674 9.5c-2.133 5.57-7.3 9.5-13.337 9.5C7.301 19 2.134 15.07.001 9.5 2.134 3.93 7.301 0 13.337 0z" stroke="none" fill="#2c2216" fillOpacity={show ? 1 : 0.5} />
                </g>
                <g transform="translate(8 4)" fill="none" stroke="#2c2216" strokeWidth="1">
                    <circle cx="5.5" cy="5.5" r="5.5" stroke="none" />
                    <circle cx="5.5" cy="5.5" r="5" fill="none" />
                </g>
            </svg>
        </button>
    );

    const canSubmit = isDirty && isValid && !isSubmitting;

    return (
        <div className='MyAccount w-full max-lg:mb-[85px] '>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px]  font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {pageContent.heading}
                </h2>
            </div>
            <div className='px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9 '>
                <div className='max-w-[608px] w-full mx-auto '>
                    <form
                        className='w-full flex flex-wrap gap-x-6 mt-[103px] max-lg:mt-[43px] gap-y-9 max-lg:gap-y-8 items-center justify-center'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className='w-full relative'>
                            <InputField
                                id="oldPassword"
                                label="Enter your old password"
                                placeholder="*****"
                                borderColor="secondary-alt"
                                type={showOldPassword ? "text" : "password"}
                                classes="col-span-2 !gap-y-0"
                                register={register('oldPassword')}
                                error={errors.oldPassword?.message}
                                disabled={isSubmitting}
                            />
                            {renderEyeIcon(showOldPassword, () => setShowOldPassword(!showOldPassword))}
                        </div>

                        <div className='w-full relative'>
                            <InputField
                                id="newPassword"
                                label="Enter your new password"
                                placeholder="*****"
                                borderColor="secondary-alt"
                                type={showNewPassword ? "text" : "password"}
                                classes="col-span-2 !gap-y-0"
                                register={register('newPassword')}
                                error={errors.newPassword?.message}
                                disabled={isSubmitting}
                            />
                            {renderEyeIcon(showNewPassword, () => setShowNewPassword(!showNewPassword))}
                        </div>

                        <div className='w-full relative'>
                            <InputField
                                id="confirmPassword"
                                label="Confirm your new password"
                                placeholder="*****"
                                borderColor="secondary-alt"
                                type={showConfirmPassword ? "text" : "password"}
                                classes="col-span-2 !gap-y-0"
                                register={register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                                disabled={isSubmitting}
                            />
                            {renderEyeIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
                        </div>

                        <button
                            type='submit'
                            className={`
                                w-full
                                h-[60px]
                                max-lg:h-[90px]
                                bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary
                                relative
                                ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            disabled={!canSubmit}
                        >
                            <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                {isSubmitting ? 'changing password...' : 'reset password'}
                            </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25px"
                                height="25px"
                                viewBox="0 0 19.877 19.67"
                                className='lg:hidden block ml-2 transition-all duration-300 stroke-[#2c2216] group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;