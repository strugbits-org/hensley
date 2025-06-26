import React from 'react';
import { CustomLink } from './CustomLink';

export const BreadCrumbs = ({ items = [] }) => {
    return (
        <nav aria-label="Breadcrumb" className="flex gap-1 text-secondary-alt lg:text-base text-xs uppercase font-haasLight">
            <ol className="flex items-center gap-1">
                {items.map((item, index) => (
                    <li key={index} title={item.label}>
                        {index === items.length - 1 ? (
                            <span className="font-medium" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <div className="flex items-center gap-1">
                                <CustomLink
                                    to={item.to}
                                    className="hover:text-secondary transition-colors"
                                >
                                    {item.label}
                                </CustomLink>
                                <span aria-hidden="true" className="text-secondary-alt/60">
                                    /
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};