import React from 'react'
import SectionTitle from '../common/SectionTitle'
import Image from 'next/image'
import image from '@/assets/tent-page-1.png'
import TentTypesSlider from './TentTypesSlider'

const TentsTypes = () => {
    return (
        <>
            <SectionTitle text="types of tents" classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b" />
            <div className='lg:grid hidden w-full  grid-cols-3 gap-x-[24px] px-[24px] py-[31px]'>
                <div
                    className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

                >
                    <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
                        <div className='border-b border-white pb-[17px] w-full'>
                            <h3 className='w-full break-words 
                            xl:text-[70px] 
                            xl:leading-[55px]
                            lg:text-[40px]
                            lg:leading-[35px]
                            text-white font-recklessRegular uppercase'>structures</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
                            <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
                                <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
                                    <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                </g>
                            </g>
                        </svg>

                    </div>
                </div>

                <div
                    className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

                >
                    <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
                        <div className='border-b border-white pb-[17px] w-full'>
                            <h3 className='w-full break-words 
                            xl:text-[70px] 
                            xl:leading-[55px]
                            lg:text-[40px]
                            lg:leading-[35px]
                            text-white font-recklessRegular uppercase'>TENSION
                                TENTS</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
                            <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
                                <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
                                    <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                </g>
                            </g>
                        </svg>

                    </div>
                </div>

                <div
                    className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

                >
                    <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
                        <div className='border-b border-white pb-[17px] w-full'>
                            <h3 className='w-full break-words 
                            xl:text-[70px] 
                            xl:leading-[55px]
                            lg:text-[40px]
                            lg:leading-[35px]
                            text-white font-recklessRegular uppercase'>FRAME
                                TENTS</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
                            <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
                                <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
                                    <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                    <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" stroke-miterlimit="10" strokeWidth="1" />
                                </g>
                            </g>
                        </svg>

                    </div>
                </div>

            </div>
            <TentTypesSlider />
        </>
    )
}

export default TentsTypes