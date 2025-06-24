import React from 'react'
import { Tag } from '../common/helpers/Tag';

export const MarketsStudiosTags = ({ markets = [], studios = [], categories = [], handleFilterChange, selectedTags = [], count = 3 }) => {
    const allItems = [
        ...categories.map(category => ({ ...category, displayText: category?.label || category.title })),
        ...markets.map(market => ({ ...market, displayText: market.category })),
        ...studios.map(studio => ({ ...studio, displayText: studio.name }))
    ];

    const sortedItems = selectedTags.length > 0
        ? allItems.sort((a, b) => {
            const aSelected = selectedTags.includes(a._id);
            const bSelected = selectedTags.includes(b._id);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        })
        : allItems;

    const handleClick = (e, id) => {
        e.stopPropagation();
        if (handleFilterChange) {
            handleFilterChange(id);
        }
    };

    return (
        <ul className="flex gap-2 flex-wrap">
            {sortedItems.slice(0, count).map((studio) => (
                <Tag
                    key={studio._id}
                    active={selectedTags.includes(studio._id)}
                    onClick={(e) => handleClick(e, studio._id)}
                    text={studio.displayText}
                />
            ))}
            {sortedItems.length > count && (
                <Tag text={`+${sortedItems.length - count} studios`} />
            )}
        </ul>
    );
};