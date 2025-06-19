import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import image from '@/assets/small-tent.png';
import { PrimaryImage } from '../common/PrimaryImage';
import { calculateTotalCartQuantity, formatDescriptionLines, formatTotalPrice, logError } from '@/utils';
import { lightboxActions } from '@/store/lightboxStore';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';

const INFO_HEADERS = [
    'Product',
    'Size',
    'Price',
    'Quantity'
];

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const QuantityControls = ({ quantity, onQuantityChange, readOnly }) => (
    <div className="border-b border-black pb-1 flex items-center justify-center gap-x-[30px] font-haasRegular">
        {!readOnly ? (
            <>
                <button
                    className="select-none text-xl font-light hover:opacity-70 transition-opacity"
                    onClick={() => onQuantityChange(quantity - 1)}
                    disabled={quantity <= QUANTITY_LIMITS.MIN}
                    aria-label="Decrease quantity"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="1" viewBox="0 0 15 1">
                        <line id="Line_460" data-name="Line 460" x1="15" transform="translate(15 0.5) rotate(180)" fill="none" stroke="#000" strokeWidth="1" />
                    </svg>
                </button>
                <input
                    className="font-bold bg-transparent max-w-[60px] outline-none text-center appearance-none"
                    type="number"
                    min={QUANTITY_LIMITS.MIN}
                    max={QUANTITY_LIMITS.MAX}
                    value={quantity}
                    onInput={(e) => onQuantityChange(parseInt(e.target.value) || QUANTITY_LIMITS.MIN, true)}
                    aria-label="Quantity"
                />
                <button
                    className="select-none text-xl font-light hover:opacity-70 transition-opacity"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={quantity >= QUANTITY_LIMITS.MAX}
                    aria-label="Increase quantity"
                >
                    <svg id="Group_3960" data-name="Group 3960" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                        <line id="Line_1" data-name="Line 1" y2="15" transform="translate(7.5 15) rotate(180)" fill="none" stroke="#000" strokeWidth="1" />
                        <line id="Line_2" data-name="Line 2" x1="15" transform="translate(15 7.5) rotate(180)" fill="none" stroke="#000" strokeWidth="1" />
                    </svg>

                </button></>
        ) : (
            <input
                className="font-bold bg-transparent max-w-[60px] outline-none text-center appearance-none"
                type="number"
                value={quantity}
                aria-label="Quantity"
                readOnly
            />
        )}
    </div>
);

const renderTableRows = ({ productInfoSection, quantity, handleQuantityChange, readOnly }) => {
    return productInfoSection.map((item, index) => (
        <tr key={`item-${index}`}>
            <td className="py-2 font-semibold lg:block hidden">{item.product}</td>
            <td className="font-haasRegular text-center ">{item.size}</td>
            <td className="text-center font-haasRegular">{item.formattedPrice}</td>
            <td className="font-haasRegular w-[114px]">
                <QuantityControls
                    quantity={quantity || item.quantity}
                    onQuantityChange={(value, isDisabled) => handleQuantityChange(value, item._id || item.product, isDisabled)}
                    readOnly={readOnly}
                />
            </td>
        </tr>
    ));
};

