import React, { useState, useEffect, useId, useMemo } from 'react';
import { CheckBox } from './CheckBox';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDateNumeric, logError, richTextToHTML } from '@/utils';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';
import { AddToCartButton } from '../Product/AddtoQuoteButton';
import parse from 'html-react-parser';
import { BreadCrumbs } from '../common/BreadCrumbs';

// ---------------------------------------------------------------------------
// Helpers to build a Yup schema and initial state dynamically from the
// quoteRequestFields array provided by the core backend tent config.
// ---------------------------------------------------------------------------

const INPUT_TYPES_WITH_OPTIONS = new Set(['radio', 'checkbox', 'select']);

const buildDynamicSchema = (fields = []) => {
    const shape = {};
    fields.forEach((field) => {
        const key = field.fieldKey;
        if (!key) return;

        // Required flag is driven entirely by the backend tent config.
        let rule = yup.string().nullable();
        if (field.required) rule = rule.required(`${field.label} is required`);
        shape[key] = rule;
    });

    // Cross-field validation: removalDate must be after eventDate when both exist
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AddToQuoteForm = ({ title, productData, matchedProducts }) => {
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
    const redirectWithLoader = useRedirectWithLoader();
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

    // ---- Air Datepicker initialisation for every date field ----
    useEffect(() => {
        const today = new Date();
        const instances = {};

        const dateFields = quoteFields.filter((f) => f.inputType === 'date');

        dateFields.forEach((field) => {
            const elId = `${uid}-${field.fieldKey}`;
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

                    // If this is eventDate, push removalDate minDate forward
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
        if (field === 'numberOfGuests') {
            // Only allow numeric input for numberOfGuests
            const numericValue = value.replace(/\D/g, '');
            value = numericValue;
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValue(field, value);
        trigger(field);
    };

    // Validation failed: bring the first invalid field into view. The form lives
    // inside a scrollable container, so errors otherwise stay hidden off-screen.
    const onError = (formErrors) => {
        const firstKey = Object.keys(formErrors || {})[0];
        if (!firstKey) return;
        const el =
            document.getElementById(`${uid}-${firstKey}`) ||
            document.querySelector(`[name="${firstKey}"]`);
        if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof el.focus === 'function') el.focus({ preventScroll: true });
        }
    };

    // ---- Submission ----
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const productId = productData._id;
            const appId = '215238eb-22a5-4c36-9e7b-e7c08025e04e';

            // Build the customTextFields map dynamically from the form data
            const customTextFields = {};
            quoteFields.forEach((field) => {
                const label = (field.label || field.fieldKey).toUpperCase();
                const val = data[field.fieldKey];
                const normalized = typeof val === 'string' ? val.trim().toUpperCase() : val;
                customTextFields[label] = normalized || '-';
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
            setTimeout(() => {
                reset();
                Object.values(datepickers).forEach((dp) => {
                    if (dp && typeof dp.clear === 'function') dp.clear();
                });
            }, 1000);
            redirectWithLoader('/cart');
        } catch (error) {
            logError('Error while adding item to cart:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ---- Render helpers per input type ----
    const descriptionHtml = typeof productData?.description === 'string'
        ? productData.description
        : richTextToHTML(productData?.description) || '';

    // Determine the grid‑column span for a field (full, half, etc.)
    const colSpan = (field) => {
        if (INPUT_TYPES_WITH_OPTIONS.has(field.inputType)) return 'lg:col-span-2';
        if (field.inputType === 'textarea') return 'lg:col-span-4 col-span-2';
        if (field.fieldKey === 'eventDate' || field.fieldKey === 'removalDate') return 'lg:col-span-2';
        return 'lg:col-span-4 col-span-2';
    };

    const renderField = (field) => {

        const key = field.fieldKey;
        const elId = `${uid}-${key}`;
        const errorMsg = errors[key]?.message;
        const errorCls = errorMsg ? 'border-b-red-500' : '';

        switch (field.inputType) {
            case 'text':
            case 'number':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[16px] leading-[19px] 3xl:text-[28px] 3xl:leading-[34px] font-haasBold uppercase font-medium text-secondary-alt mb-2 3xl:mb-5">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <input
                            type={field.inputType === 'number' ? 'text' : 'text'}
                            inputMode={field.inputType === 'number' ? 'numeric' : undefined}
                            {...register(key)}
                            value={formData[key] || ''}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt p-3 3xl:p-7 3xl:text-[26px] bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
                            disabled={isSubmitting}
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[16px] leading-[19px] 3xl:text-[28px] 3xl:leading-[34px] font-haasBold uppercase font-medium text-secondary-alt mb-2 3xl:mb-5">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <textarea
                            {...register(key)}
                            value={formData[key] || ''}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt p-3 3xl:p-7 3xl:text-[26px] bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
                            rows={4}
                            disabled={isSubmitting}
                        />
                        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    </div>
                );

            case 'date':
                return (
                    <div key={key} className={colSpan(field)}>
                        <label className="block text-[16px] leading-[19px] 3xl:text-[28px] 3xl:leading-[34px] font-haasBold uppercase font-medium text-secondary-alt mb-2 3xl:mb-5">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <input
                            id={elId}
                            type="text"
                            {...register(key)}
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`datepicker w-full border-b font-haasLight border-secondary-alt p-3 3xl:p-7 3xl:text-[26px] bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errorCls}`}
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
                        <label className="block text-[16px] leading-[19px] 3xl:text-[28px] 3xl:leading-[34px] font-haasBold uppercase font-medium text-secondary-alt mb-2 3xl:mb-5">
                            {field.label}{field.required ? '*' : ''}
                        </label>
                        <select
                            {...register(key)}
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full border-b font-haasLight border-secondary-alt p-3 3xl:p-7 3xl:text-[26px] bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary uppercase ${errorCls}`}
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
                    <CheckBox
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
                        required={field.required}
                        error={errorMsg}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div className='w-full lg:max-w-[740px] 3xl:max-w-[1600px] sm:max-w-[400px]'>
                <div className='w-full flex items-center my-8 3xl:my-12'>
                    <BreadCrumbs items={[
                        { label: 'Home', to: '/' },
                        { label: 'TENTS' }
                    ]} />
                </div>
                <h3 className='uppercase text-secondary-alt font-recklessRegular lg:text-[75px] lg:leading-[85px] 3xl:text-[180px] 3xl:leading-[170px] text-[35px] leading-[30px] mb-3 3xl:mb-10'>{title}</h3>
                <div className="font-haasLight lg:text-[16px] lg:leading-[19px] 3xl:text-[30px] 3xl:leading-[40px] text-[14px] leading-[17px] text-secondary-alt 3xl:[&_p]:mb-6">
                    {descriptionHtml ? parse(descriptionHtml) : null}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full grid lg:grid-cols-4 grid-cols-2 justify-between gap-x-[24px] 3xl:gap-x-[40px] gap-y-[39px] 3xl:gap-y-[60px] mt-[20px] 3xl:mt-[44px]'>
                    <span className='lg:col-span-4 col-span-2 uppercase font-recklessRegular text-[30px] leading-[30px] 3xl:text-[64px] 3xl:leading-[68px] text-secondary-alt'>
                        {quoteIntroText}
                    </span>

                    {quoteFields.map(renderField)}
                </form>
            </div>
            <div className="h-[20px]" />

            <AddToCartButton
                onClick={handleSubmit(onSubmit, onError)}
                classes={'lg:sticky lg:bottom-4 lg:z-10 lg:!h-[130px] 3xl:!h-[180px] lg:!mt-auto'}
                text={isSubmitting ? 'Please wait...' : quoteSubmitLabel.toLowerCase()}
                disabled={isSubmitting}
            />
        </>
    );
};