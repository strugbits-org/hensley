'use client'

import Image from 'next/image';
import logo from '@/assets/logo-dark.png';
import icon from '@/assets/icon-dark.svg';
import searchIcon from '@/assets/icons/search.svg';
import userIcon from '@/assets/icons/user.svg';
import cartIcon from '@/assets/icons/cart.svg';
import { CustomLink } from '../common/CustomLink';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SubCategoriesModal } from '../Modals/SubCategoriesModal';
import { MarketTentModal } from '../Modals/MarketTentModal';
import { SearchModal } from '../Modals/SearchModal';
import { HeaderMobileMenu } from './HeaderMobileMenu';

const userMenu = [
    { icon: searchIcon, slug: '#', type: 'search' },
    { icon: userIcon, slug: '#', type: 'account' },
    { icon: cartIcon, slug: '#', count: 1, type: 'cart' },
];

const navigation = [
    {
        name: 'RENTALS',
        type: 'submenu',
        subMenu: [
            {
                name: 'TENTS',
                slug: '#',
                type: 'categoriesModal',
                subCategories: [
                    {
                        name: 'STRUCTURES',
                        slug: '#',
                        imageSrc: "https://static.wixstatic.com/media/626075_8285d7e25f64490d875c3ef3eabb7c7c~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2019_Corinne_David_1077-topaz-upscale-2x.jpg",
                        description: `"Clear span" -Kedered beams
                        Curved beam or A-frame style
                        50', 60', 70', 80', 100' & 120' widths
                        
                        STRUCTURES – ATRIUM
                        Currently 50' (30' middles & 10' wings)
                        Rental companies outside CA can purchase`
                    },
                    {
                        name: 'FRAME TENTS',
                        slug: '#',
                        imageSrc: "https://static.wixstatic.com/media/626075_36662d5195014c1cb66b83fcda6539b0~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/option%201%20(1).jpg",
                        description: `Fabric tension
Push pole -Bail ring -Sail cloth`,
                    },
                    {
                        name: 'SAIL CLOTH TENTS',
                        slug: '#',
                        imageSrc: "https://static.wixstatic.com/media/626075_472b7a68fef34c418ba181a6a00ea1e1~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/17-LauraGordon%C2%A9_brianaandtripwed.jpg",
                        description: `Pipe supported canopy
                        2" or Jumbo track framework
                        Festival style`
                    }
                ]
            },
            {
                name: 'TABLETOP',
                slug: '#',
                type: 'subCategoriesModal',
                subCategories: [
                    {
                        name: 'PREMIUM COLLECTION',
                        slug: '#',
                        imageSrc: "https://static.wixstatic.com/media/626075_af2fdc208ef040ba8f3979fc7f75a21d~mv2.jpg/v1/fill/w_172,h_172,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/premium-v2.jpg"
                    },
                    {
                        name: 'CHINA', slug: '#',
                        imageSrc: "https://static.wixstatic.com/media/626075_7ea4412ce6cd439e8eaa105e49f5ec38~mv2.jpg/v1/fill/w_172,h_172,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/china-v3.jpg"
                    },
                    { name: 'CHARGERS', slug: '#', imageSrc: "https://static.wixstatic.com/media/626075_84ef0ffebac14c9eaf806d12f4a86c6b~mv2.jpg/v1/fill/w_172,h_172,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/chargers-v2.jpg" },
                    { name: 'FLATWARE', slug: '#', imageSrc: "https://static.wixstatic.com/media/626075_fa9c482889f24cf3857d0ee812066d8e~mv2.jpg/v1/fill/w_172,h_172,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fraltware-v2.jpg" },
                    { name: 'STEMWARE', slug: '#', imageSrc: "https://static.wixstatic.com/media/626075_cbadf59363f64aa7bfc69034fab5f16d~mv2.jpg/v1/fill/w_172,h_172,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/stemware-v2.jpg" },
                    { name: 'BARWARE', slug: '#' },
                    { name: 'TABLE ACCESSORIES', slug: '#' },
                    { name: 'NAPKINS', slug: '#' },
                    { name: 'TABLE RUNNERS', slug: '#' },
                    { name: 'LINENS', slug: '#' }
                ]
            },
            {
                name: 'FURNISHINGS',
                type: 'subCategoriesModal',
                slug: '#',
                subCategories: [
                    { name: 'CHAIRS', slug: '#' },
                    { name: 'BARSTOOLS', slug: '#' },
                    { name: 'BANQUETTES', slug: '#' },
                    { name: 'BENCHES', slug: '#' },
                    { name: 'CUSHIONS', slug: '#' },
                    { name: 'DINING TABLES', slug: '#' },
                    { name: 'BANQUET TABLES', slug: '#' },
                    { name: 'KIOSK TABLES', slug: '#' },
                    { name: 'BARS & BACKBARS', slug: '#' },
                    { name: 'SOFA & LOVESEATS', slug: '#' },
                    { name: 'LOUNGE CHAIRS', slug: '#' },
                    { name: 'COFFEE & END TABLES', slug: '#' },
                    { name: 'OTTOMANS & PILLOWS', slug: '#' },
                    { name: 'KIDS', slug: '#' },
                    { name: 'OUTDOOR', slug: '#' }
                ]
            },
            {
                name: 'CATERING',
                type: 'subCategoriesModal',
                slug: '#',
                subCategories: [
                    { name: 'BEVERAGE SERVICES', slug: '#' },
                    { name: 'SERVING PIECES', slug: '#' },
                    { name: 'COOKING EQUIPMENT', slug: '#' }
                ]
            },
            {
                name: 'PAVILIONS',
                slug: 'pavillions',
                type: 'url',
            },
            {
                name: 'ADDITIONAL PRODUCTS',
                slug: '#',
                type: 'subCategoriesModal',
                subCategories: [
                    { name: 'SCREENS', slug: '#' },
                    { name: 'DANCE FLOORS & STAGE', slug: '#' },
                    { name: 'PIPE & DRAPE', slug: '#' },
                    { name: 'HEATERS', slug: '#' },
                    { name: 'MISCELLANEOUS', slug: '#' },
                    { name: 'ESCORT BOARDS', slug: '#' },
                    { name: 'LIGHTING', slug: '#' },
                    { name: 'POOL COVER', slug: '#' }
                ]
            },
        ],
        order: 1,
        orderMobile: 1
    },
    {
        name: 'MARKETS',
        type: 'categoriesModal',
        subMenu: [
            {
                name: 'SOCIAL',
                slug: '#',
                type: 'url',
                imageSrc: "https://static.wixstatic.com/media/626075_8285d7e25f64490d875c3ef3eabb7c7c~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2019_Corinne_David_1077-topaz-upscale-2x.jpg",
                description: `"Clear span" -Kedered beams
                Curved beam or A-frame style
                50', 60', 70', 80', 100' & 120' widths
                
                STRUCTURES – ATRIUM
                Currently 50' (30' middles & 10' wings)
                Rental companies outside CA can purchase`
            },
            {
                name: 'NONPROFIT',
                slug: '#',
                type: 'url',
                imageSrc: "https://static.wixstatic.com/media/626075_36662d5195014c1cb66b83fcda6539b0~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/option%201%20(1).jpg",
                description: `Fabric tension
Push pole -Bail ring -Sail cloth`,
            },
            {
                name: 'CORPORATE',
                slug: '#',
                type: 'url',
                imageSrc: "https://static.wixstatic.com/media/626075_472b7a68fef34c418ba181a6a00ea1e1~mv2.jpg/v1/fill/w_555,h_894,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/17-LauraGordon%C2%A9_brianaandtripwed.jpg",
                description: `Pipe supported canopy
                2" or Jumbo track framework
                Festival style`
            }
        ],
        order: 2,
        orderMobile: 3
    },
    {
        name: 'ABOUT',
        type: 'submenu',
        subMenu: [
            { name: 'ABOUT US', slug: '#' },
            { name: 'PROJECTS', slug: '#' },
            { name: 'BLOG', slug: '#' },
            { name: 'CONTACT', slug: '#' },
            { name: 'CAREERS', slug: '#' },
        ],
        order: 3,
        orderMobile: 2
    },
];

