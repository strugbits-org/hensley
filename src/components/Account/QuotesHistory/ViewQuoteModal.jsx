"use client"
import { CartCollection, CartNormal, CartTent } from '@/components/Cart/CartItems';
import { AddProductToCart } from '@/services/cart/CartApis';
import { lightboxActions } from '@/store/lightboxStore';
import { calculateCartTotalPrice, calculateTotalCartQuantity, formatDateForQuote, formatDescriptionLines, formatTotalPrice, logError } from '@/utils';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

export const ViewQuoteModal = ({ data, onClose, labels }) => {
    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const { addToCartButtonLabel, addAllItemsButtonLabel, backToQuoteButtonLabel } = labels
    const [loading, setLoading] = useState(false);

    const totalPrice = useMemo(() => calculateCartTotalPrice((data?.lineItems || []).map(item => item.product)));
    const formattedTotalPrice = useMemo(() => formatTotalPrice(totalPrice), [totalPrice]);
    const date = useMemo(() => formatDateForQuote(data?.eventDate), [data?.eventDate]);

    const handleOrderAgainClick = async () => {
        try {
            setLoading(true);
            const products = [];
            for (const item of data?.lineItems || []) {
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
            });
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
            onClose();
        }
    };
    if (!data) return null;
    return (
        <Transition appear show={data !== undefined && data !== null} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg- bg-[#2c221696] bg-opacity-50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center  ">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="transform overflow-hidden text-left align-middle transition-all relative">
                                <div className='h-screen max-w-[1288px] flex justify-center items-center mx-auto '>
                                    <div >
                                        <div className='bg-white w-full flex flex-col lg:gap-y-[20px] gap-y-[50px] py-[30px] px-[24px] h-[800px] overflow-y-scroll hide-scrollbar'>
                                            <div className='heading w-full  flex justify-center items-center flex-col max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                                                <p className='font-haasLight text-base uppercase'>{date}</p>
                                                <h2 className='uppercase text-[140px] text-secondary-alt font-recklessRegular text-center w-full leading-[120px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px] '>{data.eventDescriptionPo}</h2>
                                            </div>
                                            <div className='w-full '>
                                                <div className='w-full bg-[#F4F1EC] pt-[18px] pb-[17px]'>
                                                    <h4 className='text-center text-[35px] font-recklessRegular leading-[39px]'>
                                                        {formattedTotalPrice}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className=''>
                                                {data.lineItems.map((item, index) => {
                                                    const product = item.product;
                                                    const descriptionLines = product.descriptionLines ? formatDescriptionLines(product.descriptionLines) : product.customTextFields;
                                                    const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
                                                    const isTentItem = descriptionLines.find(x => x.title === "TENT TYPE" || x.title === "POOLCOVER")?.value;

                                                    if (productCollection) {
                                                        const productSetItems = productCollection.split("; ");
                                                        const lineItemData = { ...product, productSetItems };
                                                        return (
                                                            <CartCollection key={index} data={lineItemData} readOnly={true} showAddToCart={true} addToCartButtonLabel={addToCartButtonLabel} />
                                                        )
                                                    } else if (isTentItem) {
                                                        return (
                                                            <CartTent key={index} data={product} descriptionLines={descriptionLines} readOnly={true} addToCartButtonLabel={addToCartButtonLabel} showAddToCart={true}/>
                                                        )
                                                    } else {
                                                        return (
                                                            <CartNormal key={index} data={product} readOnly={true} showAddToCart={true} addToCartButtonLabel={addToCartButtonLabel} />
                                                        )
                                                    };
                                                })}
                                                <div className='w-full flex flex-col gap-y-[24px] justify-center items-center'>
                                                    <button
                                                        disabled={loading}
                                                        onClick={handleOrderAgainClick}
                                                        className={`mt-[39px] w-full h-[150px] max-lg:h-[90px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative flex items-center justify-center`}
                                                        aria-label="Load more quotes"
                                                    >
                                                        <span className='font-haasRegular uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                                            {loading ? "PLEASE WAIT..." : (addAllItemsButtonLabel || "Add all items to cart")}
                                                        </span>
                                                        <svg
                                                            className='rotate-45 size-[13px] group-hover:w-4 transition-all duration-300 ease-in-out absolute right-[26.3px] text-secondary-alt group-hover:text-white hidden max-lg:block'
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 10.665 10.367"
                                                            aria-hidden="true"
                                                        >
                                                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                                            </g>
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={onClose}
                                                        disabled={loading}
                                                        className={` w-full h-[150px] max-lg:h-[90px] bg-transparent border border-primary-border tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary relative flex items-center justify-center `}
                                                        aria-label="Load more quotes"
                                                    >
                                                        <span className='font-haasRegular uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                                            {backToQuoteButtonLabel || 'back to quotes'}
                                                        </span>

                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};