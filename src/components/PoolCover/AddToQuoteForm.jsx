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

// Validation schema
const schema = yup.object({
    approxSize: yup.string().required('Approximate size is required'),
    coverType: yup.string().nullable(),
    poolEdge: yup.string().nullable()
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

            <AddToQuote
                handleClick={handleSubmit(onSubmit)}
                classes={"col-span-4"}
                text={isSubmitting ? "Please wait..." : "add to quote"}
                disabled={isSubmitting}
            />
        </form>
    );
};