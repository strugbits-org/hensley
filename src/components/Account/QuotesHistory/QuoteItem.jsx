import React, { useMemo } from 'react';
import { formatDateForQuote, formatTotalPrice } from '@/utils';
import { FiArrowUpRight } from "react-icons/fi";

export const QuoteItem = ({ quote, handleViewClick }) => {
    const totalPrice = useMemo(() =>
        quote.lineItems.reduce((total, { product }) =>
            total + (product.price?.amount || product.price) * product.quantity, 0
        ), [quote.lineItems]
    );

    const formattedTotalPrice = useMemo(() => formatTotalPrice(totalPrice), [totalPrice]);
    const date = useMemo(() => formatDateForQuote(quote.eventDate), [quote.eventDate]);

    const handleOrderAgainClick = () => {
        // Add order again functionality here
        console.log('Order again clicked for quote:', quote._id);
    };

    return (
        <article className='quote-item border-b first:border-t border-[#E0D6CA]' role="listitem">
            {/* Desktop Layout */}
            <div className='hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-y-4 gap-x-4 xl:gap-x-[100px] items-center py-[35px] max-lg:py-5'>
                <div className='quote-location'>
                    <h3 className='font-recklessRegular text-xl text-wrap m-0'>
                        {quote.eventDescriptionPo}
                    </h3>
                    <time
                        className="font-haasLight text-xs uppercase lg:hidden"
                        dateTime={quote.eventDate}
                    >
                        {date}
                    </time>
                </div>

                <div className='quote-date max-lg:hidden'>
                    <time
                        className="font-haasLight text-xs uppercase"
                        dateTime={quote.eventDate}
                    >
                        {date}
                    </time>
                </div>

                <div className='quote-price'>
                    <span className="font-recklessLight text-xl">
                        {formattedTotalPrice}
                    </span>
                </div>

                <div className='quote-actions'>
                    <div className="flex gap-x-6 max-lg:gap-x-3">
                        <button
                            className="bg-[#F0DEA2] font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                            onClick={handleViewClick}
                            aria-label={`View quote for ${quote.eventDescriptionPo}`}
                        >
                            VIEW
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                        <button
                            className="bg-transparent border border-black font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                            onClick={handleOrderAgainClick}
                            aria-label={`Order again for ${quote.eventDescriptionPo}`}
                        >
                            ORDER AGAIN
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className='sm:hidden block py-[35px] max-lg:py-5 space-y-4'>
                <div className='flex justify-between'>
                    <div className='quote-header-mobile'>
                        <h3 className="font-recklessRegular text-xl m-0 mb-1">
                            {quote.eventDescriptionPo}
                        </h3>
                        <time
                            className="font-haasLight text-xs uppercase block"
                            dateTime={quote.eventDate}
                        >
                            {date}
                        </time>
                    </div>

                    <div className='quote-price-mobile'>
                        <span className="font-recklessLight text-xl">
                            {formattedTotalPrice}
                        </span>
                    </div>
                </div>

                <div className='quote-actions-mobile'>
                    <div className="flex gap-x-6 max-lg:gap-x-3">
                        <button
                            className="flex-1 bg-[#F0DEA2] font-haasLight text-xs h-[27px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                            onClick={handleViewClick}
                            aria-label={`View quote for ${quote.eventDescriptionPo}`}
                        >
                            VIEW
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                        <button
                            className="flex-1 bg-transparent border border-black font-haasLight text-xs h-[27px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary"
                            onClick={handleOrderAgainClick}
                            aria-label={`Order again for ${quote.eventDescriptionPo}`}
                        >
                            ORDER AGAIN
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};