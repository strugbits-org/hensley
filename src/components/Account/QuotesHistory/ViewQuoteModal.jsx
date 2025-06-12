"use client"
import { CartCollection, CartNormal, CartTent } from '@/components/Cart/CartItems';
import { calculateCartTotalPrice, formatDateForQuote, formatDescriptionLines, formatTotalPrice } from '@/utils';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useMemo } from 'react';

export const ViewQuoteModal = ({ data, onClose }) => {
    if (!data) return null;
    const totalPrice = useMemo(() => calculateCartTotalPrice(data.lineItems.map(item => item.product)));

    const formattedTotalPrice = useMemo(() => formatTotalPrice(totalPrice), [totalPrice]);
    const date = useMemo(() => formatDateForQuote(data.eventDate), [data.eventDate]);
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
                    <div className="flex items-center justify-center  ">
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
                                <div className='h-screen max-w-[1288px] flex justify-center items-center mx-auto '>
                                    <div >
                                        <div className='bg-white w-full flex flex-col gap-y-[20px] py-[30px] px-[24px] h-[800px] overflow-y-scroll hide-scrollbar'>
                                            <div className='heading w-full  flex justify-center items-center flex-col max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                                                <p className='font-haasLight text-base uppercase'>{date}</p>
                                                <h2 className='uppercase text-[140px] text-secondary-alt font-recklessRegular text-center w-full leading-[120px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.eventDescriptionPo}</h2>
                                            </div>
                                            <div className='w-full '>
                                                <div className='w-full bg-[#F4F1EC] pt-[18px] pb-[17px]'>
                                                    <h4 className='text-center text-[35px] font-recklessRegular leading-[39px]'>
                                                        {formattedTotalPrice}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className=''>
                                                {/* {lineItems.map(({ product, size }) => {
                                                    const data = product;
                                                    return (
                                                        <CartNormal key={data._id || data.id} data={{ ...data, size }} readOnly={true} showAddToCart={true} />
                                                    );
                                                })} */}
                                                {data.lineItems.map((item, index) => {
                                                    const product = item.product;
                                                    const descriptionLines = product.descriptionLines ? formatDescriptionLines(product.descriptionLines) : product.customTextFields;
                                                    const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
                                                    const isTentItem = false;

                                                    if (productCollection) {
                                                        const productSetItems = productCollection.split("; ");
                                                        const lineItemData = { ...product, productSetItems };
                                                        return (
                                                            <CartCollection key={index} data={lineItemData} readOnly={true} showAddToCart={true} />
                                                        )
                                                    } else if (isTentItem) {
                                                        return (
                                                            <CartTent key={index} data={product} readOnly={true} />
                                                        )
                                                    } else {
                                                        return (
                                                            <CartNormal key={index} data={product} readOnly={true} showAddToCart={true} />
                                                        )
                                                    };
                                                })}
                                            </div>
                                        </div>
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