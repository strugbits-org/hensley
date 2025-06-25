"use client";
import React, { useState, useEffect } from "react";
import { Submit } from "./Button";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDateNumeric, logError } from '@/utils';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import { getProductsCart } from "@/services/cart/CartApis";
import { createPriceQuote } from "@/services/quotes/QuoteApis";
import { useCookies } from "react-cookie";
import { lightboxActions } from "@/store/lightboxStore";
import useUserData from "@/hooks/useUserData";

// Validation schema
const schema = yup.object({
  eventDate: yup.string().required('Event date is required'),
  deliveryDate: yup.string()
    .required('Delivery date is required')
    .test('delivery-before-event', 'Delivery date must be before event date', function (value) {
      const { eventDate } = this.parent;
      if (!value || !eventDate) return true;
      return new Date(value) <= new Date(eventDate);
    }),
  pickupDate: yup.string()
    .required('Pickup date is required')
    .test('pickup-after-event', 'Pickup date must be after event date', function (value) {
      const { eventDate } = this.parent;
      if (!value || !eventDate) return true;
      return new Date(value) >= new Date(eventDate);
    }),
  eventLocation: yup.string(),
  eventDescription: yup.string(),
  billTo: yup.string().required('Bill to is required'),
  streetAddress: yup.string().required('Street address is required'),
  addressLine2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  specialInstructions: yup.string(),
  city1: yup.string(),
  state1: yup.string(),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
}).required();

// Form structure
const FORM_STRUCTURE = {
  eventDetails: ['eventDate', 'deliveryDate', 'pickupDate', 'eventLocation', 'eventDescription'],
  billingDetails: ['billTo', 'streetAddress', 'addressLine2', 'city', 'state', 'zipCode'],
  specialInstructions: ['specialInstructions', 'city1', 'state1'],
  orderBy: ['name', 'email', 'phone']
};

// Field configurations
const FIELD_CONFIGS = {
  eventDate: { type: 'text', placeholder: 'MM / DD / YY', readOnly: true },
  deliveryDate: { type: 'text', placeholder: 'MM / DD / YY', readOnly: true },
  pickupDate: { type: 'text', placeholder: 'MM / DD / YY', readOnly: true },
  eventLocation: { type: 'text', placeholder: '' },
  eventDescription: { type: 'text', placeholder: '', gridSpan: 'md:col-span-2' },
  billTo: { type: 'text', placeholder: 'CUSTOMER/ACCOUNT NAME' },
  streetAddress: { type: 'text', placeholder: '' },
  addressLine2: { type: 'text', placeholder: '' },
  city: { type: 'text', placeholder: '' },
  state: { type: 'text', placeholder: '' },
  zipCode: { type: 'text', placeholder: '' },
  specialInstructions: { type: 'text', placeholder: '' },
  city1: { type: 'text', placeholder: '' },
  state1: { type: 'text', placeholder: '' },
  name: { type: 'text', placeholder: 'GABRIEL MACCHI' },
  email: { type: 'email', placeholder: 'GABRIEL@PETRICHDESIGN' },
  phone: { type: 'tel', placeholder: '(123) 456-7890' }
};

