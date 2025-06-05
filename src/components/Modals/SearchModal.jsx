import searchIcon from '@/assets/icons/search-light.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loaderActions } from '@/store/loaderStore';

export const SearchModal = ({ closeModal, isActive }) => {
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

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

    const handleSearch = () => {
        loaderActions.show();
        router.push(`/search?query=${searchTerm}`);
    };

    if (!isActive) return null;


    return (
        <div className='search-modal z-10'>
            <div
                className="lg:hidden flex flex-col items-center justify-start pb-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-search-modal-title"
            >
                <div className='h-[5.375rem] bg-primary-alt'></div>

                <div className='w-full bg-primary'>

                    <input
                        id="mobile-search-input"
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-b-2 bg-transparent border-secondary-alt grow block outline-none border-0 font-recklessRegular text-[25px] uppercase text-secondary-alt appearance-none py-10 px-6 placeholder:text-secondary-alt text-center placeholder:font-recklessRegular placeholder:text-[25px]"
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your search"
                        aria-label="Search input"
                    />

                </div>

                <button
                    onClick={handleSearch}
                    className="w-full bg-secondary-alt text-primary text-[18px] font-haasRegular uppercase py-[17px] mt-3 tracking-[3px] hover:tracking-[6px] transition-all duration-300 ease-in-out"
                    aria-label="Search"
                >
                    SEARCH
                </button>
            </div>

            <div
                className="relative px-6 w-full lg:h-32 bg-primary hidden lg:flex flex-col sm:flex-row items-center border-b-2 border-secondary-alt"
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-modal-title"
            >
                <label
                    id="search-modal-title"
                    htmlFor="search-input"
                    className="w-full sm:w-1/4 py-3 sm:py-0 text-secondary-alt font-recklessLight text-2xl sm:text-3xl lg:text-4xl uppercase sm:border-r border-secondary-alt"
                >
                    Enter your search
                </label>
                <div className="w-full sm:w-3/4 h-full flex items-center sm:pl-6">
                    <input
                        id="search-input"
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent grow h-full block outline-none border-0 font-recklessLight text-2xl sm:text-3xl lg:text-4xl uppercase text-secondary-alt appearance-none"
                        onKeyDown={handleKeyDown}
                        aria-label="Search input"
                    />
                    <button
                        className="ml-4 sm:ml-6 bg-secondary-alt size-16 sm:size-20 lg:size-24 outline-none border-0 flex justify-center items-center hover:scale-110 focus:scale-110 transition-all duration-300 ease-in-out"
                        onClick={handleSearch}
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
        </div>
    );
};