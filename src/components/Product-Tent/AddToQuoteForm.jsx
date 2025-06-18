import React, { useState, useEffect } from 'react';
import { CheckBox } from './CheckBox';
import { AddToQuote } from './AddtoQuoteButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDateNumeric, logError } from '@/utils';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';
import { AddProductToCart } from '@/services/cart/CartApis';
import { useCookies } from 'react-cookie';

// Validation schema
const schema = yup.object({
    eventName: yup.string().required('Event name is required'),
    eventDate: yup.string().required('Event date is required'),
    removalDate: yup.string()
        .required('Removal date is required')
        .test('removal-after-event', 'Removal date must be after event date', function (value) {
            const { eventDate } = this.parent;
            if (!value || !eventDate) return true;
            return new Date(value) >= new Date(eventDate);
        }),
    tentSize: yup.string(),
    numberOfGuests: yup.string().required('Number of guests is required'),
    carpetColor: yup.string(),
    distanceFromTruck: yup.string(),
    additionalInfo: yup.string(),
    eventType: yup.string().nullable(),
    datesFlexible: yup.string().nullable(),
    tentType: yup.string().nullable(),
    heating: yup.string().nullable(),
    dj: yup.string().nullable(),
    ceilingTreatment: yup.string().nullable(),
    wallTreatment: yup.string().nullable(),
    lightingNeeded: yup.string().nullable(),
    ableToStake: yup.string().nullable(),
    tentSurface: yup.string().nullable(),
    levelSurface: yup.string().nullable(),
    needFloor: yup.string().nullable()
}).required();

