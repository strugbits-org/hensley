'use client'

import Image from 'next/image';
import logo from '@/assets/logo-dark.png';
import icon from '@/assets/icon-dark.svg';
import searchIcon from '@/assets/icons/search.svg';
import userIcon from '@/assets/icons/user.svg';
import cartIcon from '@/assets/icons/cart.svg';
import { CustomLink } from '../common/CustomLink';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SubCategoriesModal } from '../Modals/SubCategoriesModal';
import { MarketTentModal } from '../Modals/MarketTentModal';
import { SearchModal } from '../Modals/SearchModal';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import { calculateTotalCartQuantity, sortByOrderNumber } from '@/utils';
import { lightboxActions } from '@/store/lightboxStore';
import { getProductsCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';

const userMenu = [
    { icon: searchIcon, type: 'search' },
    { icon: userIcon, slug: '/account', type: 'account' },
    { icon: cartIcon, slug: '/cart', type: 'cart' },
];

export const Header = ({ data, marketsData, tentsData }) => {
    const [cookies, setCookie, removeCookie] = useCookies(["cartQuantity"]);

    const [activeMenu, setActiveMenu] = useState("RENTALS");
    const [subNavigation, setSubNavigation] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartTotalQuantity, setCartTotalQuantity] = useState(typeof window !== 'undefined' && localStorage?.getItem('cartQuantity') || "0");
    const pathname = usePathname();
    const router = useRouter();

    const { header, headerSubMenu, headerMegaMenu } = data;
    const redirectWithLoader = useRedirectWithLoader();

    useEffect(() => {
        const quantity = cookies?.cartQuantity !== undefined ? String(cookies.cartQuantity) : "0";
        setCartTotalQuantity(quantity);
    }, [cookies.cartQuantity]);

    const handleClickUserMenu = (item) => {
        if (item.type === 'search') {
            setSearchModal(prev => {
                if (!prev) {
                    setSelectedMenu(false);
                }
                return !prev;
            });
        } else {
            redirectWithLoader(item.slug);
        }
    }

    const handleMainMenuClick = (item) => {
        setSelectedMenu(false);
        setSearchModal(false);
        setActiveMenu(false);
        setTimeout(() => {
            setActiveMenu(item.title);
        }, 50);
    }

    const handleSubMenuClick = (item, isMobile = false) => {
        setSearchModal(false);
        const currentSubMenu = headerMegaMenu.filter(x => x.HeaderSubMenu_categories.some(y => y._id === item._id));
        const newMenu = {
            title: item.title,
            type: item.type,
            data: item.type !== 'tents' ? sortByOrderNumber(currentSubMenu) : sortByOrderNumber(tentsData)
        };

        if (selectedMenu) {
            setSelectedMenu(false);
            setTimeout(() => {
                setSelectedMenu(newMenu);
            }, 50);
        } else {
            setSelectedMenu(newMenu);
        }

        if (item.type === "slug" || (item?.useSlugForMobile && isMobile)) {
            redirectWithLoader(item.slug);
            toggleMobileMenu();
        } else if (item.type === "lightbox") {
            lightboxActions.showLightBox(item.lightbox);
        }
    }

    const toggleMobileMenu = () => {
        setSearchModal(false);
        setSelectedMenu(false);
        document.body.classList.toggle('overflow-hidden');
        setIsMobileMenuOpen(prev => !prev);
    }

    useEffect(() => {
        if (activeMenu === 'MARKETS') {
            const marketsNavigation = marketsData.map(item => ({
                ...item,
                slug: `/market${item.slug}`,
                type: 'slug'
            }));
            setSubNavigation(sortByOrderNumber(marketsNavigation) || []);
            setSelectedMenu({
                title: 'MARKETS',
                type: 'markets',
                data: sortByOrderNumber(marketsData)
            });
        } else {
            const currentMenu = header.find(item => item.title === activeMenu);
            const currentSubMenu = headerSubMenu.filter(item => item.Header_menuItems.some(subItem => subItem._id === currentMenu?._id));
            if (currentMenu) setSubNavigation(sortByOrderNumber(currentSubMenu));
        }
    }, [activeMenu]);

    const closeAllModals = () => {
        setSearchModal(false);
        setSelectedMenu(false);
        setIsMobileMenuOpen(false);
    }

    const fetchCartItems = async () => {
        try {
            const response = await getProductsCart();
            if (response === "Token has expired") {
                removeCookie("authToken", { path: "/" });
                removeCookie("cartQuantity", { path: "/" });
                setTimeout(() => {
                    router.push("/");
                }, 500);
                return;
            }
            const total = response ? calculateTotalCartQuantity(response) : "0";
            if (total !== cookies.cartQuantity) {
                setCookie("cartQuantity", total, { path: "/" });
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <header>
                <div className='hidden lg:block fixed inset-x-0 top-0 z-50 desktop-menu'>
                    <div className="h-[45px] relative">
                        <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px]"></div>
                        <nav className="h-full flex items-center justify-between" aria-label="Main Navigation">
                            {/* Logo */}
                            <div className="flex p-2 lg:px-6">
                                <CustomLink to="/" onClick={closeAllModals}>
                                    <span className="sr-only">Hensley Event Resources</span>
                                    <Image src={logo} className='min-w-[184px]' alt="Hensley Event Resources Logo" />
                                </CustomLink>
                            </div>

                            {/* Main Navigation */}
                            <ul className="flex h-full grow items-center justify-center gap-x-24">
                                {header.map((item) => {
                                    const { title } = item;
                                    const isActive = activeMenu === title;

                                    return (
                                        <li key={title} className="h-full w-1/3 flex justify-center items-center relative group max-w-[288px]">
                                            <button
                                                onClick={() => handleMainMenuClick(item)}
                                                className={`uppercase h-full w-full text-secondary-alt text-xs font-haasBold tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out ${isActive ? "" : "hover:tracking-[4px]"}`}
                                            >
                                                {title}
                                            </button>
                                            <span
                                                className={`absolute bottom-[0.5px] left-0 h-0.5 bg-secondary-alt transition-all duration-300 ease-in-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                            ></span>
                                        </li>
                                    )
                                })}
                            </ul>

                            {/* User Menu */}
                            <div className="p-2 lg:px-12 py-0.5 flex gap-x-4">
                                {userMenu.map((item, index) => {
                                    const { icon, type } = item;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleClickUserMenu(item)}
                                            className="relative h-10 w-10 flex justify-center items-center"
                                        >
                                            <Image height={"20"} src={icon} alt={item.type} />
                                            {type === 'cart' && (
                                                <span className="absolute top-0 font-haasRegular left-9 min-w-[32px] inline-flex items-center justify-center px-1.5 text-[13px] text-secondary-alt bg-primary rounded-full">
                                                    {cartTotalQuantity}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </nav>
                    </div>

                    {/* Sub Navigation */}
                    <div className="h-[45px] relative">
                        <div className="absolute inset-0 -z-10 bg-primary-glass backdrop-blur-[10px] brightness-[30px]"></div>
                        <nav
                            className="h-full px-2 lg:px-6 grid items-center max-w-7xl mx-auto"
                            style={{ gridTemplateColumns: `repeat(${subNavigation.length || 1}, minmax(0, 1fr))` }}
                        >
                            {subNavigation.map((item) => {
                                const { title } = item;
                                const isActive = selectedMenu?.title === title || item.slug === pathname;

                                return (

                                    <li key={title} className="h-full flex justify-center items-center relative group">
                                        <button
                                            key={title}
                                            className="uppercase h-full w-full text-secondary-alt text-xs font-haasRegular tracking-normal hover:tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out text-center"
                                            onClick={() => handleSubMenuClick(item)}
                                        >
                                            {title}
                                        </button>
                                        <span
                                            className={`absolute bottom-[0.5px] left-0 h-0.5 bg-secondary-alt transition-all duration-300 ease-in-out ${isActive ? 'w-full' : 'w-0'}`}
                                        ></span>
                                    </li>
                                )
                            })}
                        </nav>
                    </div>
                    {/* Modal Area */}
                    {selectedMenu && selectedMenu.type === "submenu" ? (
                        <SubCategoriesModal
                            closeModal={() => setSelectedMenu(false)}
                            selectedMenu={selectedMenu}
                        />
                    ) : selectedMenu && (selectedMenu.type === "markets" || selectedMenu.type === "tents") ? (
                        <MarketTentModal
                            selectedMenu={selectedMenu}
                            closeModal={() => setSelectedMenu(false)}
                        />
                    ) : null}

                    {/* Search Modal */}
                    {searchModal && (
                        <SearchModal
                            isActive={searchModal}
                            closeModal={() => setSearchModal(false)}
                        />
                    )}
                </div>

                <div className="relative">
                    <div className='mobile-menu lg:hidden fixed inset-x-3 top-3 z-50 px-6 py-2'>
                        <div className={`absolute inset-0 -z-10 backdrop-blur-[20px] brightness-[50px] ${isMobileMenuOpen ? "bg-glass-white" : "bg-secondary-glass"}`}></div>
                        <div className="flex p-2 lg:px-6 justify-between">
                            <CustomLink to="/" onClick={closeAllModals}>
                                <span className="sr-only">Hensley Event Resources</span>
                                <Image src={logo} className={`min-w-[174px] ${isMobileMenuOpen ? "hidden" : "block"}`} alt="Hensley Event Resources Logo" />
                                <Image src={icon} className={`h-7 min-w-[27px] ${isMobileMenuOpen ? "block" : "hidden"}`} alt="Hensley Event Resources Logo" />
                            </CustomLink>
                            {isMobileMenuOpen && userMenu.map((item, index) => {
                                const { icon, type } = item;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleClickUserMenu(item)}
                                        className="relative h-8 flex justify-center items-center"
                                    >
                                        <Image height={"18"} src={icon} alt={item.type} />
                                        {type === 'cart' && (
                                            <span className="absolute -top-1 font-haasRegular left-full min-w-[32px] inline-flex items-center justify-center px-1.5 text-[13px] text-secondary-alt bg-primary rounded-full">
                                                {cartTotalQuantity}
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                            <button
                                className="transition-all duration-300 ease-in-out"
                                onClick={toggleMobileMenu}
                            >
                                {isMobileMenuOpen ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20.885"
                                        height="20.885"
                                        viewBox="0 0 20.885 20.885"
                                        className="transform transition-transform duration-300 ease-in-out"
                                    >
                                        <g id="Group_3913" data-name="Group 3913" transform="translate(-364.057 -35.735)">
                                            <line id="Line_451" data-name="Line 451" x2="28.536" transform="translate(364.411 36.089) rotate(45)" fill="none" stroke="#2c2216" strokeWidth="1" />
                                            <line id="Line_452" data-name="Line 452" y2="28.536" transform="translate(384.589 36.089) rotate(45)" fill="none" stroke="#2c2216" strokeWidth="1" />
                                        </g>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="43"
                                        height="25"
                                        viewBox="0 0 43 25"
                                        className="transform transition-transform duration-300 ease-in-out"
                                    >
                                        <line id="Line_451" data-name="Line 451" x2="43" transform="translate(0 0.5)" fill="none" stroke="#2c2216" strokeWidth="1" />
                                        <line id="Line_452" data-name="Line 452" x2="43" transform="translate(0 12.5)" fill="none" stroke="#2c2216" strokeWidth="1" />
                                        <line id="Line_482" data-name="Line 482" x2="43" transform="translate(0 24.5)" fill="none" stroke="#2c2216" strokeWidth="1" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <HeaderMobileMenu
                        menuItems={sortByOrderNumber(header, { key: 'orderMobile' })}
                        searchModal={searchModal}
                        setSearchModal={setSearchModal}
                        isMobileMenuOpen={isMobileMenuOpen}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        subNavigation={subNavigation}
                        selectedMenu={selectedMenu}
                        setSelectedMenu={setSelectedMenu}
                        handleMainMenuClick={handleMainMenuClick}
                        handleSubMenuClick={handleSubMenuClick}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                        closeAllModals={closeAllModals}
                    />
                </div>

            </header>

            {/* Spacer for non-homepage content */}
            {pathname !== "/" && <div className='h-[90px]'></div>}
        </>
    );
};