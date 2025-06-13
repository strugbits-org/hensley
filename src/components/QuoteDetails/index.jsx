"use client";
import { formatDateNumeric } from "@/utils";
import React from "react";
import QuoteSummary from "./QuoteSummary";

const FORM_STRUCTURE = {
  eventDetails: ['eventDate', 'deliveryDate', 'pickupDate', 'eventLocation', 'eventDescriptionPo'],
  billingDetails: ['billTo', 'streetAddress', 'addressLine2', 'city', 'state', 'zipCode'],
  specialInstructions: ['comments', 'city1', 'state1'],
  orderBy: ['name', 'email', 'phoneNumber']
};

const FIELD_CONFIGS = {
  eventDate: { type: 'date', gridSpan: '' },
  deliveryDate: { type: 'date', gridSpan: '' },
  pickupDate: { type: 'date', gridSpan: '' },
  eventLocation: { type: 'text', gridSpan: '' },
  eventDescriptionPo: { type: 'text', gridSpan: 'md:col-span-2' },
  billTo: { type: 'text', gridSpan: '' },
  streetAddress: { type: 'text', gridSpan: '' },
  addressLine2: { type: 'text', gridSpan: '' },
  city: { type: 'text', gridSpan: '' },
  state: { type: 'text', gridSpan: '' },
  zipCode: { type: 'text', gridSpan: '' },
  specialInstructions: { type: 'text', gridSpan: '' },
  city1: { type: 'text', gridSpan: '' },
  state1: { type: 'text', gridSpan: '' },
  name: { type: 'text', gridSpan: '' },
  email: { type: 'email', gridSpan: '' },
  phoneNumber: { type: 'tel', gridSpan: '' }
};

export const QuoteDetails = ({ data, content }) => {
  // Default content structure
  const defaultContent = {
    header: {
      title: "QUOTE DETAILS",
      subtitle: "Your event quote information",
      description: "Below are the details of your quote request. Please review all information carefully."
    },
    sections: {
      eventDetails: "EVENT DETAILS",
      billingDetails: "BILLING DETAILS",
      orderBy: "ORDERED BY"
    },
    labels: {
      eventDate: "EVENT DATE",
      deliveryDate: "DELIVERY DATE",
      pickupDate: "PICKUP DATE",
      eventLocation: "EVENT LOCATION",
      eventDescriptionPo: "EVENT DESCRIPTION / PO#",
      billTo: "BILL TO",
      streetAddress: "STREET ADDRESS",
      addressLine2: "ADDRESS LINE 2",
      city: "CITY",
      state: "STATE",
      zipCode: "ZIP CODE",
      comments: "SPECIAL INSTRUCTIONS OR ORDER COMMENTS",
      city1: "CITY",
      state1: "STATE",
      name: "NAME",
      email: "EMAIL",
      phoneNumber: "PHONE"
    },
    orderTypes: [
      { id: "DELIVERED", label: "DELIVERY" },
      { id: "WILL CALL", label: "WILL CALL" }
    ],
    orderTypeLabel: "ORDER TYPE"
  };

  const formContent = { ...defaultContent, ...content };

  const getDisplayValue = (fieldId, value) => {
    if (!value || value === '') return '-';

    if (FIELD_CONFIGS[fieldId]?.type === 'date') {
      return formatDateNumeric(value);
    }

    return value;
  };

  const renderField = (fieldId, gridClass = '') => {
    const value = data?.[fieldId];
    const displayValue = getDisplayValue(fieldId, value);

    return (
      <div key={fieldId} className={gridClass}>
        <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
          {formContent.labels[fieldId]}
        </label>
        <div className="w-full border-b font-haasLight border-secondary-alt p-3 bg-gray-50 rounded-sm text-secondary-alt min-h-[48px] flex items-center">
          {displayValue}
        </div>
      </div>
    );
  };

  const renderSpecialInstructionsField = (fieldId) => {
    const value = data?.[fieldId];
    const displayValue = getDisplayValue(fieldId, value);

    return (
      <div key={fieldId}>
        <label className="block text-[13px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
          {formContent.labels[fieldId]}
        </label>
        <div className="w-full border-b font-haasLight border-secondary-alt p-3 bg-gray-50 rounded-sm text-secondary-alt min-h-[48px] flex items-center">
          {displayValue}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full mb-24">
        {/* Header */}
        <div className="w-full border-secondary-alt">
          <div className="container mx-auto max-w-5xl px-4 py-12 font-['neue-haas-display'] text-center">
            <h1 className="lg:text-[90px] lg:leading-[85px] sm:text-[65px] sm:leading-[60px] text-[35px] leading-[30px] font-['reckless-neue-regular'] text-secondary-alt mb-5">
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

        {/* Order Type Display */}
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
                      <label key={type.id} className="inline-flex items-center cursor-default">
                        <input
                          type="radio"
                          name="orderType"
                          value={type.id}
                          checked={data?.orderStatus === type.id}
                          className="form-radio h-[34px] w-[34px] accent-[#57442D] focus:ring-[#57442D] pointer-events-none"
                          readOnly
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
            <h2 className="text-3xl font-recklessRegular text-center text-secondary-alt mb-8">
              {formContent.sections.eventDetails}
            </h2>
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {FORM_STRUCTURE.eventDetails.slice(0, 3).map((fieldId) =>
                renderField(fieldId)
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {FORM_STRUCTURE.eventDetails.slice(3).map((fieldId) => renderField(fieldId, fieldId === 'eventDescriptionPo' ? 'lg:col-span-2' : ''))}
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
              {FORM_STRUCTURE.billingDetails.slice(0, 3).map((fieldId) => renderField(fieldId))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {FORM_STRUCTURE.billingDetails.slice(3, 6).map((fieldId) => renderField(fieldId))}
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="w-full border-b border-primary-border">
          <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] py-12">
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
              {FORM_STRUCTURE.specialInstructions.map((fieldId) =>
                renderSpecialInstructionsField(fieldId)
              )}
            </div>
          </div>
        </div>

        {/* Order By */}
        <div className="w-full border-secondary-alt">
          <div className="container mx-auto max-w-5xl lg:px-4 sm:px-[134px] px-[30px] mt-[56px] pb-12">
            <h2 className="text-3xl font-['reckless-neue-regular'] text-center text-secondary-alt mb-8">
              {formContent.sections.orderBy}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {FORM_STRUCTURE.orderBy.map((fieldId) => renderField(fieldId))}
            </div>
          </div>
        </div>
      </div>
      <QuoteSummary data={data} />
    </>
  );
};