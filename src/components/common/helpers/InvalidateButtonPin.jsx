"use client";
import { checkIsAdmin } from '@/services/auth';
import { lightboxActions } from '@/store/lightboxStore'
import { logError } from '@/utils';
import React, { useEffect, useState, useCallback } from 'react'
import { useCookies } from 'react-cookie';

export const InvalidateButtonPin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [cookies] = useCookies(["authToken"]);

    const checkAdminStatus = useCallback(async () => {
        if (!cookies.authToken) {
            setIsAdmin(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await checkIsAdmin();
            setIsAdmin(response);
        } catch (error) {
            logError(error);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, [cookies.authToken]);

    useEffect(() => {
        const timeoutId = setTimeout(checkAdminStatus, 100);
        return () => clearTimeout(timeoutId);
    }, [cookies.authToken]);

    const handleClick = useCallback(() => {
        lightboxActions.toggleLightBox("invalidate");
    }, []);

    if (!isAdmin || isLoading) {
        return null;
    }

    return (
        <button 
            onClick={handleClick} 
            className="min-w-[175px] rotate-90 fixed bottom-36 -right-10 border border-secondary-alt bg-primary p-2 hover:bg-secondary-alt text-secondary-alt hover:text-primary z-[100] transition-all duration-300 uppercase font-haasMedium tracking-widest hover:tracking-[4px] text-base"
            aria-label="Invalidate"
        >
            Invalidate
        </button>
    );
}