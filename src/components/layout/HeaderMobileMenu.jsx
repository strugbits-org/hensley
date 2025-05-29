import React from "react";
import { SearchModal } from "../Modals/SearchModal";
import { MarketTentModal } from "../Modals/MarketTentModal";
import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";

const SubCategoryItem = ({ data, closeModal }) => {
    const { title, category, redirection } = data;
    const linkTo = `${redirection || "/subcategory"}/${category.slug}`;
    return (
        <CustomLink to={linkTo} className="w-1/2 flex flex-col items-center" key={title} onClick={closeModal}>
            <div className="relative bg-primary rounded-full w-[115px] h-[115px] overflow-hidden">
                {category.mainMedia && (
                    <PrimaryImage
                        timeout={0}
                        url={category.mainMedia}
                        alt={title}
                        customClasses="h-full w-full object-cover"
                    />
                )}
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-secondary-alt font-haasRegular">{title}</p>
        </CustomLink>
    );
};

export const HeaderMobileMenu = ({
    menuItems = [],
    subNavigation = [],
    isMobileMenuOpen,
    searchModal,
    setSearchModal,
    selectedMenu,
    setSelectedMenu,
    activeMenu,
    handleMainMenuClick,
    handleSubMenuClick,
    closeAllModals
}) => {
    const transitionClass = isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full';

    return (
        <div className={`z-10 lg:hidden fixed inset-y-0 right-0 w-full transform transition-transform duration-500 ease-in-out ${transitionClass}`}>
            <div className="h-full flex flex-col bg-primary-alt shadow-xl">
                <div className="relative flex-1 px-3 overflow-y-auto hide-scrollbar">
                    {!searchModal ? (
                        <div className="bg-white mb-3 min-h-[98.5vh] flex flex-col">
                            <div className="h-[5.375rem] bg-primary-alt"></div>
                            <div className="nav-container relative px-2 pt-24 pb-3 grow">
                                <nav className="flex flex-col items-center w-full space-y-[50px]">
                                    {menuItems.map((item) => (
                                        <React.Fragment key={item.title}>
                                            <button
                                                onClick={() => handleMainMenuClick(item)}
                                                className="font-haasMedium text-center cursor-pointer text-[21px] tracking-widest"
                                            >
                                                {item.title}
                                            </button>
                                            {activeMenu === item.title && item.type !== "markets" && (
                                                subNavigation.map((subItem) => (
                                                    <button
                                                        key={subItem.title}
                                                        onClick={() => handleSubMenuClick(subItem, true)}
                                                        className="font-haasLight text-center cursor-pointer text-[21px] tracking-widest"
                                                    >
                                                        {subItem.title}
                                                    </button>

                                                ))
                                            )}
                                        </React.Fragment>
                                    ))}
                                </nav>

                                {selectedMenu && (selectedMenu.type === "submenu" || selectedMenu.type === "tents") && (
                                    <div className="bg-white z-10 absolute inset-0 py-12 px-4 overflow-auto hide-scrollbar">
                                        <div className="relative flex items-center justify-center flex-col">
                                            <button className="absolute left-0" onClick={() => setSelectedMenu(false)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="27.979" height="27.87" viewBox="0 0 27.979 27.87">
                                                    <g transform="translate(14.131 27.283) rotate(-135)">
                                                        <path d="M.353.5h18.9V19.4" transform="translate(-0.33 -0.562)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                                        <line x1="19" y2="19" transform="translate(0 -0.123)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                                    </g>
                                                </svg>
                                            </button>
                                            <h2 className="text-center font-haasMedium uppercase text-[21px]">Rentals</h2>
                                            <h3 className="text-center font-haasRegular uppercase text-[18px]">{selectedMenu.title}</h3>
                                        </div>
                                        {selectedMenu.type === "tents" && (
                                            <MarketTentModal selectedMenu={selectedMenu} closeModal={closeAllModals} />
                                        )}
                                        <div className="mt-8 flex flex-wrap justify-center gap-y-[31px] p-2">
                                            {selectedMenu.type !== "tents" && selectedMenu.data.map((category) => (
                                                <SubCategoryItem key={category.title} data={category} closeModal={closeAllModals} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedMenu && selectedMenu.type === "markets" && (
                                    <MarketTentModal selectedMenu={selectedMenu} closeModal={closeAllModals} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <SearchModal isMobileMenu isActive={searchModal} closeModal={() => setSearchModal(false)} />
                    )}
                </div>
            </div>
        </div>
    );
};