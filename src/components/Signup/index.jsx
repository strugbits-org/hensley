"use client";
import React, { useState } from 'react';
import FormHeading from './FormHeading';
import Button from './Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { calculateTotalCartQuantity, logError } from '@/utils';
import { lightboxActions } from '@/store/lightboxStore';
import { PrimaryImage } from '../common/PrimaryImage';
import { signUpUser } from '@/services/auth/authentication';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { getProductsCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

// Form structure
const FORM_STRUCTURE = {
  personalInfo: ['firstName', 'lastName'],
  contactInfo: ['email', 'phone'],
  security: ['password', 'confirmPassword'],
};

// Field configurations
const FIELD_CONFIGS = {
  firstName: { type: 'text', placeholder: 'Enter your first name', gridSpan: '' },
  lastName: { type: 'text', placeholder: 'Enter your last name', gridSpan: '' },
  email: { type: 'email', placeholder: 'exemplo@myemail.com', gridSpan: 'lg:col-span-2' },
  phone: { type: 'tel', placeholder: '+1 (415) 000-00000', gridSpan: 'lg:col-span-2' },
  password: { type: 'password', placeholder: '********', gridSpan: '' },
  confirmPassword: { type: 'password', placeholder: '********', gridSpan: '' }
};

export const SignupForm = ({ content }) => {
  // Default content structure
  const defaultContent = {
    labels: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password"
    },
    buttons: {
      submit: "create account",
      submitting: "creating account..."
    },
    agreement: {
      text: "By continuing, you are agreeing with",
      termsLink: "Blueprint Studios Terms & Conditions",
      privacyLink: "Privacy Policy",
      termsUrl: "/terms",
      privacyUrl: "/privacy"
    },
    messages: {
      success: {
        title: "Account Created Successfully!",
        description: "Welcome! Your account has been created. You can now sign in with your credentials.",
        buttonText: "Continue",
        buttonLink: "/signin"
      },
      error: {
        title: "Account Creation Failed",
        description: "There was an error creating your account. Please try again.",
        buttonText: "Try Again"
      }
    }
  };

  // Use provided content or fall back to defaults
  const formContent = { ...defaultContent, ...content };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectWithLoader = useRedirectWithLoader();
  const [cookies, setCookie, removeCookie] = useCookies(["authToken", "userData", "cartQuantity", "userTokens"]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword from submission data
      const { confirmPassword, ...submissionData } = data;
      const response = await signUpUser(submissionData);
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
      }, 1500);

    } catch (error) {
      logError(error);
      setTimeout(() => {
        lightboxActions.setBasicLightBoxDetails({
          title: formContent.messages.error.title,
          description: error.message || formContent.messages.error.description,
          buttonText: formContent.messages.error.buttonText,
          open: true,
        });
        setIsSubmitting(false);
      }, 1000);
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

  const renderField = ({ fieldId, gridClass = '' }) => {
    const config = FIELD_CONFIGS[fieldId];
    const error = errors[fieldId]?.message;
    const isPasswordField = fieldId === 'password';
    const isConfirmPasswordField = fieldId === 'confirmPassword';

    return (
      <div key={fieldId} className={`relative ${gridClass} ${config.gridSpan}`}>
        <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
          {formContent.labels[fieldId]}
        </label>
        <input
          type={isPasswordField ? (showPassword ? "text" : "password")
            : isConfirmPasswordField ? (showConfirmPassword ? "text" : "password")
              : config.type}
          {...register(fieldId)}
          placeholder={config.placeholder}
          className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary pr-12 ${error ? 'border-b-red-500' : ''
            }`}
          disabled={isSubmitting}
        />
        {(isPasswordField || isConfirmPasswordField) && (
          <button
            type="button"
            className={"absolute right-3 top-10 cursor-pointer"}
            onClick={() => togglePasswordVisibility(fieldId)}
          >
            <PrimaryImage fit='fit' url={showPassword ? "https://static.wixstatic.com/shapes/0e0ac5_e14dd77953084aec9c7994033fda7882.svg" : "https://static.wixstatic.com/shapes/0e0ac5_130c9cc93100439b8627738cde9c26c7.svg"} />
          </button>
        )}
        {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
      </div>
    );
  };

  return (
    <div>
      <FormHeading />
      <div className="w-full flex justify-center items-center py-[62px] sm:px-0 px-[37px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:max-w-[924px] sm:max-w-[491px] grid lg:grid-cols-2 grid-cols-1 gap-x-[24px] justify-center items-center w-full gap-y-[39px]"
        >
          {/* Personal Information */}
          {FORM_STRUCTURE.personalInfo.map((fieldId) =>
            renderField({ fieldId })
          )}

          {/* Contact Information */}
          {FORM_STRUCTURE.contactInfo.map((fieldId) =>
            renderField({ fieldId })
          )}

          {/* Security Fields */}
          {FORM_STRUCTURE.security.map((fieldId) =>
            renderField({ fieldId })
          )}

          {/* Submit Button */}
          <div className='lg:col-span-2 w-full flex justify-center items-center'>
            <Button
              text={isSubmitting ? formContent.buttons.submitting : formContent.buttons.submit}
              disabled={isSubmitting}
            />
          </div>

          {/* Terms Agreement */}
          <div className='lg:col-span-2 w-full flex flex-col justify-center items-center gap-4'>
            {/* Terms text */}
            <span className='text-[12px] leading-[16px] text-secondary-alt font-haasRegular uppercase text-center'>
              {formContent.agreement.text}{' '} <br />
              <a href={formContent.agreement.termsUrl} className='text-secondary underline'>
                {formContent.agreement.termsLink}
              </a>{' '}
              and{' '}
              <a href={formContent.agreement.privacyUrl} className='text-secondary underline'>
                {formContent.agreement.privacyLink}
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};