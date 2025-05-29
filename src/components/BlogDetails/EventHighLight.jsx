import React from 'react'
import image from '@/assets/blog-detail-1.png'

const Buttons = ({ text, classes }) => {
    return (
        <>
            <button className={`${classes} border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-1`}>{text}</button>
        </>
    )
}

const EventHighLight = () => {
    return (
        <div className='px-[24px] w-full'>
            <div className='w-full border-b py-[24px]'>
                <div className='w-full h-[609px] bg-no-repeat bg-center' style={{ backgroundImage: `url(${image.src})` }}></div>
            </div>
            <div className='flex lg:flex-row flex-col gap-x-[182px] lg:px-0 sm:px-[70px] px-[20px] py-[40px] justify-between relative'>
                <div className='lg:w-1/2 flex flex-col gap-y-[15px]'>
                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                block
                '>wedding</span>

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
                lg:hidden
                block
                '>DEC 28, 2023 – Treasure Island</span>
                    <div className='w-full flex gap-x-[10px]'>
                        <Buttons text="corporate" classes={"!bg-transparent border border-black"} />
                        <Buttons text="event design and production" />
                        <Buttons text="+3 Studios" />
                    </div>
                   
                </div>
                <div className='lg:w-1/2 text-right flex flex-col gap-y-[15px] '>
                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                lg:block
                hidden
                '>DEC 28, 2023 – Treasure Island</span>
                    <span className='
                font-haasRegular
                uppercase
                text-[12px]
                text-secondary-alt
                text-left
                block
                max-lg:mt-[60px]
                '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet ligula lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam elementum mauris a semper consectetur. Cras et congue neque. Praesent iaculis, magna sit amet facilisis iaculis, risus nisi vestibulum dolor, viverra maximus nunc sem nec velit. Fusce ornare massa sit amet eros pulvinar, eget interdum dui semper. Morbi nulla nunc, consectetur ut efficitur eget, tristique nec tortor. Praesent dolor neque, porttitor vel tellus et, semper venenatis odio. Phasellus magna ipsum, auctor eu nibh vel, volutpat blandit turpis.</span>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36.355"
                    height="36.562"
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-5 lg:block hidden"
                    viewBox="0 0 36.355 36.562"
                >
                    <g id="Group_3530" data-name="Group 3530" transform="translate(35.855 18.178) rotate(135)">
                        <path id="Path_3283" data-name="Path 3283" d="M.354.5h25v25" transform="translate(-0.354 -0.501)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                        <line id="Line_13" data-name="Line 13" x1="25" y2="25" transform="translate(0)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                        <line id="Line_14" data-name="Line 14" x1="25" y2="25" transform="translate(0)" fill="none" stroke="#2c2216" stroke-miterlimit="10" strokeWidth="1" />
                    </g>
                </svg>

            </div>
        </div>
    )
}

export default EventHighLight