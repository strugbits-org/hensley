import React from 'react'
import CartSlider from '../common/CartSlider'

function Section3() {
  return (
    <div className='h-[1231px] flex flex-col border'>
        <div className='w-full flex items-center justify-center h-[200px] '>
            <h1 className=' text-[#2C2216] text-[200px] font-recklessRegular'>HOW WE DO IT</h1>
        </div>
        <div className='h-screen bg-[#F0DEA2]'>
            <CartSlider /> 
        </div>
    </div>
  )
}

export default Section3