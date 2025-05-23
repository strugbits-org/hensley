"use client"
import { AddToQuote } from '@/components/Cart/AddtoQuoteButton'
import React, { useState } from 'react'

function MyAccount() {
  const data = {
    heading: "MY ACCOUNT",
    email: "gabriel@petrikor.design"

  }
  let formField = [
    { id: "firstName", label: "FIRST NAME*", placeholder: "FIRST NAME", required: true, type: "text" },
    { id: "lastName", label: "LAST NAME*", placeholder: "LAST NAME", required: true, type: "text" },
    { id: "email", label: "EMAIL*", placeholder: "EMAIL", required: true, type: "email" },
    { id: "phone", label: "PHONE", placeholder: "+123456789", required: false, type: "tel" },
  ]
  const [formData, setFormData] = useState({})
  const handleInputChange = (ev) => {
    setFormData(prv => ({ ...prv, [ev.target.name]: ev.target.value }))
  }
  const onSubmit = (ev) => {
    ev.preventDefault()
    console.log(formData, 'formDataformData')
  }
  return (
    <div className='MyAccount w-full max-lg:mb-[85px]'>
      <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
        <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[85px] max-lg:text-[55px] max-lg:leading-[50px]'>{data.heading}</h2>
      </div>
      <div className='py-[86px] px-6 max-lg:py-0 max-lg:mt-3'>
        <div className='max-w-[924px] w-full mx-auto'>
          <div className='flex justify-between items-center max-lg:flex-col gap-y-[7px]'>
            <div className='flex flex-col gap-y-[7px]'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center'>View and edit your personal info below.</p>
              <p className='text-base font-haasBold leading-[16px] text-secondary-alt max-lg:text-center'>ACCOUNT</p>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt max-lg:text-center'>Update your personal information.</p>
            </div>
            <div className='flex flex-col gap-y-[7px]'>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center'>Login Email: <br className='max-lg:hidden' /> <b className='text-base font-haasBold leading-[16px] text-secondary-alt text-right max-lg:text-center'>{data.email}</b></p>
              <p className='text-base font-haasRegular leading-[16px] text-secondary-alt text-right max-lg:text-center'>Your Login email can’t be changed</p>
            </div>
          </div>

          <form className='w-full flex flex-wrap gap-x-6 mt-[103px] max-lg:mt-[43px] gap-y-9 max-lg:gap-y-8 items-center justify-center' onSubmit={onSubmit}>
            {formField.map((field, i) => (

              <div key={field.id} className='w-[calc(50%-12px)] max-lg:max-w-[491px] max-lg:w-full'>
                <label className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white  focus:outline-none  shadow-sm text-secondary-alt placeholder-secondary"
                  required={field.required}
                  data-datepicker
                  onChange={handleInputChange}
                value={formData[field.id] || ""}
                />
              </div>
            ))}
            <div className='flex justify-between w-full max-lg:flex-col max-lg:justify-center max-lg:items-center'>
              <button className='w-[292px] max-lg:max-w-[491px] max-lg:w-full h-[60px] text-sm font-haasRegular tracking-widest	 border border-[#2C2216]  max-lg:mb-[13px]'
              onClick={()=>{
                setFormData({})
              }}
              >DISCARD</button>
              <button type='submit' className={`
        max-w-[608px]
        min-w-[292px]
        max-lg:max-w-[491px] max-lg:w-full
        w-full
        h-[60px]
        max-lg:h-[90px]
         bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary
        relative
        
        `}>
                <span
                  className='
             font-haasLight uppercase 
        text-sm leading-[30px]
        group-hover:font-haasBold
            '
                >UPDATE INFO</span>

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

              </button>

            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default MyAccount