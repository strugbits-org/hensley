"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { storeActions, storeState } from '@/store';
import { ContactFormLightbox } from '@/components/Contact/ContactForm';

export const ModalsWrapper = () => {
    const { contactForm } = useSnapshot(storeState);
    console.log("contactForm", contactForm);

    return (
        <>
            <ContactFormLightbox isOpen={contactForm} onClose={storeActions.hideContactForm} />
        </>
    )
}
