import { useState, useCallback, useMemo, useEffect } from "react";
import { PrimaryImage } from "./PrimaryImage";

const FilterCardSubCategories = ({
  data,
  onApplyFilters,
  handleFilterChange,
  selectedTags,
  isPortfolio = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingTags, setPendingTags] = useState([...selectedTags]);
  const { categories = [], markets = [], studios = [] } = data;

  // Sync pendingTags when selectedTags changes from outside (e.g. URL param)
  useEffect(() => {
    if (!isOpen) {
      setPendingTags([...selectedTags]);
    }
  }, [selectedTags, isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const willClose = prev;
      if (willClose && onApplyFilters) {
        // Apply the accumulated filter selections when closing
        onApplyFilters(pendingTags);
      }
      if (!prev) {
        // Opening — sync pending with current
        setPendingTags([...selectedTags]);
      }
      return !prev;
    });
  }, [pendingTags, onApplyFilters, selectedTags]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onApplyFilters) {
      onApplyFilters(pendingTags);
    }
  }, [pendingTags, onApplyFilters]);

  const handleItemClick = useCallback((id) => {
    setPendingTags((prev) => {
      const next =
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];

      return next;
    });
  }, []);

  const sections = useMemo(
    () => [
      { items: categories, key: isPortfolio ? "title" : "label" },
      { title: "MARKETS", items: markets, key: "category" },
      { title: "STUDIOS", items: studios, key: "name" },
    ],
    [categories, markets, studios, isPortfolio],
  );

  const renderSection = useCallback(
    (section, isFirst) => (
      <div key={section.title || "categories"}>
        {!isFirst && (
          <div className="w-full border-b border-secondary-alt mb-6" />
        )}
        {section.title && (
          <h3 className="w-full sm:px-[71px] px-[21px] lg:text-[45px] 3xl:text-[64px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none">
            {section.title}
          </h3>
        )}
        <ul className="sm:px-[71px] px-[21px] grid grid-cols-2 gap-y-4 gap-x-4 3xl:gap-y-6 w-full list-none py-[23px] 3xl:py-[32px]">
          {section.items.map((item, index) => {
            const isSelected = pendingTags.includes(item._id);
            return (
              <li
                onClick={() => handleItemClick(item._id)}
                className={`cursor-pointer px-4 py-2 ${isSelected ? "bg-primary-alt" : ""}`}
                key={`${item._id || index}`}
              >
                <button className="text-[18px] lg:text-[20px] 3xl:text-[28px] text-secondary-alt uppercase font-recklessRegular hover:opacity-70 transition-opacity">
                  {item[section.key || section.portfolioKey]}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    ),
    [handleItemClick, pendingTags],
  );

  return (
    <div className="flex justify-center items-center pb-[18px]">
      <div
        onMouseLeave={handleClose}
        className={`relative lg:w-[924px] 3xl:w-[1300px] sm:w-[681px] w-[344px] bg-white py-[25px] 3xl:py-[36px] flex flex-col justify-between items-center ${!isOpen ? "border-b border-b-secondary-alt" : ""}`}
      >
        {/* Header */}
        <div
          className="sm:px-[71px] px-[21px] cursor-pointer flex flex-row w-full justify-between items-center select-none"
          onClick={handleToggle}
        >
          <h3 className="lg:text-[45px] 3xl:text-[64px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none">
            ALL CATEGORIES
          </h3>
          <PrimaryImage
            url="/icons/0e0ac5_3bd320dac8514b3ebaa8d424375b0ac2.svg"
            customClasses={`w-[16px] h-[16px] lg:h-[24px] lg:w-[24px] 3xl:h-[34px] 3xl:w-[34px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="w-full absolute top-full z-[10] bg-white shadow-lg">
            {sections.map((section, index) =>
              renderSection(section, index === 0),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCardSubCategories;
