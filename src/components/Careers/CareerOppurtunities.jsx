"use client"
import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { useRef } from 'react';

const CareerOppurtunities = () => {
    const videoRef = useRef(null);

    const handlePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };
    return (
        <div>
            <div className='flex flex-col gap-x-[48px]'>
                <SectionTitle text={"put our clients & employees first"} classes={"xl:!text-[140px] xl:leading-[140px] lg:text-[140px] border-none"} />
                <div className='w-full text-center'>
                    <button className='sm:w-[656px] w-[95%] relative bg-primary lg:h-[130px] h-[90px] my-[33px] group'>
                        <span className='font-haasLight uppercase text-[16px]  tracking-[5px]'>
                            Access our job board
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19.877"
                            height="19.67"
                            viewBox="0 0 19.877 19.67"
                            className='ml-2 transition-all duration-300 stroke-[#2c2216] absolute right-[5%] top-1/2 -translate-y-1/2'
                        >
                            <g transform="translate(9.835 0.5) rotate(45)">
                                <path
                                    d="M0,0H13.2V13.2"
                                    fill="none"
                                    strokeMiterlimit="10"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="13.202"
                                    y2="13.202"
                                    fill="none"
                                    strokeMiterlimit="10"
                                    strokeWidth="1"
                                />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>




            <div className='w-full flex flex-col justify-center items-center border-t border-b'>
                <div className="lg:w-[80%] w-[95%]    py-[24px] min-h-screen relative">
                    <div className="lg:h-[875px] sm:h-[408px] h-[263px] relative">
                        <video
                            ref={videoRef}
                            src="https://video.wixstatic.com/video/ef8565_cab2a045f0f9495590d678089c6fc2d6/1080p/mp4/file.mp4"
                            controls
                            loop
                            muted
                            className="w-full h-full object-cover"
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Play Button */}
                        <button
                            onClick={handlePlay}
                            className="
                        absolute inset-0 z-10 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className='         lg:h-[172px]
                        lg:w-[172px]
                        sm:h-[154px]
                        sm:w-[154px]
                        h-[85px]
                        w-[85px]'
                                viewBox="0 0 172 172"
                            >
                                <g transform="translate(-0.497 0.001)">
                                    <g
                                        transform="translate(0.497 -0.001)"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="3"
                                    >
                                        <circle cx="86" cy="86" r="86" stroke="none" />
                                        <circle cx="86" cy="86" r="84.5" fill="none" />
                                    </g>
                                    <path
                                        d="M42,0,84,74H0Z"
                                        transform="translate(133.497 45) rotate(90)"
                                        fill="#fff"
                                    />
                                </g>
                            </svg>
                        </button>
                    </div>

                    {/* Text Section */}
                    <div className="w-full flex justify-between mt-[12px] lg:gap-x-[12px] sm:gap-x-[15px] gap-y-[12px] sm:flex-row flex-col">
                        <h3 className="
                    text-[35px] leading-[30px]
                    lg:text-[60px] lg:leading-[55px] 
                    sm:text-[35px] sm:leading-[30px]
                    text-secondary-alt uppercase font-recklessRegular">
                            career <br /> opportunities
                        </h3>
                        <div className='max-w-[550px] sm:w-[360px]'>
                            <p className="sm:text-[16px] sm:leading-[20px] text-[14px] leading-[18px] text-secondary-alt">
                                Hensley Event Resources is united in superior customer satisfaction &
                                in how the work that we do empowers our employees to build rewarding
                                careers.

                                At Hensley Event Resources, we offer our employees a competitive
                                program of benefits & a company culture based on the core values of
                                inspiration, excellence and integrity.
                            </p>
                            <button className="uppercase bg-transparent text-[16px] leading-[20px] text-secondary-alt font-haasRegular mt-[24px]">
                                see More +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CareerOppurtunities