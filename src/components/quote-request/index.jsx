"use client";
import React, { useState } from 'react'

export const QuoteRequest = () => {
  // Form content configuration - makes content dynamic and maintainable
  const formConfig = {
    header: {
      title: "QUOTE REQUEST",
      subtitle1: "LET'S BUILD YOUR NEXT",
      subtitle2: "UNFORGETTABLE EVENT TOGETHER!",
      description: "Please complete this form to request a quote. We promise to respond to you within 48 hours. We look forward to the necessary details concerning your event and helping you make it truly memorable! Our customer service team is available to assist and will contact you if more information is required."
    },
    orderTypes: [
      { id: 'delivery', label: 'DELIVERY' },
      { id: 'willCall', label: 'WILL CALL' }
    ],
    eventDetails: {
      title: "EVENT DETAILS",
      fields: [
        { id: 'eventDate', label: 'EVENT DATE*', placeholder: 'MM / DD / YY', required: true, type: 'text' },
        { id: 'deliveryDate', label: 'DELIVERY DATE*', placeholder: 'MM / DD / YY', required: true, type: 'text' },
        { id: 'pickupDate', label: 'PICKUP DATE*', placeholder: 'MM / DD / YY', required: true, type: 'text' },
        { id: 'eventLocation', label: 'EVENT LOCATION', placeholder: '', required: false, type: 'text', fullRow: false },
        { id: 'eventDescription', label: 'EVENT DESCRIPTION / PO#', placeholder: '', required: false, type: 'text', fullRow: false }
      ]
    },
    billingDetails: {
      title: "BILLING DETAILS",
      fields: [
        { id: 'billTo', label: 'BILL TO*', placeholder: 'CUSTOMER/ACCOUNT NAME', required: true, type: 'text' },
        { id: 'streetAddress', label: 'STREET ADDRESS*', placeholder: '', required: true, type: 'text' },
        { id: 'addressLine2', label: 'ADDRESS LINE 2', placeholder: '', required: false, type: 'text' },
        { id: 'city', label: 'CITY*', placeholder: '', required: true, type: 'text' },
        { id: 'state', label: 'STATE*', placeholder: '', required: true, type: 'text' },
        { id: 'zipCode', label: 'ZIP CODE*', placeholder: '', required: true, type: 'text' },
        { id: 'specialInstructions', label: 'SPECIAL INSTRUCTIONS OR ORDER COMMENTS', placeholder: '', required: false, type: 'text' },
        { id: 'city2', label: 'CITY', placeholder: '', required: false, type: 'text' },
        { id: 'state2', label: 'STATE', placeholder: '', required: false, type: 'text' }
      ]
    },
    orderBy: {
      title: "ORDER BY",
      fields: [
        { id: 'name', label: 'NAME*', placeholder: 'GABRIEL MACCHI', required: true, type: 'text' },
        { id: 'email', label: 'EMAIL*', placeholder: 'GABRIEL@PETRICHDESIGN', required: true, type: 'email' }
      ]
    },
    submitButton: "SUBMIT"
  };

  const [orderType, setOrderType] = useState('delivery');
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted with data:', { ...formData, orderType });
  };  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 font-['neue-haas-display']">
      {/* Quote Request Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-['reckless-neue-regular'] text-gray-800 mb-5">{formConfig.header.title}</h1>
        <p className="text-lg uppercase font-light text-gray-700 mb-1">{formConfig.header.subtitle1}</p>
        <p className="text-lg uppercase font-light text-gray-700 mb-8">{formConfig.header.subtitle2}</p>
        <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
          {formConfig.header.description}
        </p>
      </div>      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Order Type Selection */}
        <div className="bg-primary rounded-sm p-5 flex justify-center mb-10">
          <div className="flex items-center space-x-10">
            <p className="font-medium text-gray-700 tracking-wide">YOUR ORDER IS:</p>
            {formConfig.orderTypes.map((type) => (
              <label key={type.id} className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="orderType"
                  value={type.id}
                  checked={orderType === type.id}
                  onChange={() => setOrderType(type.id)}
                  className="form-radio h-5 w-5 text-primary focus:ring-primary"
                />
                <span className="ml-2 font-medium text-secondary-alt">{type.label}</span>
              </label>
            ))}
          </div>
        </div>        {/* Event Details */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {formConfig.eventDetails.fields.slice(0, 3).map(field => (
              <div key={field.id}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.eventDetails.fields.slice(3).map(field => (
              <div key={field.id} className={field.fullRow ? "col-span-full" : ""}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>
        </div>        {/* Billing Details */}
        <div className="mb-12">
          <h2 className="text-3xl font-['reckless-neue-regular'] text-center text-secondary-alt mb-8">{formConfig.billingDetails.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {formConfig.billingDetails.fields.slice(0, 3).map(field => (
              <div key={field.id}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-secondary shadow-sm bg-primary-alt text-secondary-alt"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {formConfig.billingDetails.fields.slice(3, 6).map(field => (
              <div key={field.id}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formConfig.billingDetails.fields.slice(6).map(field => (
              <div key={field.id}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>
        </div>        {/* Order By */}
        <div className="mb-12">
          <h2 className="text-3xl font-['reckless-neue-regular'] text-center text-secondary-alt mb-8">{formConfig.orderBy.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.orderBy.fields.map(field => (
              <div key={field.id}>
                <label className="block text-xs uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full border border-primary p-3 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-secondary shadow-sm bg-primary-alt text-secondary-alt"
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-primary py-4 rounded-sm hover:bg-primary-alt transition duration-200 text-secondary-alt font-medium uppercase tracking-wider shadow-md border border-primary"
        >
          {formConfig.submitButton}
        </button>
      </form>
    </div>
  );
}
