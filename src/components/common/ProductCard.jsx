import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { CopyIcon } from './helpers/CopyIcon';
import { copyToClipboard } from '@/utils';

function ProductCard({ data, onAddToCart, type = 'listing' }) {
    const { product } = data;
    const { name } = product;
    return (
        <div className={`max-w-[450px] relative group transition-all duration-300 ease-in-out border border-primary-border flex flex-col p-2 justify-between h-full ${type !== 'listing' ? 'bg-white' : ''}`}>
            <div className={`aspect-[0.84] max-w-[436px] overflow-hidden flex justify-center items-center ${type === 'listing' ? 'bg-white' : ''}`}>
                <PrimaryImage timeout={0} alt={name} url={product.mainMedia} fit='fit' customClasses={"min-w-1/2 transition-transform duration-300 group-hover:scale-105"} />
            </div>

            <div className="max-w-full flex-wrap pt-2 lg:pt-6 lg:pb-2">
                <h2 className="uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular">
                    {name}
                </h2>

                <div className="mt-1 w-full flex flex-col 2xl:flex-row justify-between items-center gap-4">
                    <div className='2xl:w-2/3 w-full grow flex lg:flex-row justify-start flex-wrap items-center gap-2'>
                        {product.sku && (
                            <div onClick={() => copyToClipboard(product.sku)} className="flex justify-center items-center">
                                <span className="text-[12px] text-secondary-alt mr-[8px] word-break">{product.sku}</span>
                                <CopyIcon />
                            </div>
                        )}
                        {product.additionalInfoSections?.map((data, index) => {
                            const { title, description } = data;
                            if (title == "Size") {
                                return (
                                    <div
                                        className="text-[12px] grow text-center text-secondary-alt"
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    ></div>
                                );
                            }
                        })}
                    </div>

                    <button
                        className="w-full 2xl:w-auto group bg-primary flex items-center max-lg:px-[10px] 2xl:justify-evenly gap-2 lg:h-[42px] h-[32px] justify-between pl-[25px] pr-[13px] group/button min-w-[151px]"
                        onClick={onAddToCart}
                    >
                        <span className="uppercase font-haasRegular text-[12px]">add to cart</span>
                        <svg className='rotate-45 size-3 group-hover:w-4 transition-all duration-300 ease-in-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="group/cart absolute right-[24px] top-[23px] border border-secondary-alt rounded-full w-[56px] h-[56px] flex items-center justify-center shrink-0 cursor-pointer">
                <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg" alt="Cart Icon" customClasses={"block group-hover/cart:hidden"} />
                <PrimaryImage url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg" alt="Cart Icon" customClasses={"hidden group-hover/cart:block"} />
            </div>

        </div>
    );
}

export default ProductCard;
