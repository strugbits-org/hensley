"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { BasicLightBox } from './BasicLightBox';
import { ContactFormLightbox } from '../Contact/ContactFormLightbox';
import { AddToCartLightBox } from '../AddToCart/AddToCartLightBox';
import { LoginModal } from './LoginModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { InvalidateLightBox } from '../Invalidate/InvalidateLightBox';

export const ModalsWrapper = ({ data }) => {
    const { lightboxes, basicLightBoxDetails, addToCartModal } = useSnapshot(lightboxState);
    const { contact, login, forgotPassword, invalidate } = lightboxes;
    const { branches, contactFormData, loginPageDetails, allCollections = [] } = data;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <AddToCartLightBox data={addToCartModal} onClose={() => lightboxActions.resetAddToCartModal()} allCollections={allCollections} />
            <ContactFormLightbox locationsData={branches} data={contactFormData} isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <LoginModal data={loginPageDetails} isOpen={login} onClose={() => lightboxActions.hideLightBox("login")} />
            <ForgotPasswordModal isOpen={forgotPassword} onClose={() => lightboxActions.hideLightBox("forgotPassword")} />
            <InvalidateLightBox isOpen={invalidate} onClose={() => lightboxActions.hideLightBox("invalidate")}/>
        </>
    )
}
