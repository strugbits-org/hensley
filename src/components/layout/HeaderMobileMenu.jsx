import React, { useEffect, useState } from "react";
import { SearchModal } from "../Modals/SearchModal"
import { SubCategoriesModal } from "../Modals/SubCategoriesModal";
import { MarketTentModal } from "../Modals/MarketTentModal";

export const HeaderMobileMenu = ({ data, isMobileMenuOpen, setIsMobileMenuOpen, searchModal, setSearchModal }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [activeMenu, setActiveMenu] = useState(data[0].name);
    const [subNavigation, setSubNavigation] = useState(data[0].subMenu);
    const [selectedMenu, setSelectedMenu] = useState(false);

    const handleMainMenuClick = (item) => {
        setSelectedMenu(false);
        setSearchModal(false);
        setActiveMenu();
        if (item.type === 'submenu') {
            setActiveMenu(item.name);
        } else if (item.type === 'categoriesModal') {
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

    useEffect(() => {
        const currentMenu = data.find(item => item.name === activeMenu);
        if (currentMenu) setSubNavigation(currentMenu.subMenu || []);
    }, [activeMenu]);

    useEffect(() => {
        const sortedMenuItems = data.sort((a, b) => a.orderMobile - b.orderMobile);
        setMenuItems(sortedMenuItems);
    }, [data]);

    return (
        <div
            className={`z-10 fixed inset-y-0 right-0 w-full overflow-hidden transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col bg-primary-alt shadow-xl">
                <div className="relative flex-1 px-3 overflow-y-auto hide-scrollbar">
                    {!searchModal ? (
                        <div className="bg-white mb-3 min-h-[98.5vh]">
                            <div className='h-[5.375rem] bg-primary-alt'></div>
                            <div className="nav-container px-2 pt-24 pb-3">
                                <nav className="flex flex-col items-center w-full space-y-[50px]">
                                    {data.map((item) => (
                                        <React.Fragment key={item.name}>
                                            <button
                                                onClick={() => handleMainMenuClick(item)}
                                                className={"font-haasMedium text-center cursor-pointer text-[21px] transition-colors"}
                                            >
                                                {item.name}
                                            </button>
                                            {activeMenu === item.name && item.subMenu.map((item) => (
                                                <button
                                                    key={item.name}
                                                    className={"text-center cursor-pointer text-[21px] transition-colors"}
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </nav>
                                {/* Modal Area */}
                                {selectedMenu && selectedMenu.type === "subCategoriesModal" && selectedMenu.subCategories?.length ? (
                                    <SubCategoriesModal
                                        closeModal={() => setSelectedMenu(false)}
                                        data={selectedMenu.subCategories}
                                    />
                                ) : selectedMenu && selectedMenu.type === "categoriesModal" ? (
                                    <MarketTentModal
                                        isMobileMenu={true}
                                        data={selectedMenu.subCategories || selectedMenu.subMenu || []}
                                    />
                                ) : null}
                            </div>
                        </div>) : (
                        <SearchModal
                            isMobileMenu={true}
                            isActive={searchModal}
                            closeModal={() => setSearchModal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
