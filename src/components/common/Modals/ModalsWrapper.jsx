"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { ContactFormLightbox } from '@/components/Contact/ContactFormLightbox';
import AddToCart from '@/components/Modals/AddToCart/AddToCart';
import { BasicLightBox } from './BasicLightBox';

export const ModalsWrapper = () => {
    const { lightboxes, basicLightBoxDetails } = useSnapshot(lightboxState);
    const { contact, addToCart } = lightboxes;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <ContactFormLightbox isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <AddToCart isOpen={addToCart} onClose={() => lightboxActions.hideLightBox("addToCart")} />
        </>
    )
}
