"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { BasicLightBox } from './BasicLightBox';
import { ContactFormLightbox } from '../Contact/ContactFormLightbox';
import { AddToCartLightBox } from '../AddToCart/AddToCartLightBox';
import { LoginModal } from './LoginModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const ModalsWrapper = () => {
    const { lightboxes, basicLightBoxDetails, addToCartModal } = useSnapshot(lightboxState);
    const { contact, login, forgotPassword } = lightboxes;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <AddToCartLightBox data={addToCartModal} onClose={() => lightboxActions.resetAddToCartModal()} />
            <ContactFormLightbox isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <LoginModal isOpen={login} onClose={() => lightboxActions.hideLightBox("login")} />
            <ForgotPasswordModal isOpen={forgotPassword} onClose={() => lightboxActions.hideLightBox("forgotPassword")} />
        </>
    )
}
