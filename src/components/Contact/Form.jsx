"use client"
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ContactUs from '../Modals/ContactUs';

const LightboxForm = ({ isOpen, onClose }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel onClick={onClose} className="w-full transform overflow-hidden bg-[#2c2216a6]  text-left align-middle shadow-xl transition-all relative">
                                <ContactUs />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

const Form = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop: show button */}
            <div className="hidden lg:flex justify-center items-center py-[80px]">
                <button
                    className="bg-primary text-white px-6 py-4 rounded-lg font-bold hover:bg-primary-dark transition"
                    onClick={() => setIsOpen(true)}
                >
                    Open Contact Form
                </button>
            </div>

            {/* Mobile: show full form inline */}
            <div className="bg-secondary-alt w-full flex justify-center items-center lg:hidden">
                <form className='w-full bg-primary-alt px-[36px] sm:px-[12px] pt-[50px] pb-[55px]'>
                    {/* ... Your existing form stays untouched here ... */}
                    <div className='w-full flex flex-col sm:flex-row justify-between gap-y-[31px] gap-x-[12px]'>
                        <h3 className='w-full text-secondary-alt uppercase font-recklessRegular text-[45px] leading-[40px]'>
                            send your <br /> message
                        </h3>
                        <div className='w-full flex lg:gap-x-[31px] sm:gap-x-[63px] justify-between sm:justify-start '>
                            <div className='font-haasRegular text-[14px] leading-[18px]'>
                                <p><b>San Francisco/</b></p>
                                <p><b>Monterey</b></p>
                                <p>Bay area</p>
                                <p>180 Whill Place</p>
                                <p>BRISBANE, CA 94005</p>
                                <p>650.692.7007</p>
                            </div>
                            <div className='font-haasRegular text-[14px] leading-[18px]'>
                                <p><b>North Bay</b></p>
                                <p><b>(By Appointment)</b></p>
                                <p>ST HELENA, CA 94574</p>
                                <p>650.692.7007</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full grid sm:grid-cols-2 grid-cols-1 sm:pt-[77px] pt-[34px] sm:gap-x-[24px] sm:gap-y-[31px] gap-y-[32px]">
                        <div className='gap-y-[8px] flex flex-col'>
                            <label htmlFor="firstName" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">First Name</label>
                            <input type="text" id="firstName" className='w-full placeholder-secondary-alt border-b border-secondary-alt px-[24px] py-[20px] h-[60px]' placeholder='Name' />
                        </div>
                        <div className='gap-y-[8px] flex flex-col'>
                            <label htmlFor="lastName" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">Last Name</label>
                            <input type="text" id="lastName" className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]' placeholder='Name' />
                        </div>
                        <div className='gap-y-[8px] flex flex-col'>
                            <label htmlFor="phone" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">Phone</label>
                            <input type="text" id="phone" className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]' placeholder='Phone number' />
                        </div>
                        <div className='gap-y-[8px] flex flex-col'>
                            <label htmlFor="email" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">Email</label>
                            <input type="text" id="email" className='w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px] h-[60px]' placeholder='Email address' />
                        </div>
                        <div className="sm:col-span-2 gap-y-[8px] flex flex-col">
                            <label htmlFor="message" className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">Mensagam</label>
                            <textarea id="message" rows={4} className="w-full placeholder-secondary-alt border-b border-black px-[24px] py-[20px]" placeholder="Type your message here..."></textarea>
                        </div>
                        <button className='relative bg-primary h-[90px] w-full group'>
                            <span className='block font-haasLight uppercase text-[16px] tracking-[4px]'>send message</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.877" height="19.67" viewBox="0 0 19.877 19.67" className='ml-2 transition-all duration-300 stroke-[#2c2216] absolute right-[5%] top-1/2 -translate-y-1/2'>
                                <g transform="translate(9.835 0.5) rotate(45)">
                                    <path d="M0,0H13.2V13.2" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                                    <line x1="13.202" y2="13.202" fill="none" strokeMiterlimit="10" strokeWidth="1" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* Lightbox Dialog */}
            <LightboxForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default Form;
