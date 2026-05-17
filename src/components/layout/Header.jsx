'use client'

import Image from 'next/image';
import logo from '@/assets/logo-dark.png';
import icon from '@/assets/icon-dark.svg';
import searchIcon from '@/assets/icons/search.svg';
import userIcon from '@/assets/icons/user.svg';
import cartIcon from '@/assets/icons/cart.svg';
import { CustomLink } from '../common/CustomLink';
import { Suspense, useEffect, useState } from 'react';
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
import { actions } from '@/store';

const userMenu = [
    { icon: searchIcon, type: 'search' },
    { icon: userIcon, slug: '/account', type: 'account' },
    { icon: cartIcon, slug: '/cart', type: 'cart' },
];

export const Header = ({ data = {}, marketsData = [], tentsData = [] }) => {
    const { header = [], headerSubMenu = [], headerMegaMenu = [] } = data || {};
    const defaultActiveMenu = header[0]?.title || "RENTALS";

    const [cookies, setCookie, removeCookie] = useCookies(["cartQuantity", "authToken"]);
    const [activeMenu, setActiveMenu] = useState(defaultActiveMenu);
    const [subNavigation, setSubNavigation] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartTotalQuantity, setCartTotalQuantity] = useState(typeof window !== 'undefined' && localStorage?.getItem('cartQuantity') || "0");
    const pathname = usePathname();
    const router = useRouter();

    const [activeSubMenuItem, setActiveSubMenuItem] = useState({});
    const redirectWithLoader = useRedirectWithLoader();

    useEffect(() => {
        const quantity = cookies?.cartQuantity !== undefined ? String(cookies.cartQuantity) : "0";
        setCartTotalQuantity(quantity);
    }, [cookies.cartQuantity]);

    const getMenuUrl = (item) => item?.slug || item?.href || item?.url || "";

    const isMarketsMenu = (item) => item?.type === "markets" || String(item?.title || "").toUpperCase() === "MARKETS";
    const isTentsMenu = (item) => item?.type === "tents" || /(^|\b)tents?(\b|$)/i.test(String(item?.title || ""));

    const getSubItemsForMenu = (menuItem) => {
        if (!menuItem) return [];

        if (Array.isArray(menuItem.children) && menuItem.children.length) {
            return sortByOrderNumber(menuItem.children);
        }

        return sortByOrderNumber(
            headerSubMenu.filter(item => item.Header_menuItems?.some(subItem => subItem._id === menuItem?._id))
        );
    };


    const getNestedItemsForSubMenu = (item) => {
        if (!item) return [];

        if (Array.isArray(item.data) && item.data.length) {
            return sortByOrderNumber(item.data);
        }

        if (Array.isArray(item.children) && item.children.length) {
            return sortByOrderNumber(item.children);
        }

        return sortByOrderNumber(
            headerMegaMenu.filter(x => x.HeaderSubMenu_categories?.some(y => y._id === item?._id))
        );
    };

    const runMenuAction = (item, isMobile = false) => {
        if (!item) return false;

        const destination = getMenuUrl(item);

        if (item.type === "lightbox" && item.lightbox) {
            lightboxActions.showLightBox(item.lightbox);
            if (isMobile && isMobileMenuOpen) toggleMobileMenu();
            return true;
        }

        if ((item.type === "external" || item.target === "_blank") && destination) {
            if (typeof window !== 'undefined') {
                window.open(destination, item.target || "_blank", "noopener,noreferrer");
            }
            if (isMobile && isMobileMenuOpen) toggleMobileMenu();
            return true;
        }

        if ((item.type === "slug" || item.type === "internal" || (item?.useSlugForMobile && isMobile)) && destination) {
            redirectWithLoader(destination);
            if (isMobile && isMobileMenuOpen) toggleMobileMenu();
            return true;
        }

        return false;
    };

    const handleClickUserMenu = (item, isMobile) => {
        if (item.type === 'search') {
            setSearchModal(prev => {
                if (!prev) {
                    setSelectedMenu(false);
                }
                return !prev;
            });
            return;
        } else if (item.type === 'account' && !isMobile && !cookies.authToken) {
            lightboxActions.showLightBox('login');
        } else if (item.type === 'account' && isMobile && !cookies.authToken) {
            redirectWithLoader("/login");
        } else {
            redirectWithLoader(item.slug);
        }
        toggleMobileMenu();
    }

    const handleMainMenuClick = (item, isMobile = false) => {
        setSearchModal(false);

        const nextSubNavigation = getSubItemsForMenu(item);
        const itemIsMarkets = isMarketsMenu(item);
        const itemIsTents = isTentsMenu(item);

        if (!nextSubNavigation.length && !itemIsMarkets && !itemIsTents && item?.type !== "submenu") {
            setSelectedMenu(false);
            if (runMenuAction(item, isMobile)) return;
        }

        setActiveMenu(item?.title || defaultActiveMenu);

        if (itemIsMarkets || itemIsTents) {
            const newMenu = {
                title: item?.title || (itemIsMarkets ? 'MARKETS' : 'TENTS'),
                type: itemIsMarkets ? 'markets' : 'tents',
                data: sortByOrderNumber(itemIsMarkets ? marketsData : tentsData),
            };
            if (selectedMenu) {
                setSelectedMenu(false);
                setTimeout(() => setSelectedMenu(newMenu), 50);
            } else {
                setSelectedMenu(newMenu);
            }
        } else {
            setSelectedMenu(false);
        }
    }

    const handleSubMenuClick = (item, isMobile = false) => {
        setSearchModal(false);

        const itemIsTents = isTentsMenu(item);
        const itemIsMarkets = isMarketsMenu(item);

        const nestedData = itemIsTents
            ? sortByOrderNumber(tentsData)
            : itemIsMarkets
                ? sortByOrderNumber(marketsData)
                : getNestedItemsForSubMenu(item);

        const shouldOpenNestedMenu = item?.type === 'submenu' || itemIsTents || itemIsMarkets || nestedData.length > 0;

        if (shouldOpenNestedMenu) {
            const newMenu = {
                title: item.title,
                type: itemIsMarkets ? 'markets' : itemIsTents ? 'tents' : 'submenu',
                data: nestedData,
            };

            if (selectedMenu) {
                setSelectedMenu(false);
                setTimeout(() => {
                    setSelectedMenu(newMenu);
                }, 50);
            } else {
                setSelectedMenu(newMenu);
            }
        }

        if (!itemIsTents && !itemIsMarkets && (item?.type === "slug" || item?.type === "external" || item?.type === "lightbox" || (item?.useSlugForMobile && isMobile))) {
            runMenuAction(item, isMobile);
        }
    }

    const toggleMobileMenu = () => {
        setSearchModal(false);
        setSelectedMenu(false);
        setIsMobileMenuOpen(prev => {
            if (!prev) {
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
            return !prev;
        });
    }

    useEffect(() => {
        const currentMenu = header.find(item => item.title === activeMenu) || header[0];

        if (!currentMenu) {
            setSubNavigation([]);
            return;
        }

        if (isMarketsMenu(currentMenu)) {
            const marketsNavigation = marketsData.map(item => ({
                ...item,
                slug: `/market${item.slug}`,
                type: 'slug'
            }));
            setSubNavigation(sortByOrderNumber(marketsNavigation) || []);
        } else if (isTentsMenu(currentMenu)) {
            const tentsNavigation = tentsData.map(item => ({
                ...item,
                slug: `/tent${item.slug}`,
                type: 'slug'
            }));
            setSubNavigation(sortByOrderNumber(tentsNavigation) || []);
        } else {
            setSubNavigation(getSubItemsForMenu(currentMenu));
        }
    }, [activeMenu, header, headerSubMenu, marketsData, tentsData]);

    const closeAllModals = () => {
        setSearchModal(false);
        setSelectedMenu(false);
        setIsMobileMenuOpen(false);
        if (typeof window !== 'undefined') {
            document.body.classList.remove('overflow-hidden');
        }
    }

    // const fetchCartItems = async () => {
    //     try {
    //         const response = await getProductsCart();
    //         if (response === "Token has expired") {
    //             removeCookie("authToken", { path: "/" });
    //             removeCookie("userData", { path: "/" });
    //             removeCookie("cartQuantity", { path: "/" });
    //             removeCookie("userTokens", { path: "/" });
    //             setTimeout(() => {
    //                 router.push("/");
    //             }, 500);
    //             return;
    //         }
    //         const lineItems = response?.lineItems || [];
    //         const total = calculateTotalCartQuantity(lineItems);
    //         if (total !== cookies.cartQuantity) {
    //             setCookie("cartQuantity", total, { path: "/" });
    //         }
    //     } catch (error) {
    //         console.error("Error fetching cart items:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchCartItems();
    // }, []);

    useEffect(() => {
        const findActiveSubMenu = () => {
            return subNavigation.find(item => {
                if (item.type === "lightbox") return false;
                const { title } = item;
                if (item.slug === pathname) {
                    return item;
                } else if (selectedMenu?.title === title) {
                    return item;
                }
            });
        }
        const activeItem = findActiveSubMenu();
        setActiveSubMenuItem(activeItem);
    }, [pathname, subNavigation, selectedMenu]);

    useEffect(() => {
        const activeMapping = {
            MARKETS: ["/market"],
            ABOUT: ["/about", "/blog", "/careers", "/contact", "/posts", "/project", "/projects"],
        };
        const basePath = '/' + pathname.split('/')[1];
        const matchedFromMenu = header.find(item => {
            const itemPath = getMenuUrl(item);
            return itemPath && (itemPath === basePath || itemPath === pathname);
        })?.title;
        const matchedMenu = matchedFromMenu || Object.keys(activeMapping).find(menu =>
            activeMapping[menu].includes(basePath)
        );

        setActiveMenu(matchedMenu ? matchedMenu : defaultActiveMenu);
    }, [pathname, header, defaultActiveMenu]);

    useEffect(() => {
        const ids = Array.from(new Set(
            (tentsData || [])
                .flatMap((item) => [
                    item?._id,
                    item?.id,
                    item?.tent?._id,
                    item?.tent?.id,
                    item?.productData?._id,
                    item?.productData?.id,
                ])
                .filter(Boolean)
        ));
        actions.setTentsIds(ids);
    }, [tentsData]);

    return (
        <>
            <header>
                <div className='hidden lg:block fixed inset-x-0 top-0 z-[110] desktop-menu'>
                    <div className="h-[45px] relative">
                        <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px]"></div>
                        <nav className="h-full flex items-center justify-between" aria-label="Main Navigation">
                            {/* Logo */}
                            <div className="flex p-2 lg:px-6">
                                <CustomLink to="/" onClick={() => {closeAllModals(); setActiveMenu(defaultActiveMenu); }}>
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
                                const isActive = activeSubMenuItem?.title === title && item.type !== "lightbox";

                                return (

                                    <li key={title} className="h-full flex justify-center items-center relative group">
                                        <button
                                            key={title}
                                            className="uppercase h-full w-full text-secondary-alt text-xs font-haasRegular tracking-[2px] hover:tracking-[3px] transition-[letter-spacing] duration-300 ease-in-out text-center"
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
                    <Suspense>
                        <SearchModal
                            isActive={searchModal}
                            closeModal={() => setSearchModal(false)}
                        />
                    </Suspense>
                </div>

                <div className="relative z-[110]">
                    <div className='mobile-menu lg:hidden fixed inset-x-3 top-3 z-[110] px-6 py-2'>
                        <div className={`absolute inset-0 -z-10 backdrop-blur-[20px] brightness-[50px] ${isMobileMenuOpen ? "bg-glass-white" : "bg-secondary-glass"}`}></div>
                        <div className="flex p-2 lg:px-6 justify-between">
                            <CustomLink to="/" onClick={() => {closeAllModals(); setActiveMenu(defaultActiveMenu); }}>
                                <span className="sr-only">Hensley Event Resources</span>
                                <Image src={logo} className={`min-w-[174px] ${isMobileMenuOpen ? "hidden" : "block"}`} alt="Hensley Event Resources Logo" />
                                <Image src={icon} className={`h-7 min-w-[27px] ${isMobileMenuOpen ? "block" : "hidden"}`} alt="Hensley Event Resources Logo" />
                            </CustomLink>
                            {isMobileMenuOpen && userMenu.map((item, index) => {
                                const { icon, type } = item;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleClickUserMenu(item, true)}
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
                        toggleMobileMenu={toggleMobileMenu}
                    />
                </div>

            </header>

            {/* Spacer for non-homepage content */}
            {pathname !== "/" && <div className='h-[90px]'></div>}
        </>
    );
};