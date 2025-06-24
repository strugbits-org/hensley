"use client"
import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import AddToCart from '../Modals/AddToCart/AddToCart';
import AddToCartTent from '../Modals/AddToCart/AddToCartTent';

export const AddToCartLightBox = ({ data, onClose }) => {
    const { open, type } = data;

    return (
        <Transition appear show={open} as={Fragment}>
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
                    <div className="fixed inset-0 bg-[#2c2216a6] bg-opacity-50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto !px-[30px]">
                    <div className="flex items-center justify-center h-full">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="transform sm:!px-[20px] overflow-hidden text-left align-middle transition-all relative flex justify-center items-center">
                                {type === 'tent' ? <AddToCartTent data={data} onClose={onClose} /> : <AddToCart data={data} onClose={onClose} />}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
