'use client'

import Image from 'next/image';
import logo from '@/assets/logo-dark.png';
import searchIcon from '@/assets/icons/search.svg';
import userIcon from '@/assets/icons/user.svg';
import cartIcon from '@/assets/icons/cart.svg';
import { CustomLink } from '../common/CustomLink';
import { useEffect, useState } from 'react';

const userMenu = [
    { icon: searchIcon, to: '#' },
    { icon: userIcon, to: '#' },
    { icon: cartIcon, to: '#', count: 0 },
];

const navigation = [
    {
        name: 'RENTALS',
        subMenu: [
            { name: 'TENTS', to: '#' },
            { name: 'TABLETOP', to: '#' },
            { name: 'FURNISHINGS', to: '#' },
            { name: 'CATERING', to: '#' },
            { name: 'PAVILIONS', to: '#' },
            { name: 'ADDITIONAL PRODUCTS', to: '#' },
        ],
    },
    {
        name: 'MARKETS',
        subMenu: [
            { name: 'SOCIAL', to: '#' },
            { name: 'NONPROFIT', to: '#' },
            { name: 'CORPORATE', to: '#' },
        ],
    },
    {
        name: 'ABOUT',
        subMenu: [
            { name: 'ABOUT US', to: '#' },
            { name: 'PROJECTS', to: '#' },
            { name: 'BLOG', to: '#' },
            { name: 'CONTACT', to: '#' },
            { name: 'CAREERS', to: '#' },
        ],
    },
];

export const Header = () => {
    const [activeMenu, setActiveMenu] = useState(navigation[0].name);
    const [subNavigation, setSubNavigation] = useState(navigation[0].subMenu);

    useEffect(() => {
        const currentMenu = navigation.find(item => item.name === activeMenu);
        if (currentMenu) setSubNavigation(currentMenu.subMenu);
    }, [activeMenu]);

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="h-12 relative">
                <div className="absolute inset-0 -z-10 bg-[rgba(244,241,236,0.22)] shadow-lg backdrop-blur-xl brightness-30"></div>
                <nav className="h-full flex items-center justify-between" aria-label="Main Navigation">
                    <div className="flex p-2 lg:px-6">
                        <CustomLink to="/">
                            <span className="sr-only">Hensley Event Resources</span>
                            <Image src={logo} alt="Hensley Event Resources Logo" />
                        </CustomLink>
                    </div>
                    <ul className="hidden lg:flex h-full items-center justify-center gap-x-24">
                        {navigation.map(({ name }) => (
                            <li className='h-full' key={name}>
                                <button
                                    key={name}
                                    onClick={() => setActiveMenu(name)}
                                    className="h-full group relative min-w-64 text-secondary-alt text-xs font-haasMedium tracking-normal hover:tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out"
                                >
                                    {name}
                                    <span className={`absolute bottom-[0.5px] left-0 h-0.5 bg-secondary-alt transition-all duration-300 ease-in-out ${activeMenu === name ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                    ></span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-2 lg:px-6 grid grid-cols-4 gap-x-4 items-center">
                        {userMenu.map(({ icon, to, count }, index) => (
                            <CustomLink key={index} to={to} className="relative">
                                <Image src={icon} alt="" />
                                {count ? (
                                    <span className="absolute -top-2 left-8 inline-flex items-center justify-center px-1 text-xs text-secondary-alt bg-primary rounded-full font-semibold">
                                        {count}
                                    </span>
                                ) : count === 0 ? (
                                    <span className="absolute -top-2 left-8 inline-flex items-center justify-center px-1 text-xs text-secondary-alt bg-primary rounded-full font-semibold">
                                        0
                                    </span>
                                ) : null}
                            </CustomLink>
                        ))}
                    </div>
                </nav>
            </div>
            <div className="h-12 relative">
                <div className="absolute inset-0 -z-10 bg-[rgba(240,222,162,0.65)] shadow-md backdrop-blur-lg brightness-30"></div>
                <nav
                    className="h-full p-2 lg:px-6 grid items-center max-w-7xl mx-auto"
                    style={{ gridTemplateColumns: `repeat(${subNavigation.length}, minmax(0, 1fr))` }}
                >
                    {subNavigation.map(({ name, to }) => (
                        <CustomLink
                            key={name}
                            to={to}
                            className="text-secondary-alt text-xs font-haasRegular tracking-normal hover:tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out text-center"
                        >
                            {name}
                        </CustomLink>
                    ))}
                </nav>
            </div>
        </header>
    );
};