export const Header = () => {
    const [activeMenu, setActiveMenu] = useState(navigation[0].name);
    const [subNavigation, setSubNavigation] = useState(navigation[0].subMenu);
    const [selectedMenu, setSelectedMenu] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleClickUserMenu = (item) => {
        if (item.type === 'search') {
            setSearchModal(prev => {
                console.log(prev);

                if (prev) {
                    setSelectedMenu("RENTALS");
                } else {
                    setSelectedMenu(false);
                }
                return !prev;
            });
        }
    }

    const handleMainMenuClick = (item) => {
        setSelectedMenu(false);
        setSearchModal(false);
        if (item.type === 'submenu') {
            setActiveMenu(item.name);
        } else if (item.type === 'categoriesModal') {
            setActiveMenu(item.name);
            setSelectedMenu(item);
        }
    }

    const handleSubMenuClick = (item) => {
        setSearchModal(false);
        if (selectedMenu) {
            setSelectedMenu(false);
            setTimeout(() => {
                setSelectedMenu(item);
            }, 50);
        } else {
            setSelectedMenu(item);
        }
    }

    const toggleMobileMenu = () => {
        setSearchModal(false);
        setSelectedMenu(false);
        document.body.classList.toggle('overflow-hidden');
        setIsMobileMenuOpen(prev => !prev);
    }

    useEffect(() => {
        const currentMenu = navigation.find(item => item.name === activeMenu);
        if (currentMenu) setSubNavigation(currentMenu.subMenu || []);
    }, [activeMenu]);

    return (
        <>
            <header>
                <div className='hidden lg:block fixed inset-x-0 top-0 z-50 desktop-menu'>
                    <div className="h-[45px] relative">
                        <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px]"></div>
                        <nav className="h-full flex items-center justify-between" aria-label="Main Navigation">
                            {/* Logo */}
                            <div className="flex p-2 lg:px-6">
                                <CustomLink to="/">
                                    <span className="sr-only">Hensley Event Resources</span>
                                    <Image src={logo} className='min-w-[184px]' alt="Hensley Event Resources Logo" />
                                </CustomLink>
                            </div>

                            {/* Main Navigation */}
                            <ul className="flex h-full grow items-center justify-center gap-x-24">
                                {navigation.map((item) => {
                                    const { name } = item;
                                    const isActive = activeMenu === name;

                                    return (
                                        <li className="h-full w-1/3 flex justify-center items-center relative group max-w-[288px]" key={name}>
                                            <button
                                                onClick={() => handleMainMenuClick(item)}
                                                className={`h-full w-full text-secondary-alt text-xs font-haasBold tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out ${isActive ? "" : "hover:tracking-[4px]"}`}
                                            >
                                                {name}
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
                                    const { icon, count } = item;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleClickUserMenu(item)}
                                            className="relative h-10 w-10 flex justify-center items-center"
                                        >
                                            <Image height={"20"} src={icon} alt={item.type} />
                                            {count !== undefined && (
                                                <span className="absolute top-0 font-haasRegular left-9 min-w-[32px] inline-flex items-center justify-center px-1.5 text-[13px] text-secondary-alt bg-primary rounded-full">
                                                    {count}
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
                            className="h-full p-2 lg:px-6 grid items-center max-w-7xl mx-auto"
                            style={{ gridTemplateColumns: `repeat(${subNavigation.length || 1}, minmax(0, 1fr))` }}
                        >
                            {subNavigation.map((item) => {
                                const { name, slug, type } = item;

                                return type !== "url" ? (
                                    <button
                                        key={name}
                                        className="text-secondary-alt text-xs font-haasRegular tracking-normal hover:tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out text-center"
                                        onClick={() => handleSubMenuClick(item)}
                                    >
                                        {name}
                                    </button>
                                ) : (
                                    <CustomLink
                                        key={name}
                                        to={`/subCategory/${slug}`}
                                        className="text-secondary-alt text-xs font-haasRegular tracking-normal hover:tracking-[2px] transition-[letter-spacing] duration-300 ease-in-out text-center"
                                    >
                                        {name}
                                    </CustomLink>
                                )
                            })}
                        </nav>
                    </div>
                    {/* Modal Area */}
                    {selectedMenu && selectedMenu.type === "subCategoriesModal" && selectedMenu.subCategories?.length ? (
                        <SubCategoriesModal
                            closeModal={() => setSelectedMenu(false)}
                            data={selectedMenu.subCategories}
                        />
                    ) : selectedMenu && selectedMenu.type === "categoriesModal" ? (
                        <MarketTentModal
                            data={selectedMenu.subCategories || selectedMenu.subMenu || []}
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
                            <CustomLink to="/">
                                <span className="sr-only">Hensley Event Resources</span>
                                <Image src={logo} className={`min-w-[174px] ${isMobileMenuOpen ? "hidden" : "block"}`} alt="Hensley Event Resources Logo" />
                                <Image src={icon} className={`h-7 min-w-[27px] ${isMobileMenuOpen ? "block" : "hidden"}`} alt="Hensley Event Resources Logo" />
                            </CustomLink>
                            {isMobileMenuOpen && userMenu.map((item, index) => {
                                const { icon, count } = item;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleClickUserMenu(item)}
                                        className="relative h-8 flex justify-center items-center"
                                    >
                                        <Image height={"18"} src={icon} alt={item.type} />
                                        {count !== undefined && (
                                            <span className="absolute -top-1 font-haasRegular left-full min-w-[32px] inline-flex items-center justify-center px-1.5 text-[13px] text-secondary-alt bg-primary rounded-full">
                                                {count}
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

                    <HeaderMobileMenu
                        data={navigation}
                        searchModal={searchModal}
                        setSearchModal={setSearchModal}
                        isMobileMenuOpen={isMobileMenuOpen}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        subNavigation={subNavigation}
                        setSubNavigation={setSubNavigation}
                        selectedMenu={selectedMenu}
                        setSelectedMenu={setSelectedMenu}
                        handleMainMenuClick={handleMainMenuClick}
                        handleSubMenuClick={handleSubMenuClick}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                </div>

            </header>

            {/* Spacer for non-homepage content */}
            {pathname !== "/" && <div className='h-24'></div>}
        </>
    );
};