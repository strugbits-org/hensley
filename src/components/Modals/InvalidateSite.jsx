"use client";
import { invalidateLayout, invalidatePath } from '@/services/invalidation';
import { logError } from '@/utils';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

const Button = ({ text, classes, onClick, disabled }) => {
    return (
        <button onClick={onClick} className={`w-full bg-primary group hover:tracking-[1px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative ${classes} ${disabled ? 'pointer-events-none opacity-50' : ''} `}>
            <span className='font-haasBold uppercase text-[13px]'>{text}</span>
        </button>
    )
};

const InvalidateSite = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState({
        layout: false,
        current: false
    });
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleInvalidate = async (type) => {
        try {
            setLoading(loading => ({ ...loading, [type]: true }));
            let res;
            if (type === 'layout') {
                res = await invalidateLayout();
            } else if (type === 'current') {
                res = await invalidatePath(pathname);
            }
            if (res) {
                setFeedbackMessage(type ? 'Layout invalidated, Refreshing...' : 'Site invalidated, Refreshing...');
            }
            setTimeout(() => {
                window.location.reload();
                setLoading({
                    current: false,
                    layout: false
                });
            }, 2000);
        } catch (error) {
            logError("Error invalidating site", error);
            setFeedbackMessage(type ? 'Error invalidating layout' : 'Error invalidating site');
            setLoading({
                current: false,
                layout: false
            });
        }
    }

    return (
        <div className='px-[20px] mx-[20px] py-[20px] w-full sm:max-w-[300px] gap-y-[20px] bg-primary-alt flex flex-col justify-center items-center'>
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0 -0.002 184.096 29.081" viewBox="0 -0.002 184.096 29.081" height="29.078" width="184.094" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                <g>
                    <path fill="#2c2216" d="M4.661 16.528h1.446v8.67H4.661ZM22.24 3.879h1.446v8.685H22.24ZM17.578-.002 18.8 3.845v8.72H4.661V4.047h1.451v7.277h3.435V4.046l1.221-4.048H0l1.227 4.03v21.17L0 29.079h10.768l-1.226-3.846v-8.705h14.143v8.5h-1.45v-7.249H18.8v7.253l-1.222 4.047h10.769L27.12 25.05V3.879l1.227-3.881Z" data-color="1"></path>
                    <path fill="#2c2216" d="M41.744 21.935V6.71l-.613-3.1h5.484l-.613 3.1v5.9h10.225v-5.9l-.613-3.1h5.451l-.581 3.1v15.225l.581 3.1h-5.451l.613-3.1v-6.226H46.004v6.226l.613 3.1h-5.484Z" data-color="1"></path>
                    <path fill="#2c2216" d="m81.484 21.29-.581 3.742H64.195l.613-3.1V6.71l-.613-3.1h16.483l.581 3.742-3.1-.774h-9.128v6.063h6.645l2.355-.387v3.677l-2.355-.387h-6.645v6.516h9.354Z" data-color="1"></path>
                    <path fill="#2c2216" d="m104.16 3.613-.613 3.1v18.318h-5.935L87.968 7.355v14.58l.58 3.1h-4.774l.613-3.1V6.71l-.613-3.1h6.616l9.58 17.58V6.71l-.581-3.1Z" data-color="1"></path>
                    <path fill="#2c2216" d="m107.419 24.418-.677-4.484 3.742 2.064a16.616 16.616 0 0 0 4.709.742c3.1 0 4.645-1.161 4.645-3.032s-1.194-2.806-5.322-3.9c-5.387-1.419-7.612-3.258-7.612-6.774s2.871-5.967 8.516-5.967a27.637 27.637 0 0 1 7.419 1.032l.645 4.29-3.645-1.871a14.618 14.618 0 0 0-4.1-.581c-2.742 0-4.483 1.064-4.483 2.742s.968 2.677 5.1 3.774c5.548 1.452 7.838 3.322 7.838 6.838 0 3.806-3.1 6.322-8.774 6.322a32.307 32.307 0 0 1-8-1.193" data-color="1"></path>
                    <path fill="#2c2216" d="m142.674 21.193-.581 3.839h-15.192l.613-3.1V6.71l-.613-3.1h5.484l-.613 3.1v15.257h7.774Z" data-color="1"></path>
                    <path fill="#2c2216" d="m161.868 21.29-.581 3.742h-16.709l.613-3.1V6.71l-.613-3.1h16.483l.581 3.742-3.1-.774h-9.129v6.063h6.645l2.355-.387v3.677l-2.355-.387h-6.645v6.516h9.354Z" data-color="1"></path>
                    <path fill="#2c2216" d="m175.352 21.935.613 3.1h-5.451l.613-3.1v-4.806l-8.806-13.515h6.129l.742 3.129 4.419 7.354L178 6.741l.774-3.129h5.322l-8.741 13.548Z" data-color="1"></path>
                </g>
            </svg>
            <span className='font-haasRegular uppercase text-secondary-alt text-[12px] text-center'>
                Would you like to invalidate the current path?
            </span>
            <span className='font-haasRegular uppercase text-secondary-alt text-[14px] text-center'>
                CURRENT PATH: [{pathname}]
            </span>
            {!feedbackMessage ? (
                <div className='flex flex-col gap-y-[10px] w-full'>
                    <Button onClick={() => { handleInvalidate("current") }} text={loading.current ? "invalidating..." : "invalidate current page"} classes={"lg:!w-full !h-[40px]"} />
                    <Button onClick={() => { handleInvalidate("layout") }} text={loading.layout ? "invalidating..." : "invalidate complete site"} classes={"lg:!w-full !h-[40px]"} />
                </div>
            ) : (
                <div className='flex flex-col gap-y-[10px] w-full'>
                    <span className='font-haasMedium uppercase text-secondary-alt text-base text-center'>{feedbackMessage}</span>
                </div>
            )}
        </div>
    )
}

export default InvalidateSite;