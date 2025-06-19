import React, { useState } from 'react';
import { CheckBox } from './CheckBox';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError } from '@/utils';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';
import { AddToQuote } from '../Product-Tent/AddtoQuoteButton';
import { PrimaryButton } from '../common/PrimaryButton';
import { FiPlus } from 'react-icons/fi';
import { PrimaryImage } from '../common/PrimaryImage';

// Validation schema
const schema = yup.object({
    approxSize: yup.string().required('Approximate size is required'),
    coverType: yup.string().nullable(),
    poolEdge: yup.string().nullable(),
}).required();

export const AddToQuoteForm = ({ productData }) => {

    const [formData, setFormData] = useState({
        approxSize: '',
        coverType: null,
        poolEdge: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectWithLoader = useRedirectWithLoader();
    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const [relevantImages, setRelevantImages] = useState(["https://static.wixstatic.com/media/339f77_a59ba2740b2f4b009f7411826e26036a~mv2.jpg/v1/fill/w_755,h_3991,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/compress.webp", "https://static.wixstatic.com/media/339f77_b7b312f56eaa43c39a54937f4aef9c43~mv2.jpg/v1/fill/w_755,h_3991,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/compress.webp"]);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setValue(field, value);
        trigger(field);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const productId = productData._id;
            const appId = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
            const cartData = {
                lineItems: [{
                    catalogReference: {
                        appId,
                        catalogItemId: productId,
                        options: {
                            customTextFields: {
                                "PLEASE SHARE THE APPROX. SIZE OF THE AREA YOUR POOL IS": data.approxSize.toUpperCase(),
                                "HOW IS YOUR POOL EDGE?": data.poolEdge.toUpperCase(),
                                "HOW MUCH OF THE POOL ARE YOU LOOKING TO COVER?": data.coverType.toUpperCase(),
                                "POOLCOVER": "true"
                            }
                        },
                    },
                    quantity: 1,
                }]
            };

            // console.log("cartData", cartData);
            // setIsSubmitting(false);
            // return;


            await AddProductToCart(cartData);
            const total = (cookies.cartQuantity || 0) + 1;
            setCookie("cartQuantity", total, { path: "/" });
            setTimeout(() => {
                reset();
            }, 1000);
            redirectWithLoader("/cart");

        } catch (error) {
            logError("Error while adding item to cart:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full grid grid-cols-2 justify-between gap-x-[24px] gap-y-[39px] mt-[20px]'>
            <span className='lg:col-span-4 
               col-span-2
               uppercase
               font-recklessRegular
               text-[30px] 
               leading-[30px] 
               text-secondary-alt'>Please fill the bellow RFP form & A tenting Specialist will provide a custom quote</span>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">PLEASE SHARE THE APPROX. SIZE OF THE AREA YOU YOUR POOL IS</label>
                <textarea
                    {...register('approxSize')}
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('approxSize', e.target.value)}
                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    rows={4}
                    disabled={isSubmitting}
                ></textarea>
            </div>

            <CheckBox
                data={{ label: "HOW IS YOUR POOL EDGE?", options: ["FLAT", "RAISED"] }}
                type="radio"
                value={formData.poolEdge}
                onChange={(newState, index, optionText) => handleInputChange('poolEdge', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "HOW MUCH OF THE POOL ARE YOU LOOKING TO COVER?", options: ["ENTIRE POOL", "PARTIAL POOL COVERING"] }}
                type="radio"
                value={formData.coverType}
                onChange={(newState, index, optionText) => handleInputChange('coverType', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <div className='lg:col-span-4 col-span-2'>
                <label for="file-upload" className="cursor-pointer">
                    <span className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-4">PLEASE SHARE ANY RELEVANT VENUE OR INSPIRATION IMAGES</span>
                    <div className='w-full min-w-48 lg:min-w-72 uppercase tracking-widest hover:font-bold [word-spacing:3px] text-sm transition-all duration-300'>
                        <span className='flex justify-center items-center w-full bg-primary tracking-[6px] hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary text-[16px] leading-[19px] font-haasRegular h-[45px]'>
                            <span>Upload File</span> <FiPlus className='size-5 ml-2' />
                        </span>
                    </div>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    disabled={isSubmitting}
                />
            </div>
            <div className='lg:col-span-4 col-span-2 grid grid-cols-5 gap-2'>
                {relevantImages.map((image, index) => (
                    <div key={index} className="mb-4 col-span-1 h-[120px] w-[120px]">
                        <PrimaryImage url={image} fit={'fit'} customClasses="h-full w-full object-contain object-center" />
                    </div>
                ))}
            </div>

            <AddToQuote
                handleClick={handleSubmit(onSubmit)}
                classes={"col-span-4"}
                text={isSubmitting ? "Please wait..." : "add to quote"}
                disabled={isSubmitting}
            />
        </form>
    );
};