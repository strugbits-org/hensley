import React, { useEffect, useState } from "react";
import { SearchModal } from "../Modals/SearchModal";
import { MarketTentModal } from "../Modals/MarketTentModal";
import { CustomLink } from "../common/CustomLink";

// Memoized SubCategory component to avoid re-renders
const SubCategoryItem = ({ category, onClick }) => {
    const { name, imageSrc } = category;
    return (
        <CustomLink className="w-1/2 flex flex-col items-center" key={name}>
            <div className="relative bg-primary rounded-full w-[115px] h-[115px] overflow-hidden">
                {imageSrc && <img src={imageSrc} alt={name} className="h-full w-full" />}
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-secondary-alt font-haasRegular">{name}</p>
        </CustomLink>
    );
};

// Memoized back button icon to prevent unnecessary re-renders
const BackButton = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="27.979" height="27.87" viewBox="0 0 27.979 27.87">
        <g id="Group_2072" data-name="Group 2072" transform="translate(14.131 27.283) rotate(-135)">
            <path id="Path_3283" data-name="Path 3283" d="M.353.5h18.9V19.4" transform="translate(-0.33 -0.562)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
            <line id="Line_13" data-name="Line 13" x1="19" y2="19" transform="translate(0 -0.123)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
            <line id="Line_14" data-name="Line 14" x1="19" y2="19" transform="translate(0 -0.123)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
        </g>
    </svg>
);

export const HeaderMobileMenu = ({
    data,
    isMobileMenuOpen,
    searchModal,
    setSearchModal,
    selectedMenu,
    setSelectedMenu,
    activeMenu,
    handleMainMenuClick,
    handleSubMenuClick,
    setIsMobileMenuOpen
}) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Sort items once when data changes
        const sortedMenuItems = [...data].sort((a, b) => a.orderMobile - b.orderMobile);
        setMenuItems(sortedMenuItems);
    }, [data]);

    // Optimized transition class computation
    const transitionClass = isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full';

    return (
        <div
            className={`z-10 lg:hidden fixed inset-y-0 right-0 w-full overflow-hidden transform transition-transform duration-500 ease-in-out ${transitionClass}`}
        >
            <div className="h-full flex flex-col bg-primary-alt shadow-xl">
                <div className="relative flex-1 px-3 overflow-y-auto hide-scrollbar">
                    {!searchModal ? (
                        <div className="bg-white mb-3 min-h-[98.5vh] flex flex-col">
                            <div className="h-[5.375rem] bg-primary-alt"></div>
                            <div className="nav-container relative px-2 pt-24 pb-3 grow">
                                <nav className="flex flex-col items-center w-full space-y-[50px]">
                                    {menuItems.map((item) => (
                                        <React.Fragment key={item.name}>
                                            <button
                                                onClick={() => handleMainMenuClick(item)}
                                                className="font-haasMedium text-center cursor-pointer text-[21px] tracking-widest"
                                            >
                                                {item.name}
                                            </button>
                                            {activeMenu === item.name && item.type !== "categoriesModal" && item.subMenu.map((subItem) => {
                                                const { name, slug, type } = subItem;

                                                return type !== "url" ? (
                                                    <button
                                                        key={name}
                                                        className="font-haasLight text-center cursor-pointer text-[21px] tracking-widest"
                                                        onClick={() => handleSubMenuClick(subItem)}
                                                    >
                                                        {name}
                                                    </button>
                                                ) : (
                                                    <CustomLink
                                                        key={name}
                                                        to={`/subCategory/${slug}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="font-haasLight text-center cursor-pointer text-[21px] tracking-wider"
                                                    >
                                                        {name}
                                                    </CustomLink>
                                                )
                                            })}
                                        </React.Fragment>
                                    ))}
                                </nav>

                                {/* Sub Navigation Area - Only render when needed */}
                                {selectedMenu && selectedMenu.type === "subCategoriesModal" && selectedMenu.subCategories?.length > 0 && (
                                    <div className="bg-white z-10 sub-navigations inset-0 absolute py-12 px-7 overflow-auto hide-scrollbar">
                                        <div className="panel-header relative flex items-center justify-center flex-col">
                                            <button
                                                className="absolute left-0"
                                                onClick={() => setSelectedMenu(false)}
                                            >
                                                <BackButton />
                                            </button>
                                            <h2 className="text-center font-haasMedium uppercase text-[21px]">Rentals</h2>
                                            <h3 className="text-center font-haasRegular uppercase text-[18px]">{selectedMenu.name}</h3>
                                        </div>
                                        <div className="mt-8 flex flex-wrap justify-center gap-y-[31px] p-2">
                                            {selectedMenu.subCategories.map((category) => (
                                                <SubCategoryItem
                                                    key={category.name}
                                                    category={category}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Modal Area - Only render when needed */}
                                {selectedMenu && selectedMenu.type === "categoriesModal" && (
                                    <MarketTentModal
                                        isMobileMenu={true}
                                        data={selectedMenu.subCategories || selectedMenu.subMenu || []}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <SearchModal
                            isMobileMenu={true}
                            isActive={searchModal}
                            closeModal={() => setSearchModal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};