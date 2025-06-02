"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { ContactFormLightbox } from '@/components/Contact/ContactFormLightbox';
import AddToCart from '@/components/Modals/AddToCart/AddToCart';
import { AddToCartLightBox } from '@/components/AddToCart/AddToCartLightBox';

export const ModalsWrapper = () => {
    const { lightboxes } = useSnapshot(lightboxState);
    const { contact, addToCart } = lightboxes;

    return (
        <>
            <ContactFormLightbox isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <AddToCartLightBox isOpen={addToCart} onClose={() => lightboxActions.hideLightBox("addToCart")} />
        </>
    )
}
