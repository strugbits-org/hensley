"use client";
import useUserData from '@/hooks/useUserData';
import { checkIsAdmin } from '@/services/auth';
import { lightboxActions } from '@/store/lightboxStore'
import { logError } from '@/utils';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

export const InvalidateButttonPin = () => {
    const { memberId } = useUserData();
    const [isAdmin, setIsAdmin] = useState(false);
    const [retryTrigger, setRetryTrigger] = useState(false);
    const [cookies] = useCookies(["authToken"]);
    const setInitialValues = async () => {
        try {
            if (!memberId) {
                setRetryTrigger(true);
                return;
            };
            const response = await checkIsAdmin(memberId);
            setIsAdmin(response);
        } catch (error) {
            logError(error);
        }
    }
    useEffect(() => {
        setTimeout(() => {
            setInitialValues();
        }, 500);
    }, [memberId, retryTrigger, cookies.authToken]);

    const handleClick = () => {
        lightboxActions.toggleLightBox("invalidate");
    }

    if (!isAdmin) return null;
    return (
        <button onClick={handleClick} className="min-w-[175px] rotate-90 fixed bottom-36 -right-10 border border-secondary-alt bg-primary p-2 hover:bg-secondary-alt text-secondary-alt hover:text-primary z-[100] transition-all duration-300 uppercase font-haasMedium tracking-widest hover:tracking-[4px] text-base">
            Invalidate
        </button>
    )
}
