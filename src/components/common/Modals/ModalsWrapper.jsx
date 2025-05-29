"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { ContactFormLightbox } from '@/components/Contact/ContactFormLightbox';

export const ModalsWrapper = () => {
    const { lightboxes } = useSnapshot(lightboxState);
    const { contact } = lightboxes;

    return (
        <>
            <ContactFormLightbox isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
        </>
    )
}
