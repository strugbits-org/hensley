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
    first_name_abae: yup.string().required('First name is required'),
    last_name_d97c: yup.string().required('Last name is required'),
    phone_4c77: yup.string().required('Phone number is required'),
    email_5139: yup.string().email('Email is invalid').required('Email is required'),
    long_answer_3524: yup.string().required('Message is required'),
}).required();

// Form structure
const FORM_STRUCTURE = {
    personalInfo: ['first_name_abae', 'last_name_d97c', 'phone_4c77', 'email_5139'],
    messageInfo: ['long_answer_3524']
};

// Field configurations
const FIELD_CONFIGS = {
    first_name_abae: { type: 'text', placeholder: 'John', borderColor: 'secondary-alt' },
    last_name_d97c: { type: 'text', placeholder: 'Doe', borderColor: 'black' },
    phone_4c77: { type: 'tel', placeholder: '+1 (415) 000-00000', borderColor: 'black' },
    email_5139: { type: 'email', placeholder: 'exemplo@myemail.com', borderColor: 'black' },
    long_answer_3524: { type: 'textarea', placeholder: 'Write your message', borderColor: 'secondary-alt' }
};

const InputField = ({
    id,
    label,
    placeholder,
    classes,
    borderColor = 'black',
    type = "text",
    register,
    error,
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
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
                disabled={disabled}
                {...register}
                className={`
          w-full placeholder-secondary font-haasLight p-3 rounded-sm placeholder:uppercase
          border-b 
          ${error ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
          ${!error && 'hover:border-b-2'}
          outline-none transition-all duration-300
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

const TextareaField = ({
    id,
    label,
    placeholder,
    borderColor = 'black',
    register,
    error,
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
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
                disabled={disabled}
                {...register}
                className={`
          w-full placeholder-secondary font-haasLight p-3 rounded-sm placeholder:uppercase
          border-b 
          ${error ? 'border-red-500 border-b' : `border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}`}
          ${!error && 'hover:border-b-2'}
          outline-none transition-all duration-300
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

const AddressBlock = ({ title, description = "" }) => {
    return (
        <div className='font-haasRegular uppercase text-[14px] leading-[18px]'>
            <p><b>{title}</b></p>
            <p>{description}</p>
        </div>)
}

const FormHeading = ({ title = "" }) => {
    const words = title.split(" ");
    const firstLine = words.slice(0, 2).join(" ");
    const secondLine = words.slice(2).join(" ");

    return (
        <h3 className="w-full text-secondary-alt uppercase font-recklessRegular text-[45px] leading-[40px]">
            {firstLine}
            <br />
            {secondLine}
        </h3>
    );
};


const ContactUs = ({ data, locationsData, classes, content, zIndex = true }) => {
    console.log("data", data);

    const defaultContent = {
        header: {
            title: "send your message",
            addresses: {
                sanFrancisco: {
                    title: "San Francisco/Monterey",
                    lines: ["Bay area", "180 Whill Place", "BRISBANE, CA 94005", "650.692.7007"]
                },
                northBay: {
                    title: "North Bay",
                    lines: ["(By Appointment)", "ST HELENA, CA 94574", "650.692.7007"]
                }
            }
        },
        labels: {
            first_name_abae: data?.firstNameLabel,
            last_name_d97c: data?.lastNameLabel,
            phone_4c77: data?.phoneLabel,
            email_5139: data?.emailLabel,
            long_answer_3524: data?.messageLabel
        },
        buttons: {
            submit: "send message",
            submitting: "sending...",
        },
        messages: {
            success: {
                title: "MESSAGE SENT SUCCESSFULLY!",
                description: "Thank you for contacting us. We will get back to you within 24 hours.",
                buttonText: "Continue"
            },
            error: {
                title: "MESSAGE FAILED TO SEND",
                description: "There was an error sending your message. Please try again later.",
                buttonText: "Try Again"
            }
        }
    };

    // Use provided content or fall back to defaults
    const formContent = { ...defaultContent, ...content };
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("formContent", formContent);
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name_abae: '',
            last_name_d97c: '',
            phone_4c77: '',
            email_5139: '',
            long_answer_3524: '',
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            await postForm("contact", data);
            setTimeout(() => {
                reset();
                lightboxActions.hideLightBox("contact");
                lightboxActions.setBasicLightBoxDetails({
                    title: formContent.messages.success.title,
                    description: formContent.messages.success.description,
                    buttonText: formContent.messages.success.buttonText,
                    open: true,
                });
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            logError(error);
            setTimeout(() => {
                lightboxActions.setBasicLightBoxDetails({
                    title: formContent.messages.error.title,
                    description: formContent.messages.error.description,
                    buttonText: formContent.messages.error.buttonText,
                    open: true,
                });
                setIsSubmitting(false);
            }, 2000);
        }
    };

    const renderField = ({ fieldId, gridClass = '' }) => {
        const config = FIELD_CONFIGS[fieldId];
        const error = errors[fieldId]?.message;

        if (config.type === 'textarea') {
            return (
                <TextareaField
                    key={fieldId}
                    id={fieldId}
                    label={formContent.labels[fieldId]}
                    placeholder={config.placeholder}
                    borderColor={config.borderColor}
                    register={register(fieldId)}
                    error={error}
                    disabled={isSubmitting}
                />
            );
        }

        return (
            <InputField
                key={fieldId}
                id={fieldId}
                label={formContent.labels[fieldId]}
                placeholder={config.placeholder}
                type={config.type}
                borderColor={config.borderColor}
                classes={gridClass}
                register={register(fieldId)}
                error={error}
                disabled={isSubmitting}
            />
        );
    };

    return (
        <div className={`${classes} w-full flex justify-center items-center lg:py-[80px] ${zIndex && 'z-[9999]'} relative lg:w-[762px]`}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full w-full bg-primary-alt opacity-[0.5px] lg:px-[50px] sm:px-[12px] px-[36px] pt-[50px] pb-[55px]'>

                {/* Top Section */}
                <div className='w-full flex flex-col sm:flex-row justify-between gap-y-[31px] gap-x-[12px]'>
                    <FormHeading title={data?.title} />
                    <div className='w-full flex lg:gap-x-[31px] sm:gap-x-[63px] justify-between sm:justify-start '>

                        {locationsData.map((dt, index) => (
                            <AddressBlock
                                key={index}
                                title={dt.title}
                                description={dt.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="w-full grid sm:grid-cols-2 grid-cols-1 pt-[77px] sm:gap-x-[24px] sm:gap-y-[31px] gap-y-[32px]">
                    {FORM_STRUCTURE.personalInfo.map((fieldId) => renderField({ fieldId }))}
                    {FORM_STRUCTURE.messageInfo.map((fieldId) => renderField({ fieldId }))}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`group lg:w-[656px] w-full relative bg-primary lg:h-[130px] h-[90px] group transition-all duration-300 hover:bg-secondary-alt ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className='font-haasLight uppercase text-[16px] hover:border-secondary-alt group-hover:[letter-spacing:8px] transition-all duration-300 tracking-[5px] group-hover:font-haasBold group-hover:text-primary'>
                            {isSubmitting ? formContent.buttons.submitting : data?.submitButtonLabel}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19.877"
                            height="19.67"
                            viewBox="0 0 19.877 19.67"
                            className='ml-2 transition-all duration-300 stroke-secondary-alt group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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