import React, { useState } from 'react'
import { PrimaryImage } from './PrimaryImage';
import { toast } from 'sonner';
import { saveProduct, unSaveProduct } from '@/services/products';
import { useCookies } from 'react-cookie';
import { lightboxActions } from '@/store/lightboxStore';
import { useSnapshot } from 'valtio';
import { actions, states } from '@/store';

export const SaveProductButton = ({ productData, type = "primary" }) => {
    const { savedProducts } = useSnapshot(states);
    const [isUpdating, setIsUpdating] = useState(false);

    const savedProductsList = Array.isArray(savedProducts) ? savedProducts : [];

    // Get the actual product ID for comparison - handle both nested and flat structures
    const currentProductId = productData.product?._id || productData.product?.id || productData._id;
    const isProductSaved = savedProductsList.some(savedProduct => {
        // Handle both object { product: { _id } } and string { product: "id" } formats
        const savedProductId = typeof savedProduct.product === 'string'
            ? savedProduct.product
            : (savedProduct.product?._id || savedProduct.product?.id || savedProduct._id);
        return savedProductId === currentProductId;
    });
    const [cookies, _setCookie] = useCookies(["authToken"]);

    const handleSaveToggle = async () => {
        if (!cookies.authToken) {
            lightboxActions.showLightBox("login");
            return;
        };
        if (isUpdating) return;

        setIsUpdating(true);
        const wasProductSaved = isProductSaved;

        // Optimistic update
        if (wasProductSaved) {
            actions.setSavedProducts(savedProductsList.filter(savedProduct => {
                const savedProductId = typeof savedProduct.product === 'string'
                    ? savedProduct.product
                    : (savedProduct.product?._id || savedProduct.product?.id || savedProduct._id);
                return savedProductId !== currentProductId;
            }));
        } else {
            actions.setSavedProducts([...savedProductsList, productData]);
        }

        try {
            const productId = productData.product?._id || productData.product?.id || productData._id;
            if (!productId) {
                throw new Error("Product ID not found");
            }
            if (wasProductSaved) {
                await unSaveProduct(productId);
            } else {
                await saveProduct(productId);
            }
        } catch (error) {
            // Revert on error
            if (wasProductSaved) {
                actions.setSavedProducts([...savedProductsList, productData]);
            } else {
                actions.setSavedProducts(savedProductsList.filter(savedProduct => {
                    const savedProductId = typeof savedProduct.product === 'string'
                        ? savedProduct.product
                        : (savedProduct.product?._id || savedProduct.product?.id || savedProduct._id);
                    return savedProductId !== currentProductId;
                }));
            }
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // Icon URLs
    const unSavedUrl = "https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg";
    const savedUrl = "https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg";

    return (
        <div
            className={`flex group/cart absolute right-[24px] top-[23px] border border-secondary-alt rounded-full items-center justify-center shrink-0 cursor-pointer transition-colors w-[36px] h-[36px] ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${type === 'primary' ? 'lg:w-[56px] lg:h-[56px]' : ''}`}
            onClick={handleSaveToggle}
            role="button"
            aria-label={isProductSaved ? "Remove from saved products" : "Save product"}
            aria-disabled={isUpdating}
        >
            <PrimaryImage
                url={isProductSaved ? savedUrl : unSavedUrl}
                alt={isProductSaved ? "Saved Icon" : "Not Saved Icon"}
                customClasses={`block w-[8px] h-[12px] ${isUpdating ? '' : 'group-hover/cart:hidden'} ${type === 'primary' ? 'lg:w-[13px] lg:h-[20px]' : ''}`}
            />

            <PrimaryImage
                url={isProductSaved ? unSavedUrl : savedUrl}
                alt={isProductSaved ? "Not Saved Icon" : "Saved Icon"}
                customClasses={`hidden w-[8px] h-[12px] ${isUpdating ? '' : 'group-hover/cart:block'} ${type === 'primary' ? 'lg:w-[13px] lg:h-[20px]' : ''}`}
            />
        </div>
    );
};
