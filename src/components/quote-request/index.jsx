"use client";
import React, { useState, useEffect } from "react";
import { Submit } from "./Button";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError } from '@/utils';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import { getProductsCart } from "@/services/cart/CartApis";
import { createPriceQuote } from "@/services/quotes/QuoteApis";

// Validation schema with date validations
const schema = yup.object({
  // Event Details
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

  // Billing Details
  billTo: yup.string().required('Bill to is required'),
  streetAddress: yup.string().required('Street address is required'),
  addressLine2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),

  // Special Instructions
  specialInstructions: yup.string(),
  city1: yup.string(),
  state1: yup.string(),

  // Order By
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
}).required();

export const QuoteRequest = () => {
  const formConfig = {
    header: {
      title: "QUOTE REQUEST",
      subtitle1: "LET'S BUILD YOUR NEXT",
      subtitle2: "UNFORGETTABLE EVENT TOGETHER!",
      description:
        "Please complete this form to request a quote. We promise to respond to you within 48 hours. We look forward to the necessary details concerning your event and helping you make it truly memorable! Our customer service team is available to assist and will contact you if more information is required.",
    },
    orderTypes: [
      { id: "delivery", label: "DELIVERY" },
      { id: "willCall", label: "WILL CALL" },
    ],
    eventDetails: {
      title: "EVENT DETAILS",
      fields: [
        { id: "eventDate", label: "EVENT DATE*", placeholder: "MM / DD / YY", required: true, type: "date" },
        { id: "deliveryDate", label: "DELIVERY DATE*", placeholder: "MM / DD / YY", required: true, type: "date" },
        { id: "pickupDate", label: "PICKUP DATE*", placeholder: "MM / DD / YY", required: true, type: "date" },
        { id: "eventLocation", label: "EVENT LOCATION", placeholder: "", required: false, type: "text" },
        { id: "eventDescription", label: "EVENT DESCRIPTION / PO#", placeholder: "", required: false, type: "text" },
      ],
    },
    billingDetails: {
      title: "BILLING DETAILS",
      fields: [
        { id: "billTo", label: "BILL TO*", placeholder: "CUSTOMER/ACCOUNT NAME", required: true, type: "text" },
        { id: "streetAddress", label: "STREET ADDRESS*", placeholder: "", required: true, type: "text" },
        { id: "addressLine2", label: "ADDRESS LINE 2", placeholder: "", required: false, type: "text" },
        { id: "city", label: "CITY*", placeholder: "", required: true, type: "text" },
        { id: "state", label: "STATE*", placeholder: "", required: true, type: "text" },
        { id: "zipCode", label: "ZIP CODE*", placeholder: "", required: true, type: "text" },
      ],
    },
    specialInstructions: {
      fields: [
        { id: "specialInstructions", label: "SPECIAL INSTRUCTIONS OR ORDER COMMENTS", placeholder: "", required: false, type: "text" },
        { id: "city1", label: "CITY", placeholder: "", required: false, type: "text" },
        { id: "state1", label: "STATE", placeholder: "", required: false, type: "text" },
      ]
    },
    orderBy: {
      title: "ORDER BY",
      fields: [
        { id: "name", label: "NAME*", placeholder: "GABRIEL MACCHI", required: true, type: "text" },
        { id: "email", label: "EMAIL*", placeholder: "GABRIEL@PETRICHDESIGN", required: true, type: "email" },
        { id: "phone", label: "PHONE*", placeholder: "(123) 456-7890", required: true, type: "tel" },
      ],
    },
    submitButton: "SUBMIT",
  };

  const [orderType, setOrderType] = useState("delivery");
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datepickers, setDatepickers] = useState({});

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
      orderType: "delivery"
    }
  });

  // Initialize Air Datepickers
  useEffect(() => {
    const today = new Date();
    const datePickerInstances = {};

    // Common datepicker configuration
    const baseConfig = {
      minDate: today,
      dateFormat: 'MM/dd/yyyy',
      autoClose: true,
      locale: localeEn,
      classes: "custom-date-picker",
    };

    const datePickerConfigs = [
      {
        id: 'eventDate',
        field: 'eventDate',
        onSelect: ({ date }) => {
          const dateStr = date ? formatDate(date) : '';
          setValue('eventDate', dateStr);
          trigger('eventDate');

          // Update dependent datepickers
          datePickerInstances.deliveryDate?.update({ maxDate: date || undefined });
          datePickerInstances.pickupDate?.update({ minDate: date || today });
        }
      },
      {
        id: 'deliveryDate',
        field: 'deliveryDate',
        onSelect: ({ date }) => {
          const dateStr = date ? formatDate(date) : '';
          setValue('deliveryDate', dateStr);
          trigger('deliveryDate');
        }
      },
      {
        id: 'pickupDate',
        field: 'pickupDate',
        onSelect: ({ date }) => {
          const dateStr = date ? formatDate(date) : '';
          setValue('pickupDate', dateStr);
          trigger('pickupDate');
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

    // Cleanup function
    return () => {
      Object.values(datePickerInstances).forEach(dp => dp?.destroy?.());
    };
  }, [setValue, trigger]);

  // Helper function to format date
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Your existing cart fetch function
  const fetchCart = async () => {
    try {
      const response = await getProductsCart();
      const lineItems = response.lineItems || [];
      if (lineItems.length === 0) {
        // handleEmptyCart();
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
      const submissionData = { orderType, ...data };
      const response = await createPriceQuote({
        lineItems: cartItems,
        quoteDetails: submissionData
      });
      console.log("response", response);
      setIsSubmitting(false);
      return;

      setTimeout(() => {
        reset();
        setOrderType("delivery");
        // Clear datepicker values
        Object.values(datepickers).forEach(dp => {
          if (dp && typeof dp.clear === 'function') {
            dp.clear();
          }
        });

        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      logError(error);

      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* Header */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl px-4 py-12 font-['neue-haas-display'] text-center">
          <h1 className="text-[90px] leading-[85px] font-['reckless-neue-regular'] text-secondary-alt mb-5">
            {formConfig.header.title}
          </h1>
          <p className="text-[30px] leading-[30px] text-secondary-alt font-recklessRegular uppercase mt-[27px] mb-[30px]">
            Let's build your next <br /> unforgettable event together!
          </p>
          <p className="text-[16px] leading-[19px] font-haasLight text-secondary-alt max-w-2xl mx-auto">
            {formConfig.header.description}
          </p>
        </div>
      </div>

      {/* Order Type */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] ">
          <div className="w-full flex justify-center">
            <div className="w-[608px] bg-[#F5E9C2] rounded-sm p-5 flex justify-center">
              <div className="flex lg:flex-row flex-col items-center space-x-10">
                <p className="font-medium lg:text-[16px] text-[25px] text-secondary-alt font-recklessRegular tracking-wide lg:mb-0 mb-[22px]">YOUR ORDER IS:</p>
                <div className="flex gap-x-[48px]">
                  {formConfig.orderTypes.map((type) => (
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
                      <span className="ml-2 font-medium text-secondary-alt font-recklessRegular">{type.label}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {formConfig.eventDetails.fields.slice(0, 3).map((field) => (
              <div className={`${field.id == "eventDescription" && 'md:col-span-2'}`} key={field.id}>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  id={field.id}
                  type="text"
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''}`}
                  disabled={isSubmitting}
                  autoComplete="off"
                  readOnly={field.type === 'date'}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.eventDetails.fields.slice(3).map((field) => (
              <div key={field.id}>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''
                    }`}
                  disabled={isSubmitting}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="w-full border-b border-primary-border">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
          <h2 className="text-3xl font-recklessRegular text-center text-secondary-alt mb-8">
            {formConfig.billingDetails.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {formConfig.billingDetails.fields.slice(0, 3).map((field) => (
              <div key={field.id}>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''
                    }`}
                  disabled={isSubmitting}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {formConfig.billingDetails.fields.slice(3, 6).map((field) => (
              <div key={field.id}>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''
                    }`}
                  disabled={isSubmitting}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="w-full border-b border-primary-border">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formConfig.specialInstructions.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-[13px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''
                    }`}
                  disabled={isSubmitting}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order By */}
      <div className="w-full border-secondary-alt">
        <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] mt-[56px]">
          <h2 className="text-3xl font-['reckless-neue-regular'] text-center text-secondary-alt mb-8">{formConfig.orderBy.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formConfig.orderBy.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${getFieldError(field.id) ? 'border-b-red-500' : ''
                    }`}
                  disabled={isSubmitting}
                />
                {getFieldError(field.id) && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError(field.id)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Submit
              text={isSubmitting ? "SUBMITTING..." : formConfig.submitButton}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </form>
  );
};