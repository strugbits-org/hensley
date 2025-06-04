import React from 'react'
import BannerStructures from './BannerStructures'
import tent1 from '@/assets/tent-open-1.png'
import tent2 from '@/assets/tent-open-2.png'
import tent3 from '@/assets/tent-open-3.png'
import Image from 'next/image'
import { DownloadButton } from './DownloadButton'


const TentGallery = () => {
  return (
    <div className='w-full min-h-screen bg-secondary-alt py-[75px] px-[24px]'>
            <BannerStructures />
            <div className="w-full grid gap-[24px] mt-6 grid-cols-1 lg:grid-cols-[minmax(0,1082px)_minmax(0,766px)]">
    <div className='lg:h-[1304px] sm:h-[950px] h-[668px]'>
        <Image src={tent1} className="h-full w-full" />
    </div>
    <div className='lg:h-[1304px] sm:h-[950px] h-[668px]' >
        <Image src={tent1} className="h-full w-full" />
    </div>
    <div className="lg:col-span-2 lg:h-[1304px] sm:h-[950px] h-[668px]">
        <Image src={tent3} className="h-full w-full" />
    </div>
    </div>
    
    </div>
  )
}

export default TentGallery