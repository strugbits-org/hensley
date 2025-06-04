"use client"
import { CartCollection, CartNormal, CartTent } from '@/components/Cart/CartItems';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

const LightboxForm = ({ isOpen, onClose }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center ">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel onClick={onClose} className="w-full transform overflow-hidden bg-[#2c221696] text-left align-middle shadow-xl transition-all relative">
                                <div className=' py-[120px] max-w-[1288px] mx-auto'>
                                    <div className='bg-white w-full '>
                                        <div className='heading w-full  flex justify-center items-center flex-col max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                                            <p className='font-haasLight text-base '>February, 09h, 2024</p>
                                            <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[160px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>ANNA & JOHN</h2>
                                        </div>
                                        <div className='w-full px-6'>
                                        <div className='w-full bg-[#F4F1EC] pt-[18px] pb-[17px]'>
                                            <h4 className='text-center text-[35px] font-recklessRegular leading-[39px]'>
                                            U$ 45.000
                                            </h4>
                                        </div>
                                        </div>
                                        <CartTent />
                                        <CartCollection />
                                        <CartNormal />
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default LightboxForm