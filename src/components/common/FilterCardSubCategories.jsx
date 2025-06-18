import { useState, useCallback, useMemo } from 'react';
import { PrimaryImage } from './PrimaryImage';

const FilterCardSubCategories = ({ data, handleFilterChange, selectedTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories = [], markets = [], studios = [] } = data;

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const sections = useMemo(() => [
    { items: categories, key: 'label' },
    { title: 'MARKETS', items: markets, key: 'category' },
    { title: 'STUDIOS', items: studios, key: 'name' }
  ], [categories, markets, studios]);

  const renderSection = useCallback((section, isFirst) => (
    <div key={section.title}>
      {!isFirst && <div className="w-full border-b border-secondary-alt mb-6" />}
      {section.title && <h3 className="w-full sm:px-[71px] px-[21px] lg:text-[45px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none">
        {section.title}
      </h3>}
      <ul className="sm:px-[71px] px-[21px] grid grid-cols-2 gap-y-4 gap-x-4 w-full list-none py-[23px]">
        {section.items.map((item, index) => {
          const isSelected = selectedTags.includes(item._id);
          return (
            <li onClick={() => { handleFilterChange(item._id); toggleOpen() }} className={`cursor-pointer px-4 py-2 ${isSelected ? 'bg-primary-alt' : ''}`} key={`${index}`}>
              <button
                className="text-[18px] lg:text-[20px] text-secondary-alt uppercase font-recklessRegular hover:opacity-70 transition-opacity"
              >
                {item[section.key]}
              </button>
            </li>
          )
        })}
      </ul>
    </div >
  ), [handleFilterChange, selectedTags]);

  return (
    <div className="flex justify-center items-center pb-[18px]">
      <div className={`relative lg:w-[924px] sm:w-[681px] w-[344px] bg-white py-[25px] flex flex-col justify-between items-center ${!isOpen ? "border-b border-b-secondary-alt" : ""}`}>

        {/* Header */}
        <div
          className="sm:px-[71px] px-[21px] cursor-pointer flex flex-row w-full justify-between items-center select-none"
          onClick={toggleOpen}
        >
          <h3 className="lg:text-[45px] text-[25px] font-recklessRegular uppercase text-secondary-alt select-none">
            ALL CATEGORIES
          </h3>
          <PrimaryImage
            url="https://static.wixstatic.com/shapes/0e0ac5_3bd320dac8514b3ebaa8d424375b0ac2.svg"
            customClasses={`w-[16px] h-[16px] lg:h-[24px] lg:w-[24px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="w-full absolute top-full z-[10] bg-white shadow-lg">
            {sections.map((section, index) => renderSection(section, index === 0))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCardSubCategories;