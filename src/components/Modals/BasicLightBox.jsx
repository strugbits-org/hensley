"use client"
import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { PrimaryButton } from '../common/PrimaryButton';
import { CustomLink } from '../common/CustomLink';

export const BasicLightBox = ({ data, onClose }) => {
    const { title, description, buttonText, buttonLink, open, disableClose, secondaryButtonText, secondaryButtonLink, onSecondaryClick } = data;

    const handleSecondaryClick = () => {
        if (typeof onSecondaryClick === 'function') onSecondaryClick();
        onClose();
    };

    return (
        <Transition appear show={open && title !== ''} as={Fragment}>
            <Dialog as="div" className="relative z-[9999999999]" onClose={disableClose ? () => { } : onClose}>
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
                            <DialogPanel className="transform text-left align-middle transition-all relative flex justify-center items-center">
                                <div className={`w-full flex flex-col items-center gap-y-8 bg-primary-alt p-8 lg:py-[60px] z-[9999] relative lg:w-[762px]`}>
                                    <h2 className='text-center text-[30px] leading-[42px] lg:text-[40px] lg:leading-[42px] uppercase tracking-wider text-secondary-alt font-recklessRegular'>{title}</h2>
                                    <p className='text-center text-[20px] text-secondary-alt font-haasRegular max-w-lg mx-auto'>{description}</p>
                                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
                                        <CustomLink to={buttonLink} onClick={onClose}>
                                            <PrimaryButton className="bg-primary hover:bg-secondary-alt hover:text-primary max-h-[60px] max-w-[240px] px-8 py-4 hover:[letter-spacing:4px]">{buttonText}</PrimaryButton>
                                        </CustomLink>
                                        {secondaryButtonText && (
                                            secondaryButtonLink ? (
                                                <CustomLink to={secondaryButtonLink} onClick={handleSecondaryClick}>
                                                    <PrimaryButton className="bg-transparent border border-secondary-alt text-secondary-alt hover:bg-secondary-alt hover:text-primary-alt max-h-[60px] max-w-[240px] px-8 py-4 hover:[letter-spacing:4px]">{secondaryButtonText}</PrimaryButton>
                                                </CustomLink>
                                            ) : (
                                                <PrimaryButton onClick={handleSecondaryClick} className="bg-transparent border border-secondary-alt text-secondary-alt hover:bg-secondary-alt hover:text-primary-alt max-h-[60px] max-w-[240px] px-8 py-4 hover:[letter-spacing:4px]">{secondaryButtonText}</PrimaryButton>
                                            )
                                        )}
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