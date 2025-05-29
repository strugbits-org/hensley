"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { storeActions, storeState } from '@/store';
import { ContactFormLightbox } from '@/components/Contact/ContactForm';

export const ModalsWrapper = () => {
    const { lightboxes } = useSnapshot(storeState);
    const { contact } = lightboxes;

    return (
        <>
            <ContactFormLightbox isOpen={contact} onClose={() => storeActions.hideLightBox("contact")} />
        </>
    )
}
