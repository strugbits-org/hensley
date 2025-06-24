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
import { FiPlus } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { uploadRelevantImage } from '@/services/poolcover';
import { AddToCartButton } from '../Product/AddtoQuoteButton';
import parse from 'html-react-parser';

// Validation schema
const schema = yup.object({
    approxSize: yup.string().required('Approximate size is required'),
    coverType: yup.string().nullable(),
    poolEdge: yup.string().nullable(),
}).required();

export const AddToQuoteForm = ({ title, productData }) => {

    const [formData, setFormData] = useState({
        approxSize: '',
        coverType: null,
        poolEdge: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectWithLoader = useRedirectWithLoader();
    const [cookies, setCookie] = useCookies(["cartQuantity"]);
    const [relevantImages, setRelevantImages] = useState([]);
    const [uploading, setUploading] = useState(false);

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
            const images = relevantImages.map(x => x.src);

            const cartData = {
                lineItems: [{
                    catalogReference: {
                        appId,
                        catalogItemId: productId,
                        options: {
                            customTextFields: {
                                "PLEASE SHARE THE APPROX. SIZE OF THE AREA YOUR POOL IS": data.approxSize?.toUpperCase() || "-",
                                "HOW IS YOUR POOL EDGE?": data.poolEdge?.toUpperCase() || "-",
                                "HOW MUCH OF THE POOL ARE YOU LOOKING TO COVER?": data.coverType?.toUpperCase() || "-",
                                "RELEVENT IMAGES": images.join("~~"),
                                "POOLCOVER": "true"
                            }
                        },
                    },
                    quantity: 1,
                }]
            };

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

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const fileData = e.target.files[0];
            if (!fileData) return;
            const response = await uploadRelevantImage(fileData);
            const { file } = response;
            const image = {
                id: file.id,
                src: file.url,
            }
            setRelevantImages(prev => [...prev, image]);
        } catch (error) {
            logError("Error uploading image", error.message);
        } finally {
            setUploading(false);
        }
    };
    const handleRemoveImage = (imageId) => {
        setRelevantImages(prev => prev.filter(image => image.id !== imageId));
    };

    return (
        <>
            <div className='lg:max-w-[656px] sm:max-w-[492px] h-full overflow-y-scroll hide-scrollbar'>
                <span className='text-secondary-alt 
                    lg:text-[16px]
                    text-[12px]
                    uppercase font-haasLight'>Home/corporate</span>
                <h3 className='uppercase text-secondary-alt font-recklessRegular 
                    lg:text-[90px] 
                    lg:leading-[85px]
                    text-[35px]
                    leading-[30px]
                    '>{title}</h3>

                <div className="font-haasRegular lg:text-[16px] lg:leading-[19px] text-[14px] leading-[17px] text-secondary-alt">
                    {parse(productData?.description || '')}
                </div>
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
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-4">PLEASE SHARE ANY RELEVANT VENUE OR INSPIRATION IMAGES</span>
                            <div className='w-full min-w-48 lg:min-w-72 uppercase tracking-widest hover:font-bold [word-spacing:3px] text-sm transition-all duration-300'>
                                <span className='flex justify-center items-center w-full bg-primary tracking-[6px] hover:tracking-[10px] transform transition-all duration-300 hover:bg-secondary-alt hover:text-primary text-[16px] leading-[19px] font-haasRegular h-[45px]'>
                                    <span>{uploading ? "Uploading..." : "Upload File"}</span> {!uploading && <FiPlus className='size-5 ml-2' />}
                                </span>
                            </div>
                        </label>
                        <input
                            onChange={handleImageUpload}
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            disabled={isSubmitting || uploading}
                        />
                    </div>
                    <div className={`lg:col-span-4 col-span-2 grid grid-cols-5 gap-2 ${relevantImages.length === 0 ? 'hidden' : ''}`}>
                        {relevantImages.map((image) => (
                            <div key={image.id} className="group relative col-span-1 h-[120px] cursor-pointer p-2 bg-white ">
                                <MdClose onClick={() => handleRemoveImage(image.id)} className="size-5 absolute top-2 right-2 text-secondary z-10 hover:scale-125 transition-all duration-200" />
                                <img src={image.src} className="h-full w-full object-contain" />
                            </div>
                        ))}
                    </div>
                </form>
            </div>
            <AddToCartButton onClick={handleSubmit(onSubmit)} classes={'lg:!h-[200px] lg:!mt-3'} text={isSubmitting ? "Please wait..." : "add to quote"} disabled={isSubmitting} />
        </>
    );
};