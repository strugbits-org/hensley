"use client"
import useUserData from '@/hooks/useUserData';
import { updateProfile } from '@/services/auth/authentication';
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError } from '@/utils';
import { lightboxActions } from '@/store/lightboxStore';
import { loaderActions } from '@/store/loaderStore';

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phone: yup.string()
}).required();

// Field configurations
const FIELD_CONFIGS = {
  firstName: { type: 'text', readOnly: false },
  lastName: { type: 'text', readOnly: false },
  email: { type: 'email', readOnly: true },
  phone: { type: 'tel', readOnly: false }
};

const PAGE_DATA = {
  heading: "MY ACCOUNT",
  description: "View and edit your personal info below.",
  accountTitle: "ACCOUNT",
  accountSubtitle: "Update your personal information.",
  loginEmailText: "Login Email:",
  loginEmailNote: "Your Login email can't be changed",
  discardButtonText: "DISCARD",
  updateButtonText: "UPDATE INFO",
  updatingButtonText: "UPDATING...",
  formFields: {
    firstName: "FIRST NAME*",
    lastName: "LAST NAME*",
    email: "EMAIL*",
    phone: "PHONE"
  },
  messages: {
    success: {
      title: "Profile Updated Successfully!",
      description: "Your account information has been updated.",
      buttonText: "Continue"
    },
    error: {
      title: "Update Failed",
      description: "There was an error updating your profile. Please try again.",
      buttonText: "Try Again"
    }
  }
};

const ArrowIcon = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25px"
    height="25px"
    viewBox="0 0 19.877 19.67"
    className='block ml-2 transition-all duration-300 stroke-[#2c2216] group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
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
));

const FormField = React.memo(({ fieldKey, field, register, error, isSubmitting, readOnly }) => {
  const config = FIELD_CONFIGS[fieldKey];

  return (
    <div className='w-[calc(50%-12px)] max-lg:max-w-[491px] max-lg:w-full'>
      <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2 max-md:text-sm">
        {field}
      </label>
      <input
        id={fieldKey}
        type={config.type}
        {...register(fieldKey)}
        placeholder={field}
        className={`uppercase w-full border-b font-haasLight border-secondary-alt p-3 bg-white focus:outline-none shadow-sm text-secondary-alt placeholder-secondary max-md:text-sm ${error ? 'border-b-red-500' : ''
          } ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
        readOnly={readOnly}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export const MyAccount = ({ content }) => {
  // Use provided content or fall back to defaults
  const pageContent = { ...PAGE_DATA, ...content };

  const { firstName, lastName, email, phone } = useUserData();
  const [_cookies, setCookie] = useCookies(["userData"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  const watchedFields = watch();

  // Initialize form with user data
  const setInitialData = useCallback(() => {
    setValue('firstName', firstName);
    setValue('lastName', lastName);
    setValue('email', email);
    setValue('phone', phone);
    setHasChanges(false);
  }, [firstName, lastName, email, phone, reset]);

  // Check for changes whenever watched fields change
  useEffect(() => {
    const currentData = { firstName, lastName, email, phone };
    const hasFormChanges = Object.keys(currentData).some(
      key => watchedFields[key] !== currentData[key]
    );
    setHasChanges(hasFormChanges);
  }, [watchedFields, firstName, lastName, email, phone]);

  // Initialize form data when user data loads
  useEffect(() => {
    if (firstName || lastName || email || phone) {
      loaderActions.hide();
      setInitialData();
    }
  }, [firstName, lastName, email, phone, setInitialData]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await updateProfile(formData);

      // Update cookie with new user data
      const userData = JSON.stringify(response.updatedMember);
      setCookie("userData", userData, {
        path: "/",
        expires: new Date("2099-01-01"),
      });

      // Show success message
      setTimeout(() => {
        lightboxActions.setBasicLightBoxDetails({
          title: pageContent.messages.success.title,
          description: pageContent.messages.success.description,
          buttonText: pageContent.messages.success.buttonText,
          open: true,
        });
        setHasChanges(false);
        setIsSubmitting(false);
      }, 1000);

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
      }, 1000);
    }
  };

  const handleDiscard = useCallback(() => {
    setInitialData();
  }, [setInitialData]);

  const renderField = useCallback(({ fieldKey, field }) => (
    <FormField
      key={fieldKey}
      fieldKey={fieldKey}
      field={field}
      register={register}
      error={errors[fieldKey]?.message}
      isSubmitting={isSubmitting}
      readOnly={FIELD_CONFIGS[fieldKey].readOnly}
    />
  ), [register, errors, isSubmitting]);

  const formFields = useMemo(() =>
    Object.entries(pageContent.formFields).map(([fieldKey, field]) =>
      renderField({ fieldKey, field })
    ), [pageContent.formFields, renderField]
  );

  return (
    <div className='MyAccount w-full max-lg:mb-[85px]'>
      <div className='heading w-full py-[51px] max-lg:py-[20px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:border-b-0'>
        <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[120px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
          {pageContent.heading}
        </h2>
      </div>

      <div className='py-[86px] max-lg:py-0 px-6'>
        <div className='max-w-[924px] w-full mx-auto'>
          <div className='flex justify-between items-center max-lg:flex-col gap-y-[7px]'>
            <div className='flex flex-col gap-y-[7px] max-md:gap-0'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs uppercase'>
                {pageContent.description}
              </p>
              <p className='lg:my-2 text-base font-haasBold leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs uppercase'>
                {pageContent.accountTitle}
              </p>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs uppercase'>
                {pageContent.accountSubtitle}
              </p>
            </div>
            <div className='flex flex-col gap-y-[7px] max-md:gap-0'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs uppercase'>
                {pageContent.loginEmailText}
                <b className='lg:block lg:mt-2 lg:underline text-base font-haasBold leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs uppercase'>
                  {email}
                </b>
              </p>
              <p className='lg:mt-2 text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs uppercase'>
                {pageContent.loginEmailNote}
              </p>
            </div>
          </div>

          <form
            className='w-full flex flex-wrap gap-x-6 mt-[103px] max-lg:mt-[43px] gap-y-9 max-lg:gap-y-8 items-center justify-center'
            onSubmit={handleSubmit(onSubmit)}
          >
            {formFields}

            <div className='flex justify-between w-full max-lg:flex-col max-lg:justify-center max-lg:items-center gap-4'>
              <button
                type="button"
                className={`w-[292px] max-lg:max-w-[491px] max-lg:w-full h-[60px] text-sm font-haasRegular tracking-widest border border-[#2C2216] max-lg:mb-[13px] transition-opacity duration-200 ${!hasChanges || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                onClick={handleDiscard}
                disabled={!hasChanges || isSubmitting}
              >
                {pageContent.discardButtonText}
              </button>

              <button
                type='submit'
                className={`max-w-[608px] min-w-[292px] max-lg:max-w-[491px] max-lg:w-full w-full h-[60px] max-lg:h-[90px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative ${!hasChanges || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={!hasChanges || isSubmitting}
              >
                <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                  {isSubmitting ? pageContent.updatingButtonText : pageContent.updateButtonText}
                </span>
                <ArrowIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};