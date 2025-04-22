'use client'

import { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import Image from 'next/image';
import logo from '@/assets/logo-dark.png';
import searchIcon from "@/assets/icons/search.svg";
import userIcon from "@/assets/icons/user.svg";
import cartIcon from "@/assets/icons/cart.svg";
import { CustomLink } from '../common/CustomLink';

const navigation = [
    { name: 'RENTALS', to: '#' },
    { name: 'MARKETS', to: '#' },
    { name: 'ABOUT', to: '#' },
]

const userMenu = [
    { icon: searchIcon, to: '#' },
    { icon: userIcon, to: '#' },
    { icon: cartIcon, to: '#' },
]

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-2 lg:px-6">
                <div className="flex lg:flex-1">
                    <CustomLink to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Hensley Event Resources</span>
                        <Image src={logo} alt="logo" />
                    </CustomLink>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <FaBars aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} to={item.to} className="text-sm/6 font-semibold text-gray-900">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                    {userMenu.map((item, index) => (
                        <CustomLink key={index} to={item.to} className="text-sm/6 font-semibold text-gray-900">
                            <Image src={item.icon} alt="" className="h-6 w-6" />
                        </CustomLink>
                    ))}
                </div>
            </nav>
        </header>
    )
}