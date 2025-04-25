import searchIcon from '@/assets/icons/search-light.svg';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export const SearchModal = ({ closeModal, isActive }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    if (!isActive) return null;

    return (
        <div
            className="relative px-6 w-full lg:h-32 bg-primary flex flex-col sm:flex-row items-center border-b-2 border-secondary-alt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
        >
            <label
                id="search-modal-title"
                htmlFor="search-input"
                className="w-full sm:w-1/4 py-3 sm:py-0 text-secondary-alt font-recklessLight font-medium text-2xl sm:text-3xl lg:text-4xl uppercase sm:border-r border-secondary-alt"
            >
                Enter your search
            </label>
            <div className="w-full sm:w-3/4 h-full flex items-center sm:pl-6">
                <input
                    id="search-input"
                    ref={inputRef}
                    type="text"
                    className="bg-transparent grow h-full block outline-none border-0 font-recklessLight font-medium text-2xl sm:text-3xl lg:text-4xl uppercase text-secondary-alt appearance-none"
                    onKeyDown={handleKeyDown}
                    aria-label="Search input"
                />
                <button
                    className="ml-4 sm:ml-6 bg-secondary-alt size-16 sm:size-20 lg:size-24 outline-none border-0 flex justify-center items-center hover:scale-110 focus:scale-110 transition-all duration-300 ease-in-out"
                    onClick={() => {/* Handle search */ }}
                    aria-label="Search"
                >
                    <Image
                        src={searchIcon}
                        className="w-6 sm:w-8 lg:w-10"
                        alt=""
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    );
};