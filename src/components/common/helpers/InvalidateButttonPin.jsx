"use client";
import { lightboxActions } from '@/store/lightboxStore'
import React from 'react'

export const InvalidateButttonPin = () => {
    const handleClick = () => {
        lightboxActions.showLightBox("invalidate");
    }
    return (
        <button onClick={handleClick} className="min-w-[175px] rotate-90 fixed bottom-36 right-0 border border-secondary-alt bg-primary p-2 hover:bg-secondary-alt text-secondary-alt hover:text-primary z-50 transition-all duration-300 uppercase font-haasMedium tracking-widest hover:tracking-[4px] text-base">
            Invalidate
        </button>
    )
}
