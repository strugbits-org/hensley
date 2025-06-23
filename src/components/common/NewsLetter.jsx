"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError } from '@/utils';
import { lightboxActions } from "@/store/lightboxStore";
import { postForm } from '@/services/forms';

// Validation schema
const schema = yup.object({
    email_443e: yup.string().email('Email is invalid').required('Email is required'),
}).required();

export const NewsLetter = ({ data }) => {
    const { 
        newsletterPlaceholder, 
        newsletterButtonLabel, 
        newsletterHeading, 
        newsletterDescription 
    } = data;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email_443e: '',
        }
    });

    const onSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            await postForm("newsletter", formData);
            setTimeout(() => {
                reset();
                lightboxActions.setBasicLightBoxDetails({
                    title: "SUBSCRIPTION SUCCESSFUL!",
                    description: "Thank you for subscribing to our newsletter. You will receive updates soon.",
                    buttonText: "Continue",
                    open: true,
                });
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            logError(error);
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: "SUBSCRIPTION FAILED",
                    description: "There was an error subscribing to our newsletter. Please try again later.",
                    buttonText: "Try Again",
                    open: true,
                });
                setIsSubmitting(false);
            }, 2000);
        }
    };

    return (
        <div className="newsletter-form">
            <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'>
                {newsletterHeading}
            </h2>
            <p className='text-sm font-haasRegular uppercase text-primary mb-5'>
                {newsletterDescription}
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="flex gap-2 lg:gap-x-[24px] border border-black">
                    <div className="flex-1">
                        <input 
                            type="email" 
                            id="email_443e"
                            placeholder={newsletterPlaceholder}
                            disabled={isSubmitting}
                            {...register('email_443e')}
                            className={`
                                w-full sm:min-w-[240px] lg:min-w-[220px] md:max-w-[350px] 
                                bg-transparent appearance-none outline-none lg:p-5 p-3 
                                border text-base text-primary placeholder:text-primary 
                                placeholder:uppercase transition-all duration-300
                                ${errors.email_443e 
                                    ? 'border-red-500' 
                                    : 'border-primary hover:border-opacity-80'
                                }
                                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                            `}
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            border border-primary text-primary transition-all duration-300 
                            ease-in-out p-5 grow px-12 hover:bg-primary hover:text-secondary-alt 
                            text-sm font-haasMedium uppercase tracking-widest max-w-[150px]
                            ${isSubmitting 
                                ? 'opacity-70 cursor-not-allowed hover:bg-transparent hover:text-primary' 
                                : ''
                            }
                        `}
                    >
                        {isSubmitting ? 'SENDING...' : newsletterButtonLabel}
                    </button>
                </div>
                
                {errors.email_443e && (
                    <p className="text-red-500 text-sm mt-1 uppercase font-haasRegular">
                        {errors.email_443e.message}
                    </p>
                )}
            </form>
        </div>
    );
};