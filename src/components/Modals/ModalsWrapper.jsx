"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { BasicLightBox } from './BasicLightBox';
import { ContactFormLightbox } from '../Contact/ContactFormLightbox';
import { AddToCartLightBox } from '../AddToCart/AddToCartLightBox';
import { LoginModal } from './LoginModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const ModalsWrapper = ({ data }) => {
    const { lightboxes, basicLightBoxDetails, addToCartModal } = useSnapshot(lightboxState);
    const { contact, login, forgotPassword } = lightboxes;

    const { branches, contactFormData } = data;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <AddToCartLightBox data={addToCartModal} onClose={() => lightboxActions.resetAddToCartModal()} />
            <ContactFormLightbox locationsData={branches} data={contactFormData} isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <LoginModal isOpen={login} onClose={() => lightboxActions.hideLightBox("login")} />
            <ForgotPasswordModal isOpen={forgotPassword} onClose={() => lightboxActions.hideLightBox("forgotPassword")} />
        </>
    )
}
