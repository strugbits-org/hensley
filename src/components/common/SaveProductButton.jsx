import React, { useState } from 'react'
import { PrimaryImage } from './PrimaryImage';
import { toast } from 'sonner';
import { saveProduct, unSaveProduct } from '@/services/products';

export const SaveProductButton = ({ productData, savedProducts, setSavedProducts, type = "primary" }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const isProductSaved = savedProducts.some(savedProduct => savedProduct._id === productData._id);

    const handleSaveToggle = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        const wasProductSaved = isProductSaved;

        if (wasProductSaved) {
            setSavedProducts(prevSaved => prevSaved.filter(savedProduct => savedProduct._id !== productData._id));
        } else {
            setSavedProducts(prevSaved => [...prevSaved, productData]);
        }

        try {
            const productId = productData.product._id;
            if (wasProductSaved) {
                await unSaveProduct(productId);
            } else {
                await saveProduct(productId);
            }
        } catch (error) {
            if (wasProductSaved) {
                setSavedProducts(prevSaved => [...prevSaved, productData]);
            } else {
                setSavedProducts(prevSaved => prevSaved.filter(savedProduct => savedProduct._id !== productData._id));
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
            className={`lg:flex hidden group/cart absolute right-[24px] top-[23px] border border-secondary-alt rounded-full items-center justify-center shrink-0 cursor-pointer transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${type === 'primary' ? 'w-[56px] h-[56px]' : 'w-[36px] h-[36px]'}`}
            onClick={handleSaveToggle}
            role="button"
            aria-label={isProductSaved ? "Remove from saved products" : "Save product"}
            aria-disabled={isUpdating}
        >
            <PrimaryImage
                url={isProductSaved ? savedUrl : unSavedUrl}
                alt={isProductSaved ? "Saved Icon" : "Not Saved Icon"}
                customClasses={`block ${isUpdating ? '' : 'group-hover/cart:hidden'} ${type === 'primary' ? 'w-[13px] h-[20px]' : 'w-[8px] h-[12px]'}`}
            />

            <PrimaryImage
                url={isProductSaved ? unSavedUrl : savedUrl}
                alt={isProductSaved ? "Not Saved Icon" : "Saved Icon"}
                customClasses={`hidden ${isUpdating ? '' : 'group-hover/cart:block'} ${type === 'primary' ? 'w-[13px] h-[20px]' : 'w-[8px] h-[12px]'}`}
            />
        </div>
    );
};