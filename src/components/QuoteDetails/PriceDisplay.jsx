import useUserData from '@/hooks/useUserData';
import React from 'react'

const PriceDisplay = ({ totalPrice }) => {
  const { firstName, lastName } = useUserData();

  const name = firstName && lastName ? `${firstName} ${lastName},` : '';

  return (
    <>
      <div className='lg:block h-full hidden'>
        <span className='
        xl:text-[50px]
        xl:leading-[55px]
        lg:text-[30px]

        font-haasLight
        block
        uppercase
        '>
          HEY, <br />
          {name} THE TOTAL OF  YOUR PURCHASE IS
        </span>
        <span className='
        font-recklessBold
        xl:text-[80px]
        lg:text-[50px]
        uppercase
        mt-[20px]
        block
        '>{totalPrice}</span>
      </div>

      <div className='lg:hidden w-full text-center flex flex-col gap-y-[15px] sm:py-[34px] py-[10px]'>
        <span className='block 
        text-[65px]
        leading-[55px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        '>Your Cart</span>
        <span className='text-[14px] leading-[18px] font-haasRegular block text-secondary-alt uppercase'>HEY , {name}<br />
          THE TOTAL OF YOUR PURCHASE IS</span>
        <span className='text-[35px] leading-[45px] text-secondary-alt uppercase font-recklessRegular'>{totalPrice}</span>
      </div>
    </>
  )
}

export default PriceDisplay