import React from 'react';
import { PrimaryImage } from './PrimaryImage';
import { CopyIcon } from './helpers/CopyIcon';
import { copyToClipboard } from '@/utils';
import { CustomLink } from './CustomLink';
import { SaveProductButton } from './SaveProductButton';
import { lightboxActions } from '@/store/lightboxStore';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { loaderActions } from '@/store/loaderStore';

function ProductCard({ data, type = 'listing', savedProducts = [], setSavedProducts, btnClass }) {
    const { product } = data;
    const { name } = product;
    const isTent = data?.categories?.includes("d27f504d-05a2-ec30-c018-cc403e815bfa") || false;
    const redirectWithLoader = useRedirectWithLoader();

    const handleAddToCart = () => {
        if (isTent) {
            loaderActions.show();
            redirectWithLoader(`/tent/${product.slug}`);
            return;
        };
        lightboxActions.setAddToCartModal({ open: true, productData: data });
    };

    return (
        <div className={`relative w-full group transition-all duration-300 ease-in-out border border-primary-border flex flex-col p-2 justify-between max-lg:h-full h-[620px] ${type !== 'listing' ? 'bg-primary-alt col-span-1.5 md:col-span-2' : ''}`}>
            <CustomLink to={`/product/${product.slug}`} className={`h-full overflow-hidden flex justify-center items-center p-10 ${type === 'listing' ? 'bg-white' : ''}`}>
                <PrimaryImage timeout={50} alt={name} url={product.mainMedia} fit='fit' customClasses={"min-h-[217px] md:min-h-[263px] 2xl:min-h-[515px] max-h-[550px] h-full w-full  transition-transform duration-300 group-hover:scale-105"} />
            </CustomLink>

            <div className="flex max-w-full flex-wrap pl-[23px] lg:gap-y-[15px] pt-2 lg:pt-6 ">
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
                        className={`${btnClass} w-full 2xl:w-auto min-w-[151px] flex items-center justify-between 2xl:justify-center bg-primary px-4 py-3 gap-x-7`}
                        onClick={handleAddToCart}
                    >
                        <span className="uppercase font-haasRegular text-[12px]">add to cart</span>
                        <svg className='rotate-45 size-3 group-hover:scale-125 transition-all duration-300 ease-in-out' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.665 10.367">
                            <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                                <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="#2c2216" strokeMiterlimit="10" strokeWidth="1" />
                            </g>
                        </svg>
                    </button>
                </div>
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

export default ProductCard;