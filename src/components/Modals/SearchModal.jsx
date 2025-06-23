import { useEffect, useRef, useState } from 'react';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { usePathname, useSearchParams } from 'next/navigation';
import { PrimaryImage } from '../common/PrimaryImage';

export const SearchModal = ({ closeModal, isActive }) => {
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const redirectWithLoader = useRedirectWithLoader();
    const pathname = usePathname();
    const params = useSearchParams();

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        redirectWithLoader(`/search-results?query=${searchTerm}`);
        closeModal();
    };

    useEffect(() => {
        if (pathname === '/search-results') {
            const term = params.get('query') || '';
            setSearchTerm(term);
        };
    }, [])


    if (!isActive && pathname !== '/search-results') return null;

    return (
        <div className='search-modal z-10'>
            <form
                onSubmit={handleSearch}
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
                    type='submit'
                    onClick={handleSearch}
                    className="w-full bg-secondary-alt text-primary text-[18px] font-haasRegular uppercase py-[17px] mt-3 tracking-[3px] hover:tracking-[6px] transition-all duration-300 ease-in-out"
                    aria-label="Search"
                >
                    SEARCH
                </button>
            </form>

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
                        className="group ml-4 sm:ml-6 bg-secondary-alt size-16 sm:size-20 lg:size-24 outline-none border-0 flex justify-center items-center hover:scale-110 focus:scale-110 transition-all duration-300 ease-in-out"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <PrimaryImage customClasses='group-hover:hidden transition duration-300' url={"https://static.wixstatic.com/shapes/0e0ac5_8e76d2cbe028479b94e053c1631e7ecb.svg"} />
                        <PrimaryImage customClasses='group-hover:block hidden transition duration-300' url={"https://static.wixstatic.com/shapes/0e0ac5_0fa1116dde02428ab409430bcd46815c.svg"} />
                    </button>
                </div>
            </div>
        </div>
    );
};