"use client"
import useUserData from '@/hooks/useUserData';
import React, { useState, useCallback, useMemo, useEffect } from 'react'

const PAGE_DATA = {
  heading: "MY ACCOUNT",
  description: "View and edit your personal info below.",
  accountTitle: "ACCOUNT",
  accountSubtitle: "Update your personal information.",
  loginEmailText: "Login Email:",
  loginEmailNote: "Your Login email can't be changed",
  discardButtonText: "DISCARD",
  updateButtonText: "UPDATE INFO",
  formFields: {
    firstName: "FIRST NAME*",
    lastName: "LAST NAME*",
    email: "EMAIL*",
    phone: "PHONE"
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

const FormField = React.memo(({ fieldKey, field, value, onChange }) => {
  const inputType = field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text';

  return (
    <div className='w-[calc(50%-12px)] max-lg:max-w-[491px] max-lg:w-full'>
      <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2 max-md:text-sm">
        {field}
      </label>
      <input
        id={fieldKey}
        type={inputType}
        name={fieldKey}
        placeholder={field}
        className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white focus:outline-none shadow-sm text-secondary-alt placeholder-secondary max-md:text-sm`}
        required={true}
        data-datepicker
        onChange={onChange}
        value={value}
        readOnly={inputType === 'email'}
      />
    </div>
  );
});

export const MyAccount = () => {
  const [formData, setFormData] = useState({});
  const { firstName, lastName, email, phone } = useUserData();

  const handleInputChange = useCallback((ev) => {
    const { name, value } = ev.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((ev) => {
    ev.preventDefault();
    console.log(formData, 'formDataformData');
  }, [formData]);

  const setInitialData = useCallback(() => {
    setFormData({ firstName, lastName, email, phone });
  }, [firstName, lastName, email, phone]);

  useEffect(() => {
    setInitialData();
  }, [firstName, lastName, email, phone]);

  const formFields = useMemo(() =>
    Object.entries(PAGE_DATA.formFields).map(([fieldKey, field]) => (
      <FormField
        key={fieldKey}
        fieldKey={fieldKey}
        field={field}
        value={formData[fieldKey] || ""}
        onChange={handleInputChange}
      />
    )), [formData, handleInputChange]
  );

  return (
    <div className='MyAccount w-full max-lg:mb-[85px]'>
      <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
        <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[85px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
          {PAGE_DATA.heading}
        </h2>
      </div>

      <div className='py-[86px] px-6 max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
        <div className='max-w-[924px] w-full mx-auto'>
          <div className='flex justify-between items-center max-lg:flex-col gap-y-[7px]'>
            <div className='flex flex-col gap-y-[7px] max-md:gap-0'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs'>
                {PAGE_DATA.description}
              </p>
              <p className='text-base font-haasBold leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs'>
                {PAGE_DATA.accountTitle}
              </p>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center max-md:text-xs'>
                {PAGE_DATA.accountSubtitle}
              </p>
            </div>
            <div className='flex flex-col gap-y-[7px] max-md:gap-0'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs'>
                {PAGE_DATA.loginEmailText} <br className='max-lg:hidden' />
                <b className='text-base font-haasBold leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs'>
                  {email}
                </b>
              </p>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center max-md:text-xs'>
                {PAGE_DATA.loginEmailNote}
              </p>
            </div>
          </div>

          <form
            className='w-full flex flex-wrap gap-x-6 mt-[103px] max-lg:mt-[43px] gap-y-9 max-lg:gap-y-8 items-center justify-center'
            onSubmit={handleSubmit}
          >
            {formFields}

            <div className='flex justify-between w-full max-lg:flex-col max-lg:justify-center max-lg:items-center'>
              <button
                type="button"
                className='w-[292px] max-lg:max-w-[491px] max-lg:w-full h-[60px] text-sm font-haasRegular tracking-widest border border-[#2C2216] max-lg:mb-[13px]'
                onClick={setInitialData}
              >
                {PAGE_DATA.discardButtonText}
              </button>

              <button
                type='submit'
                className='max-w-[608px] min-w-[292px] max-lg:max-w-[491px] max-lg:w-full w-full h-[60px] max-lg:h-[90px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative'
              >
                <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                  {PAGE_DATA.updateButtonText}
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