const CartTent = ({ data, descriptionLines, actions = {}, readOnly = false, showAddToCart = false }) => {
    const { removeProduct } = actions;

    const productName = data?.productName?.original || data?.name;
    const systemFields = ["POOLCOVER", "RELEVENT IMAGES"];

    return (
        <div className='border px-[15px] py-[14px] flex w-full gap-x-[39px] relative'>
            <div className='h-[104px] w-[104px] bg-white'>
                <PrimaryImage url={data?.image || data?.mediaItem?.src} alt={productName} customClasses='h-full w-full object-contain' />
            </div>
            <div className='flex lg:flex-row flex-col lg:items-center'>
                <div>
                    <span className='block text-[16px] text-secondary-alt font-haasLight uppercase'>Product</span>
                    <span className='block text-[16px] text-secondary-alt font-haasRegular uppercase lg:mt-[21px] lg:mb-[27px]'>{productName}</span>
                    <div className='grid sm:grid-cols-2 grid-cols-1 gap-x-[26px] gap-y-[4px]'>
                        {descriptionLines.map(({ title, value }) => systemFields.includes(title) ? null : (
                            <div key={title}>
                                <span className='text-[12px] text-secondary-alt font-haasBold uppercase mr-[20px]'>{title}</span>
                                <span className='text-[12px] text-secondary-alt font-haasLight uppercase'>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {!readOnly && (
                <button onClick={() => removeProduct([data._id])} className='absolute right-[24px] sm:top-[50px] top-[15px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                        <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                            <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                            <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                        </g>
                    </svg>
                </button>
            )}
        </div>
    );
};

const CartCollection = ({ data, actions = {}, readOnly = false, showAddToCart = false }) => {
    const { removeProduct, handleQuantityChange } = actions;
    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const [isLoading, setIsLoading] = useState(false);

    const productName = data?.productName?.original || data?.name;

    const productInfoSection = data.productSetItems.map(item => {
        const set = item.split("~");
        const price = parseInt(set[2]);
        const quantity = parseInt(set[3]);

        return {
            product: set[0],
            size: set[1],
            price,
            quantity,
            formattedPrice: formatTotalPrice(price),
        }
    });

    const price = useMemo(() =>
        productInfoSection.reduce((acc, { price, quantity }) => acc + (price * quantity), 0),
        [productInfoSection]
    );
    const formattedPrice = formatTotalPrice(price);

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);
            let catalogReference = data?.catalogReference;
            if (!catalogReference) {
                const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
                const { customTextFields = [], productId } = data;
                const customTextFieldsData = customTextFields.reduce((acc, { title, value }) => {
                    acc[title] = value;
                    return acc;
                }, {});
                customTextFieldsData.size = data.size;
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
                quantity: data.quantity,
            };

            const cartData = {
                lineItems: [product],
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
            setIsLoading(false);
        }
    }

    return (
        <div className='border px-[15px] py-[14px] flex w-full gap-x-[39px] relative'>
            <div className='
            h-[104px]
            w-[104px]
            min-w-[50px]
           bg-white
            '>
                <PrimaryImage url={data?.image || data?.mediaItem.src} alt={productName} customClasses='h-full w-full object-contain' />
            </div>
            <div className='w-full lg:flex justify-between items-center'>
                <div className='w-full flex flex-col'>
                    <div className='sm:flex justify-between items-center sm:h-[104px]'>
                        <span className='block lg:text-[16px] text-[20px] font-medium text-secondary-alt font-haasRegular uppercase lg:mt-[21px] lg:mb-[27px]'>{productName}</span>
                        <span className='block lg:text-[16px] text-[20px] text-secondary-alt font-haasRegular uppercase lg:mt-[21px] lg:mb-[27px] mr-[100px]'>{formattedPrice}</span>
                    </div>
                    <table className="lg:max-w-[766px] max-w-full w-full text-left border-separate border-spacing-y-[15px] ">
                        <thead>
                            <tr className="text-xs uppercase text-gray-500">
                                {INFO_HEADERS.map((title, index) => (
                                    <th
                                        key={title}
                                        className={`font-light pb-2 w-1/4 max-lg:hidden text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows({ handleQuantityChange, productInfoSection: productInfoSection, readOnly })}
                        </tbody>
                    </table>
                </div>

                {showAddToCart && <button onClick={handleAddToCart} disabled={isLoading} className='min-w-[120px] bg-primary uppercase font-haasRegular text-[12px] flex px-3 py-2 gap-x-[10px] justify-center items-center'>
                    <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7.169" height="6.855" viewBox="0 0 7.169 6.855">
                        <g id="Group_3746" data-name="Group 3746" transform="translate(0.314 0.426)">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(0 0)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H6.355V6.355" transform="translate(0 0.074)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="6.326" y2="5.971" transform="translate(0.029 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </g>
                    </svg>
                </button>
                }
            </div>
            {!readOnly && (
                <button onClick={() => removeProduct([data._id])} className='absolute right-[24px] sm:top-[35px] top-[15px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                        <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                            <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                            <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                        </g>
                    </svg>
                </button>
            )}
        </div>
    )
}

const CartNormal = ({ data, actions = {}, readOnly = false, showAddToCart = false }) => {
    const { removeProduct, handleQuantityChange } = actions;
    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const [isLoading, setIsLoading] = useState(false);
    const productName = data?.productName?.original || data?.name;

    const productSize = () => {
        if (!data.descriptionLines) return data.size;
        const formattedDescription = formatDescriptionLines(data.descriptionLines);
        return formattedDescription.find(x => x.title === "size")?.value;
    }
    const price = (data?.price?.amount || data.price) * data.quantity;
    const formattedPrice = formatTotalPrice(price);

    const productInfoSection = [
        {
            product: productName,
            price: data?.price?.amount || data?.price,
            size: productSize(),
            formattedPrice: data?.fullPrice?.formattedAmount || formatTotalPrice(data.price),
            _id: data._id
        }
    ]

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);
            let catalogReference = data?.catalogReference;
            if (!catalogReference) {
                const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
                const { customTextFields = [], productId } = data;
                const customTextFieldsData = customTextFields.reduce((acc, { title, value }) => {
                    acc[title] = value;
                    return acc;
                }, {});
                customTextFieldsData.size = data.size;
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
                quantity: data.quantity,
            };

            const cartData = {
                lineItems: [product],
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
            setIsLoading(false);
        }
    }

    return (
        <div className='sm:border-t border-b border-primary-border px-[15px] lg:py-[14px] max-sm:py-[14px] w-full gap-x-[39px] relative items-center flex '>
            <div className='
            h-[104px]
            w-[104px]
            min-w-[50px]
           bg-white
            '>
                <PrimaryImage url={data?.image || data?.mediaItem.src} alt={productName} customClasses='h-full w-full object-contain' />
            </div>
            <div className='w-full lg:flex justify-between items-center'>
                <div className='sm:flex lg:hidden justify-between items-center sm:h-[104px]'>
                    <span className='block 
                lg:text-[16px]
                text-[20px]
                 text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                lg:mb-[27px]
                '>{productName}</span>

                    <span className='block lg:text-[16px] text-[20px] text-secondary-alt font-haasRegular uppercase
                lg:mt-[21px]
                lg:mb-[27px]
                mr-[100px]
                '>{data.price.amount || data.price}</span>
                </div>
                <table className="max-lg:border-b max-lg:mb-4 border-primary-border lg:max-w-[766px] md:max-w-[60%] max-w-full w-full text-left lg:border-separate lg:border-spacing-y-[15px] border-spacing-y-[12px] xl:pr-[30px] lg:pr-[50px] ">
                    <thead>
                        <tr className="text-xs uppercase text-gray-500 ">
                            {INFO_HEADERS.map((title, index) => (
                                <th
                                    key={title}
                                    className={`font-light pb-2 w-1/4 max-lg:hidden text-[16px] uppercase font-haasLight text-secondary-alt ${index === 0 ? 'text-left' : 'text-center'}`}
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows({ handleQuantityChange, quantity: data.quantity, productInfoSection: productInfoSection, readOnly })}
                    </tbody>
                </table>
                <span className='lg:block mr-[100px] hidden sm:text-[16px] text-[20px] text-secondary-alt font-haasRegular uppercase lg:mt-[21px] sm:mb-[27px] '>{formattedPrice}</span>

                {showAddToCart && <button onClick={handleAddToCart} disabled={isLoading} className='lg:flex hidden min-w-[120px] bg-primary uppercase font-haasRegular text-[12px] px-3 py-2 gap-x-[10px] justify-center items-center'>
                    <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7.169" height="6.855" viewBox="0 0 7.169 6.855">
                        <g id="Group_3746" data-name="Group 3746" transform="translate(0.314 0.426)">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(0 0)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H6.355V6.355" transform="translate(0 0.074)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="6.326" y2="5.971" transform="translate(0.029 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </g>
                    </svg>
                </button>}
            </div>
            {!readOnly && (
                <button onClick={() => removeProduct([data._id])} className='absolute right-[24px] sm:top-[35px] top-[15px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24.707" height="24.707" viewBox="0 0 24.707 24.707">
                        <g id="Group_3737" data-name="Group 3737" transform="translate(-473.646 -948.646)">
                            <line id="Line_259" data-name="Line 259" x2="24" y2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                            <line id="Line_260" data-name="Line 260" y1="24" x2="24" transform="translate(474 949)" fill="none" stroke="#fe120d" strokeWidth="1" />
                        </g>
                    </svg>
                </button>
            )}
        </div>
    )
}

export { CartTent, CartCollection, CartNormal }