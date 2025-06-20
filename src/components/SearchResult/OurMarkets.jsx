import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { CustomLink } from '../common/CustomLink'
import { generateImageURL } from '@/utils/generateImageURL'


const MarketCard = ({ data }) => {
  const imageURL = generateImageURL({ wix_url: data.image1 });
  return (
    <CustomLink to={`/market/${data.slug}`} className='sm:block hidden p-[24px] border border-primary-border'>
      <div className='w-full h-full flex lg:items-end lg:justify-start justify-center bg-no-repeat bg-center px-[24px] py-[24px]' style={{ backgroundImage: `url(${imageURL})`, backgroundSize: 'cover' }}>

        <div className='lg:flex hidden  justify-center items-center gap-x-[24px]'>
          <svg xmlns="http://www.w3.org/2000/svg" width="34.736" height="34.736" viewBox="0 0 34.736 34.736">
            <g id="Group_3565" data-name="Group 3565" transform="translate(0.354 0.383)">
              <g id="Group_2072" data-name="Group 2072">
                <path id="Path_3283" data-name="Path 3283" d="M.354.5H34.121V34.268" transform="translate(-0.238 -0.383)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                <line id="Line_13" data-name="Line 13" x1="34" y2="34" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                <line id="Line_14" data-name="Line 14" x1="34" y2="34" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
              </g>
            </g>
          </svg>

          <span className='font-recklessRegular 
            text-[45px]
            text-white
            uppercase
            '
          >{data.title}</span>
        </div>

        <span className='font-recklessRegular 
            lg:hidden
            block
            text-[45px]
            text-white
            uppercase
            '
        >{data.title}</span>

      </div>
    </CustomLink>
  )
}

const OurMarkets = ({ data, pageTitle }) => {

  return (
    <>
      <div className='px-[24px] border-b border-primary-border pb-8'>
        <SectionTitle text={pageTitle} classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
        <div className='w-full sm:h-[330px] grid sm:grid-cols-3 grid-cols-2 justify-center gap-x-[24px] sm:gap-y-0 gap-y-[11px]'>
          {data.map((item, index) => (
            <MarketCard key={index} data={item} />
          ))}
          <div className='sm:col-span-3 col-span-2 sm:hidden grid grid-cols-2 gap-[24px]'>
            <div className='grid grid-cols-2 gap-[24px] sm:hidden col-span-2 sm:col-span-3'>
              {data.map((item, index) => {
                const isLastOdd = data.length % 2 !== 0 && index === data.length - 1;
                return (
                  <CustomLink to={`/market/${item.slug}`}
                    key={item._id}
                    className={`flex items-center justify-center h-[60px] border border-black font-haasRegular text-[14px] uppercase ${isLastOdd ? 'col-span-2 mx-auto w-1/2' : 'col-span-1'}`}
                  >
                    <span>{item.title}</span>
                  </CustomLink>
                );
              })}
            </div>


          </div>

        </div>
      </div>
    </>
  )
}

export default OurMarkets;