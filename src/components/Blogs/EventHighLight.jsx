'use client'
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import Image from 'next/image'
import image from '@/assets/blog-1.png'
import FilterCardSubCategories from '../common/FilterCardSubCategories'

const Buttons = ({ text, classes }) => {
    return (
        <>
            <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-1`}>{text}</button>
        </>
    )
}

const EventHighLight = () => {
    return (
        <div className='w-full'>
            <SectionTitle
                text="HENSLEY NEWS"
                classes={
                    "lg:bg-primary-alt pt-[36px] pb-[44px]"
                }
            />
            <div className='w-full border p-[24px] gap-x-[24px] flex lg:flex-row flex-col '>
                <div className='lg:w-1/2'>
                    <Image src={image} className='h-full w-full' />
                </div>
                <div className='lg:w-1/2  flex flex-row lg:flex-col gap-x-[20px] lg:px-0 max-lg:py-[40px] lg:gap-y-[15px] relative '>
                    <div className=' max-lg:w-1/2  flex flex-col gap-y-[15px]'>
                        <div className='w-full flex gap-x-[10px] justify-between'>
                            <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                inline
                '>wedding</span>
                            <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
              inline
                '>DEC 28, 2023 – Treasure Island</span>
                        </div>

                        <span className='
                uppercase
                text-secondary-alt
                lg:text-[60px]
                lg:leading-[55px]
                sm:text-[35px]
                sm:leading-[32px]
                text-[25px]
                leading-[23px]
                font-recklessRegular
                block
                '>
                            EXPERT TIPS FOR CREATING A SPECTACULAR HOLIDAY EVENT IN A CUSTOM TENT
                        </span>

                        <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                text-left
                lg:block
                 hidden
                '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet ligula lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam elementum mauris a semper consectetur. Cras et congue neque. Praesent iaculis, magna sit amet facilisis iaculis, risus nisi vestibulum dolor, viverra maximus nunc sem nec velit. Fusce ornare massa sit amet eros pulvinar, eget interdum dui semper. Morbi nulla nunc, consectetur ut efficitur eget, tristique nec tortor. Praesent dolor neque, porttitor vel tellus et, semper venenatis odio. Phasellus magna ipsum, auctor eu nibh vel, volutpat blandit turpis.</span>
                
                    <div className='w-full flex flex-wrap gap-x-[10px] gap-y-[10px]'>
                        <Buttons text="corporate" classes={"!bg-transparent border border-black"} />
                        <Buttons text="event design and production" />
                        <Buttons text="+3 Studios" />
                    </div>

                    </div>


                    <div className=' max-lg:w-1/2 lg:justify-end h-full text-right flex flex-col gap-y-[15px] '>
                        <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                text-left
                lg:hidden
                block
                '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet ligula lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam elementum mauris a semper consectetur. Cras et congue neque. Praesent iaculis, magna sit amet facilisis iaculis, risus nisi vestibulum dolor, viverra maximus nunc sem nec velit. Fusce ornare massa sit amet eros pulvinar, eget interdum dui semper. Morbi nulla nunc, consectetur ut efficitur eget, tristique nec tortor. Praesent dolor neque, porttitor vel tellus et, semper venenatis odio. Phasellus magna ipsum, auctor eu nibh vel, volutpat blandit turpis.</span>
                       <button className='
                    font-haasRegular
                    text-[12px]
                    leading-[20px]
                    uppercase
                    text-secondary-alt
                    text-left
                    
                    '>+ READ MORE</button>
                    </div>
             
                </div>
            </div>

        </div>
    )
}

export default EventHighLight