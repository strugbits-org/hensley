import React, { useState } from 'react';
import { CheckBox } from './CheckBox';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError, richTextToHTML } from '@/utils';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';
import { FiPlus } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { uploadRelevantImage } from '@/services/poolcover';
import { AddToCartButton } from '../Product/AddtoQuoteButton';
import parse from 'html-react-parser';
import { BreadCrumbs } from '../common/BreadCrumbs';

const INPUT_TYPES_WITH_OPTIONS = new Set(['radio', 'checkbox', 'select']);

const buildDynamicSchema = (fields = []) => {
    const shape = {};
    fields.forEach((field) => {
        const key = field.fieldKey;
        if (!key) return;

        if (INPUT_TYPES_WITH_OPTIONS.has(field.inputType)) {
            shape[key] = yup.string().nullable();
        } else {
            let rule = yup.string();
            if (field.required) rule = rule.required(`${field.label} is required`);
            shape[key] = rule;
        }
    });

    return yup.object(shape).required();
};

const buildDefaultValues = (fields = []) => {
    const defaults = {};
    fields.forEach((field) => {
        if (!field.fieldKey) return;
        defaults[field.fieldKey] = INPUT_TYPES_WITH_OPTIONS.has(field.inputType) ? null : '';
    });
    return defaults;
};

export const AddToQuoteForm = ({ title, productData, matchedProducts }) => {
    const poolConfig = productData?.poolCoverConfig || {};
    const fallbackFields = [
        {
            label: 'PLEASE SHARE THE APPROX. SIZE OF THE AREA YOU YOUR POOL IS',
            fieldKey: 'approxSize',
            inputType: 'textarea',
            required: true,
            options: [],
        },
        {
            label: 'HOW IS YOUR POOL EDGE?',
            fieldKey: 'poolEdge',
            inputType: 'radio',
            required: false,
            options: [
                { label: 'FLAT', value: 'FLAT' },
                { label: 'RAISED', value: 'RAISED' },
            ],
        },
        {
            label: 'HOW MUCH OF THE POOL ARE YOU LOOKING TO COVER?',
            fieldKey: 'coverType',
            inputType: 'radio',
            required: false,
            options: [
                { label: 'ENTIRE POOL', value: 'ENTIRE POOL' },
                { label: 'PARTIAL POOL COVERING', value: 'PARTIAL POOL COVERING' },
            ],
        },
    ];

    const quoteFields = poolConfig.quoteRequestFields?.length ? poolConfig.quoteRequestFields : fallbackFields;
    const quoteIntroText = poolConfig.quoteIntroText || 'Please fill the below RFP form and a specialist will provide a custom quote';
    const quoteSubmitLabel = poolConfig.quoteSubmitLabel || 'Add to Quote';

    const schema = buildDynamicSchema(quoteFields);
    const defaultValues = buildDefaultValues(quoteFields);

    const [formData, setFormData] = useState(defaultValues);

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
        defaultValues
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
            
            const uploadedImageIds = relevantImages
                .map((x) => x.id)
                .filter(Boolean);

            const customTextFields = {};
            quoteFields.forEach((field) => {
                const label = (field.label || field.fieldKey).toUpperCase();
                const val = data[field.fieldKey];
                customTextFields[label] = typeof val === 'string' ? val.toUpperCase() : val || '-';
            });

            if (uploadedImageIds.length) {
                customTextFields["RELEVENT IMAGES"] = uploadedImageIds.join("~~");
            }
            customTextFields["POOLCOVER"] = "true";

            const cartData = {
                lineItems: [{
                    catalogReference: {
                        appId,
                        catalogItemId: productId,
                        options: {
                            customTextFields,
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
                setFormData(defaultValues);
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
            <div className='lg:max-w-[656px] sm:max-w-[492px] h-full overflow-y-scroll hide-scrollbar lg:pb-[28vh]'>
                <div className='w-full flex items-center my-8'>
                    <BreadCrumbs items={[
                        { label: 'Home', to: '/' },
                        { label: 'POOLCOVER' }
                    ]} />
                </div>
                <h3 className='uppercase text-secondary-alt font-recklessRegular 
                    lg:text-[90px] 
                    lg:leading-[85px]
                    text-[35px]
                    leading-[30px] mb-4
                    '>{title}</h3>

                <div className="font-haasRegular lg:text-[16px] lg:leading-[19px] text-[14px] leading-[17px] text-secondary-alt">
                    {parse(richTextToHTML(productData?.description) || '')}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full grid grid-cols-2 justify-between gap-x-[24px] gap-y-[39px] mt-[20px]'>
                    <span className='lg:col-span-4 
               col-span-2
               uppercase
               font-recklessRegular
               text-[30px] 
               leading-[30px] 
               text-secondary-alt'>{quoteIntroText}</span>

                    {quoteFields.map((field) => {
                        const key = field.fieldKey;
                        const options = (field.options || []).map((opt) => typeof opt === 'string' ? { label: opt, value: opt } : opt);
                        const spanClass = field.inputType === 'textarea' ? 'lg:col-span-4 col-span-2' : 'lg:col-span-2 col-span-2';

                        if (field.inputType === 'radio' || field.inputType === 'checkbox') {
                            return (
                                <CheckBox
                                    key={key}
                                    data={{ label: field.label, options: options.map((x) => x.label) }}
                                    type={field.inputType}
                                    value={formData[key]}
                                    onChange={(newState) => handleInputChange(key, newState)}
                                    disabled={isSubmitting}
                                />
                            );
                        }

                        if (field.inputType === 'select') {
                            return (
                                <div key={key} className={spanClass}>
                                    <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                                    <select
                                        {...register(key)}
                                        value={formData[key] || ''}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary uppercase"
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select...</option>
                                        {options.map((opt) => (
                                            <option key={`${key}-${opt.value}`} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }

                        const isTextarea = field.inputType === 'textarea';
                        return (
                            <div key={key} className={spanClass}>
                                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">{field.label}</label>
                                {isTextarea ? (
                                    <textarea
                                        {...register(key)}
                                        value={formData[key] || ''}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                                        rows={4}
                                        disabled={isSubmitting}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        {...register(key)}
                                        value={formData[key] || ''}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                        );
                    })}

                    <div className={`lg:col-span-4 col-span-2 ${relevantImages.length === 0 ? 'mb-[39px]' : ''}`}>
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
            <AddToCartButton onClick={handleSubmit(onSubmit)} classes={'lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:z-10 lg:!h-[130px] lg:!mt-0'} text={isSubmitting ? "Please wait..." : "add to quote"} disabled={isSubmitting} />
        </>
    );
};