export const QuoteRequest = ({ content, data = "" }) => {

  const { tagline, sections, submitButtonLabel, description, labels, title } = data;

  const { eventDetails, billingDetails, orderBy } = sections;

  const { eventDate, deliveryDate, pickupDate, eventLocation, eventDescription, billTo, streetAddress, addressLine2, city, state, zipCode, specialInstructions, city1, state1, name, email: emailLabel, phone: phoneLabel } = labels;

  // Default content structure
  const defaultContent = {
    header: {
      title,
      subtitle: tagline,
      description,
    },
    sections: {
      eventDetails,
      billingDetails,
      orderBy
    },
    labels: {
      eventDate,
      deliveryDate,
      pickupDate,
      eventLocation,
      eventDescription,
      billTo,
      streetAddress,
      addressLine2,
      city,
      state,
      zipCode,
      specialInstructions,
      city1,
      state1,
      name,
      email: emailLabel,
      phone: phoneLabel,
    },
    orderTypes: [
      { id: "DELIVERED", label: "DELIVERED" },
      { id: "WILL CALL", label: "WILL CALL" }
    ],
    buttons: {
      submit: submitButtonLabel,
      submitting: "SUBMITTING..."
    },
    messages: {
      emptyCart: {
        title: "Your cart is empty",
        description: "Please add items to your cart before submitting a quote request.",
        buttonText: "Continue Shopping"
      },
      success: {
        title: "THANKS FOR CHOOSING US!",
        description: "Your quote request has been sent and we will contact you shortly via email.",
        buttonText: "Continue Shopping"
      }
    }
  };

  // Use provided content or fall back to defaults
  const formContent = { ...defaultContent, ...content };

  const [_cookies, setCookie] = useCookies(["cartQuantity"]);
  const [orderType, setOrderType] = useState("DELIVERED");
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datepickers, setDatepickers] = useState({});
  const { firstName, lastName, email, phone } = useUserData();

  // Check if user data exists
  const hasUserData = firstName && lastName && email && phone;
  const fullName = hasUserData ? `${firstName} ${lastName}`.trim() : '';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...(hasUserData && {
        name: fullName,
        email: email,
        phone: phone
      })
    }
  });

  // Set form values when user data is available
  useEffect(() => {
    if (hasUserData) {
      setValue('name', fullName);
      setValue('email', email);
      setValue('phone', phone);
    }
  }, [firstName, lastName, email, phone, setValue, fullName, hasUserData]);

  // Initialize Air Datepickers
  useEffect(() => {
    const today = new Date();
    const datePickerInstances = {};

    const baseConfig = {
      minDate: today,
      format: "MM/dd/yyyy",
      autoClose: true,
      locale: localeEn,
      classes: "custom-date-picker",
    };

    const datePickerConfigs = [
      {
        id: 'eventDate',
        onSelect: ({ date, datepicker }) => {
          setValue('eventDate', date);
          trigger('eventDate');
          const dateStr = date ? formatDateNumeric(date) : '';
          datepicker.$el.value = dateStr;
          datePickerInstances.deliveryDate?.update({ maxDate: date || undefined });
          datePickerInstances.pickupDate?.update({ minDate: date || today });
        }
      },
      {
        id: 'deliveryDate',
        onSelect: ({ date, datepicker }) => {
          setValue('deliveryDate', date);
          trigger('deliveryDate');
          const dateStr = date ? formatDateNumeric(date) : '';
          datepicker.$el.value = dateStr;
        }
      },
      {
        id: 'pickupDate',
        onSelect: ({ date, datepicker }) => {
          setValue('pickupDate', date);
          trigger('pickupDate');
          const dateStr = date ? formatDateNumeric(date) : '';
          datepicker.$el.value = dateStr;
        }
      }
    ];

    datePickerConfigs.forEach(({ id, onSelect }) => {
      const element = document.getElementById(id);
      if (element) {
        datePickerInstances[id] = new AirDatepicker(element, {
          ...baseConfig,
          onSelect
        });
      }
    });

    setDatepickers(datePickerInstances);

    return () => {
      Object.values(datePickerInstances).forEach(dp => dp?.destroy?.());
    };
  }, [setValue, trigger]);

  const fetchCart = async () => {
    try {
      const response = await getProductsCart();
      const lineItems = response.lineItems || [];
      if (lineItems.length === 0) {
        lightboxActions.setBasicLightBoxDetails({
          title: formContent.messages.emptyCart.title,
          description: formContent.messages.emptyCart.description,
          buttonText: formContent.messages.emptyCart.buttonText,
          buttonLink: "/",
          disableClose: true,
          open: true
        });
        return;
      }
      setCartItems(lineItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const submissionData = { orderType: orderType, ...data };
      await createPriceQuote({
        lineItems: cartItems,
        quoteDetails: submissionData
      });

      setTimeout(() => {
        reset();
        setOrderType("DELIVERED");
        Object.values(datepickers).forEach(dp => {
          if (dp && typeof dp.clear === 'function') {
            dp.clear();
          }
        });
        lightboxActions.setBasicLightBoxDetails({
          title: formContent.messages.success.title,
          description: formContent.messages.success.description,
          buttonText: formContent.messages.success.buttonText,
          buttonLink: "/",
          disableClose: true,
          open: true,
        });
        setCookie("cartQuantity", 0, { path: "/" });
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      logError(error);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const renderField = ({ fieldId, gridClass = '', inputClass = 'uppercase' }) => {
    const config = FIELD_CONFIGS[fieldId];
    const error = errors[fieldId]?.message;

    const isOrderByField = FORM_STRUCTURE.orderBy.includes(fieldId);
    const shouldBeReadOnly = isOrderByField && hasUserData;

    return (
      <div key={fieldId} className={gridClass}>
        <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
          {formContent.labels[fieldId]}
        </label>
        <input
          id={fieldId}
          type={config.type}
          {...register(fieldId)}
          placeholder={config.placeholder}
          className={`w-full border-b font-haasRegular border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm text-secondary-alt placeholder-secondary ${inputClass} ${error ? 'border-b-red-500' : ''
            } ${shouldBeReadOnly ? '!bg-gray-100 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
          readOnly={config.readOnly || shouldBeReadOnly}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* Header */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl px-4 py-12 font-['neue-haas-display'] text-center">
          <h1 className="text-[90px] leading-[85px] font-['reckless-neue-regular'] text-secondary-alt mb-5 uppercase">
            {formContent.header.title}
          </h1>
          <p className="text-[30px] leading-[30px] text-secondary-alt font-recklessRegular uppercase mt-[27px] mb-[30px]">
            {formContent.header.subtitle}
          </p>
          <p className="text-[16px] leading-[19px] font-haasLight text-secondary-alt max-w-2xl mx-auto">
            {formContent.header.description}
          </p>
        </div>
      </div>

      {/* Order Type */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px]">
          <div className="w-full flex justify-center">
            <div className="w-[608px] bg-[#F5E9C2] rounded-sm p-5 flex justify-center">
              <div className="flex lg:flex-row flex-col items-center space-x-10">
                <p className="font-medium lg:text-[16px] text-[25px] text-secondary-alt font-recklessRegular tracking-wide lg:mb-0 mb-[22px]">
                  YOUR ORDER IS:
                </p>
                <div className="flex gap-x-[48px]">
                  {formContent.orderTypes.map((type) => (
                    <label key={type.id} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        value={type.id}
                        checked={orderType === type.id}
                        onChange={() => setOrderType(type.id)}
                        className="form-radio h-[34px] w-[34px] accent-[#57442D] focus:ring-[#57442D]"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 font-medium text-secondary-alt font-recklessRegular">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="w-full border-b border-primary-border">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {FORM_STRUCTURE.eventDetails.slice(0, 3).map((fieldId) =>
              renderField({ fieldId })
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FORM_STRUCTURE.eventDetails.slice(3).map((fieldId) => renderField({ fieldId, gridClass: fieldId === 'eventDescription' ? 'lg:col-span-2' : '' }))}
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="w-full border-b border-primary-border">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
          <h2 className="text-3xl font-recklessRegular text-center text-secondary-alt mb-8">
            {formContent.sections.billingDetails}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {FORM_STRUCTURE.billingDetails.slice(0, 3).map((fieldId) => renderField({ fieldId }))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {FORM_STRUCTURE.billingDetails.slice(3, 6).map((fieldId) => renderField({ fieldId }))}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="w-full border-b border-primary-border">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FORM_STRUCTURE.specialInstructions.map((fieldId) =>
              <div key={fieldId}>
                <label className="block text-[13px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                  {formContent.labels[fieldId]}
                </label>
                <input
                  type={FIELD_CONFIGS[fieldId].type}
                  {...register(fieldId)}
                  placeholder={FIELD_CONFIGS[fieldId].placeholder}
                  className="w-full border-b font-haasRegular border-secondary-alt p-3 bg-white uppercase rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order By */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] mt-[56px]">
          <h2 className="text-3xl font-['reckless-neue-regular'] text-center text-secondary-alt mb-8">
            {formContent.sections.orderBy}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FORM_STRUCTURE.orderBy.map((fieldId) => renderField({ fieldId, inputClass: 'order-by' }))}
          </div>
          <div className="mt-8">
            <Submit
              text={isSubmitting ? formContent.buttons.submitting : formContent.buttons.submit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </form>
  );
};