import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { SaveProductButton } from './SaveProductButton';

function SecondaryProductCard({ data, onAddToCart, savedProducts, setSavedProducts, type = 'listing' }) {
    const { product } = data;
    const { name } = product;
    return (
        <div className={`relative w-full group transition-all duration-300 ease-in-out border border-primary-border flex flex-col p-[5px] pb-0 justify-between h-full ${type !== 'listing' ? 'bg-white col-span-1.5 md:col-span-2' : ''}`}>
            <div className={`h-full overflow-hidden flex justify-center items-center  ${type === 'listing' ? 'bg-white' : ''}`}>
                <PrimaryImage timeout={50} alt={name} url={product.mainMedia} fit='fit' customClasses={" w-full aspect-[0.849] object-contain transition-transform duration-300 group-hover:scale-105"} />
            </div>

            <div className="max-w-full flex gap-2 py-[7px] justify-between items-center max-lg:flex-col">
                <h2 className="uppercase lg:text-[12px] lg:leading-[12px] text-secondary-alt font-haasRegular max-lg:w-full max-lg:text-xs max-w-sm">
                    {name}
                </h2>

                <button
                    className="min-w-[125px] group bg-primary flex items-center max-lg:px-[10px] 2xl:justify-evenly gap-2 lg:h-[27px] h-[32px] justify-between group/button pt-[6px] pr-[10px] pb-[7px] pl-[15px] max-lg:w-full max-lg:mt-[11px] max-lg:text-xs"
                    onClick={onAddToCart}
                >
                    <span className="uppercase font-haasRegular text-[12px] ">add to cart</span>
                    <svg className='rotate-45 size-[6px] group-hover:w-4 transition-all duration-300 ease-in-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                        <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                            <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                        </g>
                    </svg>
                </button>
            </div>

            <SaveProductButton
                key={product._id}
                productData={data}
                savedProducts={savedProducts}
                setSavedProducts={setSavedProducts}
            />
        </div>
    );
}

export default SecondaryProductCard;
