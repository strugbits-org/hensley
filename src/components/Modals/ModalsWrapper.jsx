"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { BasicLightBox } from './BasicLightBox';
import { ContactFormLightbox } from '../Contact/ContactFormLightbox';
import { AddToCartLightBox } from '../AddToCart/AddToCartLightBox';

export const ModalsWrapper = () => {
    const { lightboxes, basicLightBoxDetails } = useSnapshot(lightboxState);
    const { contact, addToCart } = lightboxes;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <ContactFormLightbox isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <AddToCartLightBox isOpen={addToCart} onClose={() => lightboxActions.hideLightBox("addToCart")} />
        </>
    )
}
