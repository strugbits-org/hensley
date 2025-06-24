import React, { useMemo, useState } from 'react';
import { calculateCartTotalPrice, calculateTotalCartQuantity, formatDateForQuote, formatTotalPrice, logError } from '@/utils';
import { FiArrowUpRight } from "react-icons/fi";
import { lightboxActions } from '@/store/lightboxStore';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';

export const QuoteItem = ({ quote, handleViewClick, data }) => {

    const { viewButtonLabel, orderAgainButtonLabel } = data;

    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const totalPrice = useMemo(() => calculateCartTotalPrice(quote.lineItems.map(item => item.product)));
    const formattedTotalPrice = useMemo(() => formatTotalPrice(totalPrice), [totalPrice]);
    const [loading, setLoading] = useState(false);

    const date = useMemo(() => formatDateForQuote(quote.eventDate), [quote.eventDate]);

    const handleOrderAgainClick = async () => {
        try {
            setLoading(true);
            const products = [];
            for (const item of quote?.lineItems || []) {
                const productData = item.product;

                try {
                    let catalogReference = productData?.catalogReference;
                    if (!catalogReference) {
                        const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
                        const { customTextFields = [], productId } = productData;
                        const customTextFieldsData = customTextFields.reduce((acc, { title, value }) => {
                            acc[title] = value;
                            return acc;
                        }, {});
                        customTextFieldsData.size = item.size;
                        catalogReference = {
                            appId,
                            catalogItemId: productId,
                            options: {
                                customTextFields: customTextFieldsData,
                            },
                        };
                    }

                    const product = {
                        catalogReference: catalogReference,
                        quantity: productData.quantity,
                    };

                    products.push(product);
                } catch (error) {
                    logError(error);
                }
            }

            const cartData = {
                lineItems: products,
            };

            await AddProductToCart(cartData);
            const newItems = calculateTotalCartQuantity(cartData.lineItems);
            const total = cookies.cartQuantity ? cookies.cartQuantity + newItems : newItems;
            setCookie("cartQuantity", total, { path: "/" });
            lightboxActions.setBasicLightBoxDetails({
                title: "Added to Cart",
                description: "Products added to cart successfully",
                buttonText: "View Cart",
                buttonLink: "/cart",
                open: true,
            })
        } catch (error) {
            logError("Error while adding products to cart:", error);
            lightboxActions.setBasicLightBoxDetails({
                title: "Something went wrong",
                description: "Error while adding products to cart",
                buttonText: "Try Again",
                open: true,
            })
        } finally {
            setLoading(false);
        }
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
                            className="bg-[#F0DEA2] font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary"
                            onClick={handleViewClick}
                            aria-label={`View quote for ${quote.eventDescriptionPo}`}
                        >
                            {viewButtonLabel || 'VIEW'}
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                        <button
                            className="break-keep bg-transparent border border-secondary-alt font-haasLight text-xs w-[134px] h-[27px] max-lg:w-[114px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary"
                            onClick={handleOrderAgainClick}
                            aria-label={`Order again for ${quote.eventDescriptionPo}`}
                        >
                            {loading ? "PLEASE WAIT..." : (orderAgainButtonLabel || "ORDER AGAIN")}
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
                            className="flex-1 bg-[#F0DEA2] font-haasLight text-xs h-[27px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[5px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary"
                            onClick={handleViewClick}
                            aria-label={`View quote for ${quote.eventDescriptionPo}`}
                        >
                            {viewButtonLabel || 'VIEW'}
                            <span className="absolute right-3" aria-hidden="true">
                                <FiArrowUpRight className="inline group-hover:text-white" />
                            </span>
                        </button>
                        <button
                            className="flex-1 break-keep bg-transparent border border-secondary-alt font-haasLight text-xs h-[27px] max-lg:h-[35px] flex items-center justify-center max-lg:justify-start max-lg:pl-3 relative group hover:tracking-[1px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary"
                            onClick={handleOrderAgainClick}
                            aria-label={`Order again for ${quote.eventDescriptionPo}`}
                        >
                            {loading ? "PLEASE WAIT..." : (orderAgainButtonLabel || "ORDER AGAIN")}
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