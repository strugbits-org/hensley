import React from 'react'
import Image from 'next/image'
import image from '@/assets/blog-detail-2.png'
import image2 from '@/assets/blog-detail-3.png'

const EventGallery = () => {
  return (
    <div className='w-full px-[24px]'>
        <div className='w-full grid sm:grid-cols-2 grid-cols-1 gap-[24px]'>
            <div className='lg:h-[668px] sm:h-[440px] h-[554px]'>
                <Image src={image} className='h-full w-full'/>
            </div>
            <div className='lg:h-[668px] sm:h-[440px] h-[554px]'>
                <Image src={image} className='h-full w-full'/>
            </div>
            <div className='sm:col-span-2 lg:h-[1000px] sm:h-[402px] h-[554px]'>
                <Image src={image} className='h-full w-full'/>
            </div>
        </div>
        <div className='w-full flex justify-center py-[150px]'>
            <p className='lg:max-w-[924px] sm:max-w-[492px] w-full
            font-haasRegular
            text-[16px]
            leading-[20px]
            uppercase
            text-secondary-alt
            '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet ligula lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam elementum mauris a semper consectetur. Cras et congue neque. Praesent iaculis, magna sit amet facilisis iaculis, risus nisi vestibulum dolor, viverra maximus nunc sem nec velit. Fusce ornare massa sit amet eros pulvinar, eget interdum dui semper. Morbi nulla nunc, consectetur ut efficitur eget, tristique nec tortor. Praesent dolor neque, porttitor vel tellus et, semper venenatis odio. Phasellus magna ipsum, auctor eu nibh vel, volutpat blandit turpis.
Aliquam sit amet tellus fermentum, semper orci finibus, ultrices orci. Maecenas faucibus feugiat tincidunt. Pellentesque non leo congue, dictum magna ac, laoreet erat. Nunc venenatis tristique enim, et finibus felis ultricies a. Suspendisse ac viverra orci, et consequat dolor. Fusce convallis est eu felis venenatis, at viverra est semper. Proin ultricies felis nec arcu vestibulum, non cursus dui mollis. Nullam risus diam, volutpat non cursus eu, pretium vel orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam aliquam, lectus at vestibulum tincidunt, enim sem vestibulum erat, et feugiat velit eros vitae urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
        </div>

        <div className='h-[1029px] grid lg:grid-cols-1 sm:grid-cols-2 grid-cols-1 w-full gap-[24px]'>
            <div>
                <Image src={image2} className='h-full w-full'/>
            </div>
                        <div className='lg:hidden block'>
                <Image src={image2} className='h-full w-full'/>
            </div>
        </div>

    </div>
  )
}

export default EventGallery