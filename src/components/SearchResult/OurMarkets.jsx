import React from 'react'
import SectionTitle from '../common/SectionTitle'
import image from '@/assets/search-image.png'


const MarketCard = () => {
  return (
    <>
      <div className='sm:block hidden p-[24px] border'>
        <div className='w-full h-full flex lg:items-end lg:justify-start justify-center bg-no-repeat bg-center px-[24px] py-[24px]' style={{ backgroundImage: `url(${image.src})` }}>

          <div className='lg:flex hidden  justify-center items-center gap-x-[24px]'>
            <svg xmlns="http://www.w3.org/2000/svg" width="34.736" height="34.736" viewBox="0 0 34.736 34.736">
              <g id="Group_3565" data-name="Group 3565" transform="translate(0.354 0.383)">
                <g id="Group_2072" data-name="Group 2072">
                  <path id="Path_3283" data-name="Path 3283" d="M.354.5H34.121V34.268" transform="translate(-0.238 -0.383)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" stroke-width="1" />
                  <line id="Line_13" data-name="Line 13" x1="34" y2="34" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" stroke-width="1" />
                  <line id="Line_14" data-name="Line 14" x1="34" y2="34" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" stroke-width="1" />
                </g>
              </g>
            </svg>

            <span className='font-recklessRegular 
            text-[45px]
            text-white
            uppercase
            '
            >social</span>
          </div>

          <span className='font-recklessRegular 
            lg:hidden
            block
            text-[45px]
            text-white
            uppercase
            '
          >social</span>

        </div>
      </div>
    </>
  )
}


const CardButtons = () => {
  return (
    <>
      <button className='sm:hidden block h-[60px] w-full border border-black font-haasRegular text-[14px] uppercase'>Social</button>
    </>
  )
}


const OurMarkets = () => {
  return (
    <>
      <div className='px-[24px]'>
        <SectionTitle text="our markets" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
      <div className='w-full sm:h-[330px] grid sm:grid-cols-3 grid-cols-2 justify-center gap-x-[24px] sm:gap-y-0 gap-y-[11px]'>
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <CardButtons />
        <CardButtons />
        <div className='sm:hidden px-[100px] col-span-2 w-full flex justify-center items-center'>
          <CardButtons />
        </div>
      </div>
      </div>
    </>
  )
}

export default OurMarkets