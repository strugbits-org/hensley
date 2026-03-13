
import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { CopyIcon } from './helpers/CopyIcon';
import { copyToClipboard } from '@/utils';
import { CustomLink } from './CustomLink';
import { SaveProductButton } from './SaveProductButton';
import { lightboxActions } from '@/store/lightboxStore';
import { actions } from '@/store';
import Image from 'next/image';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL;

function ProductCard({ data: product, type = 'listing', btnClass }) {
    console.log("product", product);
    const { title } = product;

    

    const handleAddToCart = () => {
        const isTent = actions.isTentProduct(product._id);
        lightboxActions.setAddToCartModal({ open: true, type: isTent ? 'tent' : 'product', productData: data });
    };

    return (
        <div className={`relative w-full group transition-all duration-300 ease-in-out border border-primary-border flex flex-col p-2 justify-between max-lg:h-full h-[620px] ${type !== 'listing' ? 'bg-primary-alt col-span-1.5 md:col-span-2' : ''}`}>
            <CustomLink to={`/product/${product.slug}`} className={`h-[217px] lg:h-full overflow-hidden flex justify-center items-center p-2 lg:p-14 ${type === 'listing' ? 'bg-white' : 'min-h-[450px]'}`}>
                <Image src={ CORE_API_BASE_URL + product.mainMedia.url} alt={title} width={500} height={500} className={"aspect-square min-h-[217px] md:min-h-[263px] 2xl:min-h-[515px] max-h-[550px] h-full w-full transition-transform duration-300 group-hover:scale-105 flex-shrink-0 object-contain"} />
            </CustomLink>

            <div className="flex max-w-full flex-wrap lg:pl-[23px] lg:gap-y-[15px] pt-2 lg:pt-6 ">
                <h2 className={`uppercase lg:text-[18px] lg:leading-[20px] text-secondary-alt font-haasRegular ${type === 'listing' ? 'text-xs leading-tight ' : ''}`}>
                    {title}
                </h2>

                <div className="mt-1 w-full flex flex-col 2xl:flex-row justify-between items-center gap-4">
                    <div className={`2xl:w-2/3 w-full grow lg:flex-row justify-start flex-wrap items-center gap-2 ${type === 'listing' ? 'hidden lg:flex ' : 'flex'}`}>
                        {product.sku && (
                            <div onClick={() => copyToClipboard(product.sku)} className="flex justify-center items-center">
                                <span className="text-[12px] text-secondary-alt mr-[8px] word-break">{product.sku}</span>
                                <CopyIcon />
                            </div>
                        )}
                        {/* {product.additionalInfoSections?.map((data, index) => {
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
                        })} */}
                    </div>

                    <button
                        className={`${btnClass} w-full 2xl:w-auto min-w-[151px] flex items-center justify-between 2xl:justify-center bg-primary lg:px-4 lg:py-3 gap-x-7 ${type === 'listing' ? 'p-2' : 'px-4 py-3'}`}
                        onClick={handleAddToCart}
                    >
                        <span className="uppercase font-haasRegular text-[12px]">add to cart</span>
                        <svg className='rotate-45 size-2 lg:size-3 group-hover:scale-125 transition-all duration-300 ease-in-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            {/* <SaveProductButton
                key={product._id}
                productData={data}
            /> */}
        </div>
    );
}

export default ProductCard;