export const AddToQuoteForm = ({ productData }) => {
    // Form state management
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        removalDate: '',
        tentSize: '',
        numberOfGuests: '',
        carpetColor: '',
        distanceFromTruck: '',
        additionalInfo: '',
        eventType: null,
        datesFlexible: null,
        tentType: null,
        heating: null,
        dj: null,
        ceilingTreatment: null,
        wallTreatment: null,
        lightingNeeded: null,
        ableToStake: null,
        tentSurface: null,
        levelSurface: null,
        needFloor: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [datepickers, setDatepickers] = useState({});
    const redirectWithLoader = useRedirectWithLoader();
    const [cookies, setCookie] = useCookies(["cartQuantity"]);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData
    });

    // Initialize Air Datepickers
    useEffect(() => {
        const today = new Date();
        const datePickerInstances = {};

        const baseConfig = {
            minDate: today,
            format: "MM/dd/yyyy",
            autoClose: true,
            locale: localeEn,
            classes: "custom-date-picker",
        };

        const datePickerConfigs = [
            {
                id: 'eventDate',
                onSelect: ({ date, datepicker }) => {
                    const dateStr = date ? formatDateNumeric(date) : '';
                    setValue('eventDate', dateStr);
                    handleInputChange('eventDate', dateStr);
                    trigger('eventDate');
                    datepicker.$el.value = dateStr;
                    datePickerInstances.removalDate?.update({ minDate: date || today });
                }
            },
            {
                id: 'removalDate',
                onSelect: ({ date, datepicker }) => {
                    const dateStr = date ? formatDateNumeric(date) : '';
                    setValue('removalDate', dateStr);
                    handleInputChange('removalDate', dateStr);
                    trigger('removalDate');
                    datepicker.$el.value = dateStr;
                }
            }
        ];

        datePickerConfigs.forEach(({ id, onSelect }) => {
            const element = document.getElementById(id);
            if (element) {
                datePickerInstances[id] = new AirDatepicker(element, {
                    ...baseConfig,
                    onSelect
                });
            }
        });

        setDatepickers(datePickerInstances);

        return () => {
            Object.values(datePickerInstances).forEach(dp => {
                if (dp && typeof dp.destroy === 'function') {
                    dp.destroy();
                }
            });
        };
    }, [setValue, trigger]);

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
                                "EVENT NAME": data.eventName.toUpperCase(),
                                "EVENT DATE": data.eventDate.toUpperCase(),
                                "REMOVAL DATE": data.removalDate.toUpperCase(),
                                "TENT SIZE (IF KNOWN)": data.tentSize.toUpperCase(),
                                "EVENT TYPE": data.eventType.toUpperCase(),
                                "NUMBER OF GUESTS": data.numberOfGuests.toUpperCase(),
                                "ARE THE INSTALL/REMOVAL DATES FLEXIBLE?": data.datesFlexible.toUpperCase(),
                                "TENT TYPE": data.tentType.toUpperCase(),
                                "HEATING": data.heating.toUpperCase(),
                                "DJ": data.dj.toUpperCase(),
                                "CEILING TREATMENT": data.ceilingTreatment.toUpperCase(),
                                "WALL TREATMENT": data.wallTreatment.toUpperCase(),
                                "LIGHTING NEEDED": data.lightingNeeded.toUpperCase(),
                                "ABLE TO STAKE": data.ableToStake.toUpperCase(),
                                "TENT SURFACE": data.tentSurface.toUpperCase(),
                                "LEVEL SURFACE": data.levelSurface.toUpperCase(),
                                "DO YOU NEED A FLOOR": data.needFloor.toUpperCase(),
                                "CARPET / ASTROTURF COLOR": data.carpetColor.toUpperCase(),
                                "DISTANCE FROM TRUCK TO SITE": data.distanceFromTruck.toUpperCase(),
                                "PLEASE PROVIDE ANY OTHER ADDITIONAL INFO": data.additionalInfo.toUpperCase()
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
                Object.values(datepickers).forEach(dp => {
                    if (dp && typeof dp.clear === 'function') {
                        dp.clear();
                    }
                });
            }, 1000);
            redirectWithLoader("/cart");

        } catch (error) {
            logError("Error while adding item to cart:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full grid lg:grid-cols-4 grid-cols-2 justify-between gap-x-[24px] gap-y-[39px] mt-[20px]'>
            <span className='lg:col-span-4 
               col-span-2
               uppercase
               font-recklessRegular
               text-[30px] 
               leading-[30px] 
               text-secondary-alt'>Please fill the bellow RFP form & A tenting Specialist will provide a custom quote</span>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Event Name</label>
                <input
                    type="text"
                    {...register('eventName')}
                    value={formData.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errors.eventName ? 'border-b-red-500' : ''}`}
                    disabled={isSubmitting}
                />
                {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>}
            </div>

            <div className='lg:col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Event Date</label>
                <input
                    id="eventDate"
                    type="text"
                    {...register('eventDate')}
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    className={`datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errors.eventDate ? 'border-b-red-500' : ''}`}
                    placeholder="MM/DD/YYYY"
                    readOnly
                    disabled={isSubmitting}
                />
                {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
            </div>

            <div className='lg:col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">Removal Date</label>
                <input
                    id="removalDate"
                    type="text"
                    {...register('removalDate')}
                    value={formData.removalDate}
                    onChange={(e) => handleInputChange('removalDate', e.target.value)}
                    className={`datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errors.removalDate ? 'border-b-red-500' : ''}`}
                    placeholder="MM/DD/YYYY"
                    readOnly
                    disabled={isSubmitting}
                />
                {errors.removalDate && <p className="text-red-500 text-sm mt-1">{errors.removalDate.message}</p>}
            </div>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">tent size (if known)</label>
                <input
                    type="text"
                    {...register('tentSize')}
                    value={formData.tentSize}
                    onChange={(e) => handleInputChange('tentSize', e.target.value)}
                    className="datepicker w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    disabled={isSubmitting}
                />
            </div>

            <CheckBox
                data={{ label: "event type", options: ["RECEPTION", "SIT DOWN DINNER", "OTHER"] }}
                classes="lg:col-span-2"
                type="radio"
                value={formData.eventType}
                onChange={(newState, index, optionText) => handleInputChange('eventType', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <div className='lg:col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">NUMBER OF GUESTS*</label>
                <input
                    type="text"
                    {...register('numberOfGuests')}
                    value={formData.numberOfGuests}
                    onChange={(e) => handleInputChange('numberOfGuests', e.target.value)}
                    className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary ${errors.numberOfGuests ? 'border-b-red-500' : ''}`}
                    disabled={isSubmitting}
                />
                {errors.numberOfGuests && <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests.message}</p>}
            </div>

            <CheckBox
                data={{ label: "are the install/removal dates flexible", options: ["yes", "no"] }}
                type="radio"
                value={formData.datesFlexible}
                onChange={(newState, index, optionText) => handleInputChange('datesFlexible', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "tent type", options: ["white walls", "no walls", "transparent"] }}
                type="radio"
                value={formData.tentType}
                onChange={(newState, index, optionText) => handleInputChange('tentType', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "heating", options: ["yes", "no"] }}
                type="radio"
                value={formData.heating}
                onChange={(newState, index, optionText) => handleInputChange('heating', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "DJ", options: ["yes", "no"] }}
                type="radio"
                value={formData.dj}
                onChange={(newState, index, optionText) => handleInputChange('dj', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "CEILLING TREATMENT", options: ["FULL SWAG", "PARTIAL SWAG", "CROWN RAFTER", "I AM NOT SURE"] }}
                type="radio"
                value={formData.ceilingTreatment}
                onChange={(newState, index, optionText) => handleInputChange('ceilingTreatment', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "WALL TREATMENT", options: ["FULL PLEAT", "MINIMAL PLEAT", "WALL POLE DRAPE", "OTHER"] }}
                type="radio"
                value={formData.wallTreatment}
                onChange={(newState, index, optionText) => handleInputChange('wallTreatment', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "LIGHTING NEEDED", options: ["yes", "no", "i don't know"] }}
                type="radio"
                value={formData.lightingNeeded}
                onChange={(newState, index, optionText) => handleInputChange('lightingNeeded', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "ABLE TO STAKE", options: ["yes", "no"] }}
                type="radio"
                value={formData.ableToStake}
                onChange={(newState, index, optionText) => handleInputChange('ableToStake', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "TENT SURFACE", options: ["dirt", "grass", "Concrete", "astfalt", "other"] }}
                type="radio"
                value={formData.tentSurface}
                onChange={(newState, index, optionText) => handleInputChange('tentSurface', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "level surface", options: ["yes", "no"] }}
                type="radio"
                value={formData.levelSurface}
                onChange={(newState, index, optionText) => handleInputChange('levelSurface', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <CheckBox
                data={{ label: "do you need a floor", options: ["yes", "no"] }}
                type="radio"
                value={formData.needFloor}
                onChange={(newState, index, optionText) => handleInputChange('needFloor', newState, index, optionText)}
                disabled={isSubmitting}
            />

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">CARPET / ASTROTURF COLOR</label>
                <input
                    type="text"
                    {...register('carpetColor')}
                    value={formData.carpetColor}
                    onChange={(e) => handleInputChange('carpetColor', e.target.value)}
                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    disabled={isSubmitting}
                />
            </div>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">TENT SIZE</label>
                <input
                    type="text"
                    value={formData.tentSize}
                    onChange={(e) => handleInputChange('tentSize', e.target.value)}
                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    disabled={isSubmitting}
                />
            </div>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">DISTANCE FROM TRUCK TO SITE</label>
                <input
                    type="text"
                    {...register('distanceFromTruck')}
                    value={formData.distanceFromTruck}
                    onChange={(e) => handleInputChange('distanceFromTruck', e.target.value)}
                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    disabled={isSubmitting}
                />
            </div>

            <div className='lg:col-span-4 col-span-2'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">PLEASE PROVIDE ANY OTHER ADDICIONAL INFO</label>
                <textarea
                    {...register('additionalInfo')}
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    className="w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm bg-primary-alt text-secondary-alt placeholder-secondary"
                    rows={4}
                    disabled={isSubmitting}
                ></textarea>
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