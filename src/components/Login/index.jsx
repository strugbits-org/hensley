"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { calculateTotalCartQuantity, logError } from '@/utils';
import { PrimaryImage } from '../common/PrimaryImage';
import { CustomLink } from '../common/CustomLink';
import { toast } from 'sonner';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { signInUser } from '@/services/auth/authentication';
import { useCookies } from 'react-cookie';
import { getProductsCart } from '@/services/cart/CartApis';
import { lightboxActions } from '@/store/lightboxStore';
import { convertToHTMLRichContent } from '@/utils/renderRichText';

// Validation schema
const schema = yup.object({
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
}).required();

// Enhanced InputField component with form integration
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
                <label htmlFor={id} className=" !text-[16px] uppercase block font-medium text-secondary-alt font-haasBold">
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
                    w-full px-[20px] placeholder-secondary font-haasLight p-3 h-[55px] rounded-sm
                    border-b transition-all duration-300 outline-none
                    ${hasError ? 'border-red-500 border-b-2' :
                            isFocused ? `border-${borderColor} border-b-2` :
                                `border-${borderColor} border-b hover:border-b-2`
                        }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                />
                {togglePassWord && (
                    <button
                        type="button"
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${disabled ? 'cursor-not-allowed' : ''}`}
                        onClick={onToggle}
                        disabled={disabled}
                    >
                        <img className="size-6" src={showPassword ? "https://static.wixstatic.com/shapes/0e0ac5_e14dd77953084aec9c7994033fda7882.svg" : "https://static.wixstatic.com/shapes/0e0ac5_130c9cc93100439b8627738cde9c26c7.svg"} />
                    </button>
                )}
            </div>
            {hasError && (
                <p className="text-red-500 text-sm mt-1 font-haasLight">{error}</p>
            )}
        </div>
    );
};

const Login = ({ classes, close, isLightbox = true, data = '' }) => {

    const { newToHensleyText, submitButtonLabel, createAccountButtonLabel, logo, labels, agreementContent, forgetPasswordLabel } = data;

    const { email, password } = labels;

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectWithLoader = useRedirectWithLoader();
    const [cookies, setCookie, removeCookie] = useCookies(["authToken", "userData", "cartQuantity", "userTokens"]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const wixImageToUrl = (wixImage) => {
        if (!wixImage?.startsWith("wix:image://v1/")) return wixImage;

        const parts = wixImage.replace("wix:image://v1/", "").split("/");
        const mediaId = parts[0]; // "e3c477_..."
        return `https://static.wixstatic.com/media/${mediaId}`;
    };


    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await signInUser(data);

            // console.log("Login response:", response);
            // setIsSubmitting(false);
            // return;
            
            const { jwtToken: authToken, member: userData, userTokens } = response;

            const cookieOptions = {
                path: "/",
                expires: new Date("2099-01-01"),
            };

            setCookie("authToken", authToken, cookieOptions);
            setCookie("userData", JSON.stringify(userData), cookieOptions);
            setCookie("userTokens", JSON.stringify(userTokens), cookieOptions);
            removeCookie("cartId", { path: "/" });

            setTimeout(() => {
                reset();
                setIsSubmitting(false);
                redirectWithLoader('/account');
                updateCartQuantity();
                if (isLightbox && close) {
                    close();
                }
            }, 1500);

        } catch (error) {
            logError(error);
            toast.error(error.message || "Invalid email or password. Please try again.");
            // Reset submitting state after delay
            setTimeout(() => setIsSubmitting(false), 3000);
        }
    };
    const togglePasswordVisibility = () => {
        if (!isSubmitting) {
            setShowPassword(!showPassword);
        }
    };

    const updateCartQuantity = async () => {
        try {
            const cart = await getProductsCart();
            const total = calculateTotalCartQuantity(cart?.lineItems || []);
            if (total !== cookies.cartQuantity) {
                setCookie("cartQuantity", total, { path: "/" });
            }
        } catch (error) {
            logError(error);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && close) {
            close();
        }
    };

    const handleForgotPassword = () => {
        if (!isSubmitting) {
            lightboxActions.hideLightBox("login");
            lightboxActions.showLightBox("forgotPassword");
        }
    }

    return (
        <div className={`${classes} lg:bg-transparent bg-[#F4F1EC] w-full flex justify-center items-center z-[99] relative lg:w-[600px] lg:py-[20px]  mx-auto`}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className='w-full flex flex-col gap-y-[35px] border border-black justify- items-center bg-primary-alt opacity-[0.5px] lg:px-[30px] sm:px-[120px] px-[36px] pt-[50px] pb-[55px] relative'
            >
                {isLightbox && (
                    <button onClick={isSubmitting ? undefined : handleClose}>
                        <PrimaryImage
                            url={"https://static.wixstatic.com/media/0e0ac5_823b38fd131f45499b4a78acdd4cb214~mv2.png"}
                            customClasses={`lg:block hidden absolute left-11 top-11 transition-opacity duration-200  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-70'}`}
                        />
                    </button>
                )}

                <Image
                    src={wixImageToUrl(logo)}
                    width={212}
                    height={33}
                    className="lg:block hidden"
                    alt="Hensley Logo"
                />



                <h3 className='lg:hidden block uppercase text-[55px] leading-[30px] text-secondary-alt font-recklessRegular'>
                    Login
                </h3>

                {/* Email Field */}
                <div className='w-full'>
                    <InputField
                        id="email"
                        label={email}
                        placeholder="example@myemail.com"
                        borderColor="secondary-alt"
                        type="email"
                        register={register("email")}
                        error={errors.email?.message}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Password Field */}
                <div className='w-full grid grid-cols-2'>
                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                        {password}
                    </label>
                    <label className="block text-[16px] leading-[19px] font-haasLight text-secondary-alt mb-2 text-right">
                        <button onClick={handleForgotPassword} className={"underline text-secondary-alt font-haasRegular hover:opacity-70 transition-opacity duration-200"}>
                            {forgetPasswordLabel}
                        </button>
                    </label>
                    <InputField
                        id="password"
                        placeholder="********"
                        borderColor="secondary-alt"
                        type={showPassword ? "text" : "password"}
                        classes={'col-span-2 !gap-y-0'}
                        register={register("password")}
                        error={errors.password?.message}
                        disabled={isSubmitting}
                        togglePassWord={true}
                        showPassword={showPassword}
                        onToggle={togglePasswordVisibility}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`group lg:w-[100%] w-full relative bg-primary lg:h-[110px] h-[90px] 
                   transition-all duration-300 hover:bg-secondary-alt 
                   ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className={`font-haasLight uppercase text-[16px] hover:border-secondary-alt  
                         transition-all duration-300 tracking-[5px] 
                         ${!isSubmitting ? 'group-hover:[letter-spacing:8px] group-hover:font-haasBold group-hover:text-primary' : ''}`}>
                        {isSubmitting ? 'Signing in...' : submitButtonLabel}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19.877"
                        height="19.67"
                        viewBox="0 0 19.877 19.67"
                        className={`ml-2 transition-all duration-300 stroke-secondary-alt absolute right-[5%] top-1/2 -translate-y-1/2
                       ${!isSubmitting ? 'group-hover:stroke-primary' : ''}`}
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

                {/* Terms & Conditions */}
                <div className='w-full flex justify-center items-center'>
                    {/* <span className='text-[12px] leading-[16px] text-secondary-alt font-haasRegular uppercase text-center'>
                        By continuing, you are agreeing with
                        <a href="#" className='text-secondary underline hover:opacity-70 transition-opacity duration-200'>
                            Blueprint <br /> Studios Terms & Conditions
                        </a>
                        {' '}and{' '}
                        <a href="#" className='text-secondary underline hover:opacity-70 transition-opacity duration-200'>
                            Privacy Policy.
                        </a>
                    </span> */}
                    <div className='w-full sm:max-w-[370px] '>
                        {convertToHTMLRichContent({ content: agreementContent, class_p: 'text-[12px] leading-[16px] text-secondary-alt font-haasRegular uppercase text-center' })}
                    </div>
                </div>

                {/* New User Section */}
                <span className='font-recklessLight text-[28px] leading-[20px] text-secondary-alt block lg:mt-0 mt-[100px]'>
                    {newToHensleyText}
                </span>

                <CustomLink to={isSubmitting ? undefined : "/create-account"}>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        className={`tracking-[3px] border border-secondary-alt h-[45px] lg:w-[292px] w-full 
                               text-secondary-alt uppercase text-[12px] font-haasRegular
                               transition-all duration-300
                               ${isSubmitting ? 'opacity-50 cursor-not-allowed' :
                                'hover:tracking-[5px] hover:bg-primary hover:font-haasBold'}`}
                    >
                        {createAccountButtonLabel}
                    </button>
                </CustomLink>
            </form>
        </div>
    );
};

export default Login;