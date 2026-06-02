import React, { Suspense } from "react";
import { SearchModal } from "../Modals/SearchModal";
import { MarketTentModal } from "../Modals/MarketTentModal";
import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";
import { lightboxActions } from "@/store/lightboxStore";

const resolveSubCategoryHref = (data = {}) => {
  const directPath = data.slug || data.href || data.url;

  if (directPath) return directPath;

  const relatedCollection =
    data?.category || data?.collection || data?.productCollection || {};
  const categorySlug = relatedCollection?.slug
    ? String(relatedCollection.slug).replace(/^\//, "")
    : "";

  if (!categorySlug) return "";

  const menuPath = relatedCollection?.menuPath;
  const basePath =
    menuPath === "collections"
      ? "/collections"
      : menuPath === "subcategory"
        ? "/subcategory"
        : relatedCollection?.featured
          ? "/collections"
          : data.redirection || "/subcategory";

  return `${basePath}/${categorySlug}`;
};

const SubCategoryItem = ({ data, closeModal }) => {
  const relatedCollection =
    data?.category || data?.collection || data?.productCollection || {};
  const collectionImage =
    relatedCollection.mainMedia ||
    relatedCollection.media?.mainMedia ||
    "https://cdn-dev.core.blueprintstudios.com/transform/menu-white.jpg";
  const { title, type, lightbox, target } = data;
  const linkTo = resolveSubCategoryHref(data);

  const content = (
    <>
      <div className="relative bg-primary rounded-full w-[115px] h-[115px] overflow-hidden">
        {collectionImage && (
          <PrimaryImage
            timeout={0}
            url={collectionImage}
            size="thumbnail"
            alt={title}
            customClasses="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-secondary-alt font-haasRegular">
        {title}
      </p>
    </>
  );

  if (type === "lightbox" && lightbox) {
    return (
      <button
        type="button"
        className="w-1/2 flex flex-col items-center"
        onClick={() => {
          lightboxActions.showLightBox(lightbox);
          closeModal?.();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <CustomLink
      to={linkTo}
      target={target}
      className="w-1/2 flex flex-col items-center"
      key={title}
      onClick={closeModal}
    >
      {content}
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
  closeAllModals,
  toggleMobileMenu,
}) => {
  const transitionClass = isMobileMenuOpen
    ? "translate-x-0"
    : "translate-x-full";

  return (
    <div
      className={`z-10 lg:hidden fixed inset-y-0 right-0 w-full transform transition-transform duration-500 ease-in-out ${transitionClass}`}
    >
      <div className="h-full flex flex-col bg-primary-alt shadow-xl">
        <div className="relative flex-1 px-3 overflow-y-auto hide-scrollbar">
          {!searchModal && (
            <div className="bg-white mb-3 min-h-[98.5vh] flex flex-col">
              <div className="h-[5.375rem] bg-primary-alt"></div>
              <div className="nav-container relative px-2 pt-24 pb-3 grow">
                <nav className="flex flex-col items-center w-full space-y-[50px]">
                  {menuItems.map((item) => (
                    <React.Fragment key={item.title}>
                      <button
                        onClick={() => handleMainMenuClick(item, true)}
                        className="font-haasMedium text-center cursor-pointer text-[21px] tracking-widest"
                      >
                        {item.title}
                      </button>
                      {activeMenu === item.title &&
                        item.type !== "markets" &&
                        subNavigation.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleSubMenuClick(subItem, true)}
                            className="font-haasLight text-center cursor-pointer text-[21px] tracking-widest"
                          >
                            {subItem.title}
                          </button>
                        ))}
                    </React.Fragment>
                  ))}
                </nav>

                {selectedMenu &&
                  (selectedMenu.type === "submenu" ||
                    selectedMenu.type === "tents") && (
                    <div className="bg-white z-10 absolute inset-x-0 top-0 h-fit py-12 px-4 shadow-xl pb-16 border-b border-primary-border">
                      <div className="relative flex items-center justify-center flex-col">
                        <button
                          className="absolute left-0"
                          onClick={() => setSelectedMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="27.979"
                            height="27.87"
                            viewBox="0 0 27.979 27.87"
                          >
                            <g transform="translate(14.131 27.283) rotate(-135)">
                              <path
                                d="M.353.5h18.9V19.4"
                                transform="translate(-0.33 -0.562)"
                                fill="none"
                                stroke="#2c2216"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                              />
                              <line
                                x1="19"
                                y2="19"
                                transform="translate(0 -0.123)"
                                fill="none"
                                stroke="#2c2216"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                              />
                            </g>
                          </svg>
                        </button>
                        <h2 className="text-center font-haasMedium uppercase text-[21px]">
                          Rentals
                        </h2>
                        <h3 className="text-center font-haasRegular uppercase text-[18px]">
                          {selectedMenu.title}
                        </h3>
                      </div>
                      {selectedMenu.type === "tents" && (
                        <MarketTentModal
                          selectedMenu={selectedMenu}
                          closeModal={closeAllModals}
                        />
                      )}
                      <div className="mt-8 flex flex-wrap justify-center gap-y-[31px] p-2">
                        {selectedMenu.type !== "tents" &&
                          selectedMenu.data.map((category) => (
                            <SubCategoryItem
                              key={category.title}
                              data={category}
                              closeModal={closeAllModals}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                {selectedMenu && selectedMenu.type === "markets" && (
                  <MarketTentModal
                    selectedMenu={selectedMenu}
                    closeModal={closeAllModals}
                  />
                )}
              </div>
            </div>
          )}
          <Suspense>
            <SearchModal
              isMobileMenu
              isActive={searchModal}
              closeModal={() => setSearchModal(false)}
              onSearch={() => (isMobileMenuOpen ? toggleMobileMenu() : null)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
