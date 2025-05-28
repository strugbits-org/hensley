import React from 'react'

const PriceDisplay = () => {
  return (
    <>
    <div className='lg:block hidden'>
        <span className='
        text-[50px]
        leading-[55px]
        font-haasLight
        block
        '>
            HEY, <br />
MIRCEA, THE TOTAL OF  YOUR PURCHASE IS
        </span>
        <span className='
        font-recklessBold
        text-[90px]
        uppercase
        mt-[20px]
        block
        '>u$ 45.000</span>
    </div>

    <div className='lg:hidden w-full text-center flex flex-col gap-y-[15px] py-[34px]'>
        <span className='block 
        text-[65px]
        leading-[55px]
        text-secondary-alt
        font-recklessRegular
        uppercase
        '>our categories</span>
        <span className='text-[14px] leading-[18px] font-haasRegular block text-secondary-alt uppercase'>HEY MIRCEA, <br />
THE TOTAL OF YOUR PURCHASE IS</span>
<span className='text-[35px] leading-[45px] text-secondary-alt uppercase font-recklessRegular'>u$ 45.000</span>
    </div>
    </>
  )
}

export default PriceDisplay