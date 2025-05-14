import Image from 'next/image'
import arrowDown from '@/assets/icons/arrow-down-stick.svg'
import { useState } from 'react';

const SubCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleList = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className='flex justify-center items-center pb-[18px]'>
        <div className='lg:w-[924px] sm:w-[681px] w-[344px] bg-white py-[25px] sm:px-[71px] px-[21px] flex flex-col justify-between items-center cursor-pointer'>
          <div className='flex flex-row w-full justify-between items-center' onClick={toggleList}>
            <h3 className='lg:text-[45px] text-[25px] font-recklessRegular uppercase text-secondary-alt'>all categories</h3>
            <Image src={arrowDown} className='w-[16px] h-[16px] lg:h-[24px] lg:w-[24px]' />
          </div>
          {isOpen && (
            <ul className="grid grid-cols-2 gap-y-4 gap-x-4 w-full list-none py-[23px]">
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">Premium Collection</li>
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">China</li>
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">Chargers</li>
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">Flatware</li>
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">Stemware</li>
              <li className="text-[18px] text-secondary-alt uppercase font-recklessLight">Barware</li>
            </ul>
          )}
        </div>
      </div>

    </>
  )
}

export default SubCategories