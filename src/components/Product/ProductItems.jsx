import React from 'react'
import ProductSlider from './ProductSlider'
import ProductSlider_tab from './ProductSlider_tab'
import { LoadMoreButton } from '../common/LoadMoreButton'
import { AddToQuote } from './AddtoQuoteButton'
import { PrimaryImage } from '../common/PrimaryImage'

const ProductItems = () => {
  return (
    <div className='w-full flex lg:flex-row flex-col gap-x-[24px] px-[24px] py-[24px] lg:gap-y-0 gap-y-[30px] min-h-[937px] '>
      <div className='xl:w-1/2 '>
        <ProductSlider />
        <ProductSlider_tab />
      </div>
      <div className='xl:w-1/2 flex flex-col items-center relative'>
        <div className='lg:max-w-[656px] sm:max-w-[492px] h-full'>
          <span className='text-secondary-alt 
          lg:text-[16px]
          text-[12px]
          uppercase font-haasLight'>Home/corporate</span>
          <h3 className='uppercase text-secondary-alt font-recklessRegular 
          lg:text-[90px] 
          lg:leading-[85px]
          text-[35px]
          leading-[30px]
          lg:mt-[15px]
          lg:mb-[28px]
          sm:mt-[9px]
          sm:mb-[9px]
          '>Romania Collection</h3>
          <div className='lg:mb-[48px] sm:mb-[10px] flex lg:justify-end gap-x-[28px]'>
            <span className='text-[35px] text-secondary-alt font-recklessRegular'>$205.80</span>
            <span className='text-[35px] text-secondary-alt font-recklessRegular uppercase'>(total)</span>
          </div>


          <table className="w-full text-left border-separate border-spacing-y-[24px]">
            <thead>
              <tr className="text-xs uppercase text-gray-500 border-b border-black">
                <td className="pb-2 w-1/4 text-[16px] uppercase font-haasLight text-secondary-alt">Product</td>
                <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Size</td>
                <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Price</td>
                <td className="pb-2 w-1/4 text-center text-[16px] uppercase font-haasLight text-secondary-alt">Quantity</td>
              </tr>
            </thead>
            <tbody>
              {[
                { product: 'CHARGER', size: '-', price: '$5.80' },
                { product: 'DINNER PLATE', size: '11"', price: '$2.65' },
                { product: 'DINNER PLATE', size: '9"', price: '$2.65' },
                { product: 'RICE BOWL', size: '-', price: '$2.65' },
                { product: 'B&B', size: '-', price: '$2.65' },
                { product: 'MUG', size: '-', price: '$2.65' },
                { product: 'SERVING BOWL', size: '9"', price: '$10.80' },
                { product: 'SERVING PLATTER', size: '12"', price: '$15.75' },
              ].map((item, index) => (
                <tr key={index}>
                  <td className="py-2 font-semibold border-b border-black">{item.product}</td>
                  <td className="text-center border-b border-black">{item.size}</td>
                  <td className="text-center border-b border-black">{item.price}</td>
                  <td className="border-b border-black">
                    <div className="flex items-center justify-center gap-x-[30px]">
                      <button className="text-xl font-light">−</button>
                      <span className="font-bold">02</span>
                      <button className="text-xl font-light">+</button>
                    </div>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>

          <div className='flex flex-col gap-y-[15px]'>
            <span className='text-[16px] text-secondary-alt font-haasLight block'>Description</span>
            <span className='text-[16px] text-secondary-alt font-haasLight block'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices ipsum purus, at aliquam mauris interdum nec. Maecenas in pellentesque sapien, ut sodales augue. Sed magna lacus, scelerisque quis dui eu, tempus auctor nunc. In pulvinar sapien id mi mattis pulvinar. Vivamus lobortis nibh in blandit pulvinar. Morbi sagittis justo vitae risus tristique condimentum. Pellentesque elementum </span>
            <button className="flex items-center gap-2 text-sm font-medium text-black text-secondary-alt font-haasBold uppercase">
              Readmore
              <svg xmlns="http://www.w3.org/2000/svg" width="12.231" height="13.578" viewBox="0 0 12.231 13.578">
                <path id="SETA" d="M13.578,6.115,6.458,12.231l-.884-.756L11.2,6.658H0V5.548H11.2L5.574.755,6.458,0Z" transform="translate(12.231) rotate(90)" fill="#2c2216" />
              </svg>
            </button>

          </div>

        </div>
         <AddToQuote text="add to quote"/>

          <div className="lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] items-center justify-center shrink-0 cursor-pointer">
                         <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
                         <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
                     </div>

      </div>
    </div>
  )
}

export default ProductItems