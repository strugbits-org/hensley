import React, { useState, useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDateNumeric, logError, richTextToHTML } from '@/utils';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';
import { AddToCartButton, AddToCartButtonInline } from '../Product/AddtoQuoteButton';
import parse from 'html-react-parser';
import { CheckBoxInline } from './CheckBoxInline';

// ---------------------------------------------------------------------------
// Dynamic schema & defaults (same logic as AddToQuoteForm)
// ---------------------------------------------------------------------------

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

    if (shape.removalDate && shape.eventDate) {
        shape.removalDate = shape.removalDate.test(
            'removal-after-event',
            'Removal date must be after event date',
            function (value) {
                const { eventDate } = this.parent;
                if (!value || !eventDate) return true;
                return new Date(value) >= new Date(eventDate);
            }
        );
    }

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

export const AddToQuoteFormInline = ({ title, productData }) => {
    const tentConfig = productData?.tentConfig || {};
    const quoteFields = tentConfig.quoteRequestFields || [];
    const quoteIntroText = tentConfig.quoteIntroText || 'Please fill the below RFP form & A tenting Specialist will provide a custom quote';
    const quoteSubmitLabel = tentConfig.quoteSubmitLabel || 'Add to Quote';

    const uid = useId();
    const schema = useMemo(() => buildDynamicSchema(quoteFields), [quoteFields]);
    const defaultValues = useMemo(() => buildDefaultValues(quoteFields), [quoteFields]);

    const [formData, setFormData] = useState(defaultValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [datepickers, setDatepickers] = useState({});
    const [cookies, setCookie] = useCookies(['cartQuantity']);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    // ---- Air Datepicker initialisation ----
    useEffect(() => {
        const today = new Date();
        const instances = {};
        const dateFields = quoteFields.filter((f) => f.inputType === 'date');

        dateFields.forEach((field) => {
            const elId = `${uid}-inline-${field.fieldKey}`;
            const el = document.getElementById(elId);
            if (!el) return;

            instances[field.fieldKey] = new AirDatepicker(el, {
                minDate: today,
                format: 'MM/dd/yyyy',
                autoClose: true,
                locale: localeEn,
                classes: 'custom-date-picker',
                onSelect: ({ date, datepicker }) => {
                    const dateStr = date ? formatDateNumeric(date) : '';
                    setValue(field.fieldKey, dateStr);
                    handleInputChange(field.fieldKey, dateStr);
                    trigger(field.fieldKey);
                    datepicker.$el.value = dateStr;

                    if (field.fieldKey === 'eventDate' && instances.removalDate) {
                        instances.removalDate.update({ minDate: date || today });
                    }
                },
            });
        });

        setDatepickers(instances);

        return () => {
            Object.values(instances).forEach((dp) => {
                if (dp && typeof dp.destroy === 'function') dp.destroy();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteFields.length]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValue(field, value);
        trigger(field);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const productId = productData._id;
            const appId = '215238eb-22a5-4c36-9e7b-e7c08025e04e';

            const customTextFields = {};
            quoteFields.forEach((field) => {
                const label = (field.label || field.fieldKey).toUpperCase();
                const val = data[field.fieldKey];
                customTextFields[label] = typeof val === 'string' ? val.toUpperCase() : val || '-';
            });

            const cartData = {
                lineItems: [
                    {
                        catalogReference: {
                            appId,
                            catalogItemId: productId,
                            options: { customTextFields },
                        },
                        quantity: 1,
                        price: productData.price || 0,
                    },
                ],
            };

            await AddProductToCart(cartData);
            const total = (cookies.cartQuantity || 0) + 1;
            setCookie('cartQuantity', total, { path: '/' });
        } catch (error) {
            logError('Error while adding item to cart:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const descriptionHtml = typeof productData?.description === 'string'
        ? productData.description
        : richTextToHTML(productData?.description) || '';

    const colSpan = (field) => {
        if (INPUT_TYPES_WITH_OPTIONS.has(field.inputType)) return 'lg:col-span-2';
        if (field.inputType === 'textarea') return 'lg:col-span-4 col-span-2';
        if (field.fieldKey === 'eventDate' || field.fieldKey === 'removalDate') return 'lg:col-span-2';
        return 'lg:col-span-4 col-span-2';
    };

    const renderField = (field) => {
        const key = field.fieldKey;
        const elId = `${uid}-inline-${key}`;
        const errorMsg = errors[key]?.message;
        const errorCls = errorMsg ? 'border-b-red-500' : '';

        switch (field.inputType) {
            case 'text':
            case 'number':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[12px] leading-[12px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <input
                            type="text"
                            inputMode={field.inputType === 'number' ? 'numeric' : undefined}
                            {...register(key)}
                            value={formData[key] || ''}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt px-4 py-2 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
                            disabled={isSubmitting}
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[12px] leading-[12px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <textarea
                            {...register(key)}
                            value={formData[key] || ''}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt px-4 py-2 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
                            rows={4}
                            disabled={isSubmitting}
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'date':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[12px] leading-[12px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <input
                            id={elId}
                            type="text"
                            {...register(key)}
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`datepicker w-full border-b font-haasLight border-secondary-alt px-4 py-2 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
                            placeholder="MM/DD/YYYY"
                            readOnly
                            disabled={isSubmitting}
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'select':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[12px] leading-[12px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <select
                            {...register(key)}
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt px-4 py-2 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary uppercase ${errorCls}`}
                            disabled={isSubmitting}
                        >
                            <option value="">Select…</option>
                            {(field.options || []).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'radio':
            case 'checkbox':
                return (
                    <CheckBoxInline
                        key={key}
                        data={{
                            label: field.label,
                            options: (field.options || []).map((opt) =>
                                typeof opt === 'string' ? opt : { label: opt.label, value: opt.value }
                            ),
                        }}
                        classes={colSpan(field)}
                        type={field.inputType}
                        value={formData[key]}
                        onChange={(newState) => handleInputChange(key, newState)}
                        disabled={isSubmitting}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <h3 className='uppercase text-secondary-alt font-recklessRegular text-[35px] leading-[30px] mb-4'>{title}</h3>

            <div className="font-haasLight text-[12px] leading-[12px] text-secondary-alt uppercase">
                {descriptionHtml ? parse(descriptionHtml) : null}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full grid lg:grid-cols-4 grid-cols-2 justify-between gap-x-[24px] gap-y-[24px] mt-[20px]'>
                <span className='lg:col-span-4 col-span-2 uppercase font-recklessRegular text-[16px] leading-[16px] text-secondary-alt'>
                    {quoteIntroText}
                </span>

                {quoteFields.map(renderField)}
            </form>
            <div className='spacer h-28 lg:h-24'></div>
            <div className='absolute bottom-0 right-0 w-full sm:w-[55%] p-5 bg-primary-alt border-none'>
                <AddToCartButtonInline
                    onClick={handleSubmit(onSubmit)}
                    classes={'h-[75px] lg:mt-4 mt-0'}
                    text={isSubmitting ? 'Please wait...' : quoteSubmitLabel.toLowerCase()}
                    disabled={isSubmitting}
                    showArrow={true}
                />
            </div>
        </div>
    );
};