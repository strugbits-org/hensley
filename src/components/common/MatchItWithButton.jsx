"use client";
import useUserData from '@/hooks/useUserData';
import { checkIsAdmin } from '@/services/auth';
import { lightboxActions } from '@/store/lightboxStore'
import { logError } from '@/utils';
import React, { useEffect, useState, useCallback } from 'react'
import { useCookies } from 'react-cookie';

export const MatchItWithButton = ({ product }) => {
    const { memberId } = useUserData();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cookies] = useCookies(["authToken"]);

    const checkAdminStatus = useCallback(async () => {
        if (!memberId || !cookies.authToken) {
            setIsAdmin(false);
            return;
        }

        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await checkIsAdmin(memberId);
            setIsAdmin(response);
        } catch (error) {
            logError(error);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, [memberId, cookies.authToken]);

    useEffect(() => {
        const timeoutId = setTimeout(checkAdminStatus, 100);
        return () => clearTimeout(timeoutId);
    }, [memberId, cookies.authToken]);

    const handleClick = () => {
        lightboxActions.setMatchProductsLightBoxDetails({ open: true, productData: product });
    };

    if (!isAdmin || isLoading || !memberId || !cookies.authToken) {
        return null;
    }

    return (
        <div className="match-it-with-button w-full flex justify-end py-2">
            <button onClick={handleClick} className="uppercase bg-primary px-6 py-3 rounded-full font-haasLight text-sm tracking-widest hover:bg-secondary-alt hover:text-primary transition duration-300">Match it with</button>
        </div>
    );
}