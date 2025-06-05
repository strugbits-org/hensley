"use client"
import { CartNormal } from '@/components/Cart/CartItems';
import { formatDateForQuote, formatTotalPrice } from '@/utils';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useMemo } from 'react';

export const ViewQuoteModal = ({ data, onClose }) => {
    if (!data) return;
    const totalPrice = useMemo(() =>
        data.lineItems.reduce((total, { product }) =>
            total + (product.price?.amount || product.price) * product.quantity, 0
        ), [data.lineItems]
    );

    const formattedTotalPrice = useMemo(() => formatTotalPrice(totalPrice), [totalPrice]);
    const date = useMemo(() => formatDateForQuote(data.eventDate), [data.eventDate]);
    const lineItems = data?.lineItems || [];
    return (
        <Transition appear show={data !== undefined && data !== null} as={Fragment}>
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
                    <div className="fixed inset-0 bg- bg-[#2c221696] bg-opacity-50" />
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
                            <DialogPanel className="transform overflow-hidden text-left align-middle transition-all relative">
                                <div className=' py-[120px] max-w-[1288px] mx-auto'>
                                    <div className='bg-white w-full '>
                                        <div className='heading w-full  flex justify-center items-center flex-col max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                                            <p className='font-haasLight text-base '>{date}</p>
                                            <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[160px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.eventDescriptionPo}</h2>
                                        </div>
                                        <div className='w-full px-6'>
                                            <div className='w-full bg-[#F4F1EC] pt-[18px] pb-[17px]'>
                                                <h4 className='text-center text-[35px] font-recklessRegular leading-[39px]'>
                                                    {formattedTotalPrice}
                                                </h4>
                                            </div>
                                        </div>
                                        {lineItems.map(({ product, size }) => {
                                            const data = product;
                                            return (
                                                <CartNormal key={data._id} data={{ ...data, size }} readOnly={true} />
                                            );
                                        })}
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