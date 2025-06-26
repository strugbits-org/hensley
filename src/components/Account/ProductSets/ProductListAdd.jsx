'use client'
import React, { useMemo, useState, useCallback } from 'react'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { PrimaryImage } from '@/components/common/PrimaryImage'
import { createProductSet } from '@/services/admin'
import { logError } from '@/utils'
import { toInteger } from 'lodash'

const Card = React.memo(({ data, removeProduct, classes = '', handleQuantityChange }) => {
    const { product, quantity } = data;
    const [quantityValue, setQuantityValue] = useState(quantity);

    const handleQuantity = useCallback((e) => {
        const value = e.target.value;
        setQuantityValue(e.target.value);
        handleQuantityChange(product._id, value);
    }, []);
    return (
        <div className={`${classes} w-full border text-left border-primary-border flex flex-col gap-y-[10px] p-[10px] cursor-pointer`}>
            <div className='flex justify-between'>
                <span className='font-haasRegular text-secondary-alt uppercase text-[16px] block'>
                    {product?.name || data.name}
                </span>
                <button
                    onClick={removeProduct}
                    className='flex items-center justify-center rounded-full w-[25px] h-[25px] border border-primary-border transform transition-all duration-300 group cursor-pointer hover:bg-secondary-alt flex-shrink-0'
                    aria-label="Remove product"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className='group-hover:hidden' fill="black">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className="hidden group-hover:block fill-white">
                        <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex gap-x-[10px] items-center'>
                <label className='font-haasRegular text-secondary-alt uppercase block text-[16px]'>
                    quantity
                </label>
                <input
                    type="number"
                    defaultValue={quantityValue}
                    onChange={handleQuantity}
                    min="1"
                    className="w-[60px] h-[30px] p-2 bg-transparent border border-primary-border outline-none focus:border-primary"
                />
            </div>
        </div>
    )
})

const BackButton = React.memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-9 left-0 cursor-pointer"
        aria-label="Go back to list"
    >
        <svg
            data-bbox="63 62.951 74.049 74.049"
            viewBox="0 0 200 200"
            height="57"
            width="57"
            xmlns="http://www.w3.org/2000/svg"
            data-type="shape"
            style={{ transform: "rotate(45deg)" }}
        >
            <g>
                <path d="M137 133a4 4 0 0 1-4 4H67c-.263 0-.525-.027-.783-.079-.117-.023-.225-.067-.339-.1-.137-.04-.275-.072-.408-.127-.133-.055-.253-.131-.379-.199-.103-.057-.211-.102-.309-.168a4.023 4.023 0 0 1-1.109-1.109c-.065-.097-.109-.203-.165-.304-.07-.127-.146-.25-.202-.384-.055-.132-.086-.271-.126-.407-.033-.113-.077-.222-.101-.339A4.056 4.056 0 0 1 63 133V67a4 4 0 0 1 8 0v56.344l59.172-59.172a4 4 0 1 1 5.656 5.656L76.656 129H133a4 4 0 0 1 4 4z"></path>
            </g>
        </svg>
    </button>
))

const ProductDisplay = React.memo(({ product }) => (
    <div className='w-full lg:max-w-[500px] flex gap-y-[10px] gap-x-[20px] py-[15px] px-[15px] cursor-pointer border border-primary-border transform transition-all duration-300'>
        <div className='bg-white w-[100px] h-[90px]'>
            <PrimaryImage url={product.mainMedia} alt={product.name} customClasses="h-full w-full object-contain" />
        </div>
        <div className='w-full text-left flex flex-col gap-y-[10px] justify-center'>
            <span className='font-haasRegular text-secondary-alt uppercase text-[20px] block'>
                {product.name}
            </span>
        </div>
    </div>
))

const ProductListAdd = ({ toggleToList, productOptions = [], setProductSets }) => {
    const [mainProduct, setMainProduct] = useState(null);
    const [productSetItems, setProductSetItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const filteredProductOptions = useMemo(() => {
        const usedIds = new Set([
            ...(mainProduct ? [mainProduct._id] : []),
            ...productSetItems.map(item => item._id)
        ]);

        return productOptions.filter(({ product }) => !usedIds.has(product._id));
    }, [productSetItems, productOptions, mainProduct]);

    const handleMainProductSelect = useCallback((product) => {
        setMainProduct(product);
    }, []);

    const handleSetProductSelect = useCallback((product) => {
        setProductSetItems(prev => [...prev, {
            _id: product._id,
            product,
            quantity: 1
        }]);
    }, []);

    const handleRemoveSetItem = useCallback((id) => {
        setProductSetItems(prev => prev.filter(item => item._id !== id));
    }, []);

    const handleCreate = useCallback(async () => {
        if (!mainProduct) return;
        setIsLoading(true);
        try {
            const setData = { mainProduct, productSetItems };
            await createProductSet(setData);
            setProductSets(prev => [{ product: mainProduct, setOfProduct: productSetItems }, ...prev]);
            toggleToList();
        } catch (error) {
            logError(error);
        } finally {
            setIsLoading(false);
        }
    }, [mainProduct, productSetItems]);

    const handleQuantityChange = useCallback((id, quantity) => {
        setProductSetItems(prev => prev.map(item => item.product._id === id ? { ...item, quantity: toInteger(quantity) } : item));
    }, []);

    const isEven = productSetItems.length % 2 === 0;
    const lastIndex = productSetItems.length - 1;

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px] relative'>
            <BackButton onClick={toggleToList} />

            <h1 className='block font-haasRegular uppercase text-[25px] text-secondary-alt'>
                create a new set
            </h1>

            <section className='w-full flex flex-col items-center gap-y-[20px]'>
                <h2 className='font-haasBold text-secondary-alt uppercase text-[20px] block'>
                    main product
                </h2>
                <div className='relative h-[60px]'>
                    <CustomDropdown
                        products={filteredProductOptions}
                        onSelect={handleMainProductSelect}
                        placeholder="Select main product"
                    />
                </div>

                {mainProduct && (
                    <ProductDisplay product={mainProduct} />
                )}
            </section>

            <section className='w-full flex flex-col items-center gap-y-[20px]'>
                <h2 className='font-haasBold text-secondary-alt uppercase text-[20px] block'>
                    set of products
                </h2>
                <div className='relative h-[60px]'>
                    <CustomDropdown
                        products={filteredProductOptions}
                        onSelect={handleSetProductSelect}
                        placeholder="Add product to set"
                    />
                </div>

                {productSetItems.length > 0 && (
                    <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-[20px] items-center justify-center">
                        {productSetItems.map((item, index) => {
                            const isLast = !isEven && index === lastIndex;
                            return isLast ? (
                                <div key={item._id} className="w-full sm:col-span-2 flex flex-col justify-center items-center">
                                    <Card
                                        data={item}
                                        classes="lg:w-[440px]"
                                        removeProduct={() => handleRemoveSetItem(item._id)}
                                        handleQuantityChange={handleQuantityChange}
                                    />
                                </div>
                            ) : (
                                <Card
                                    key={item._id}
                                    data={item}
                                    removeProduct={() => handleRemoveSetItem(item._id)}
                                    handleQuantityChange={handleQuantityChange}
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Action Buttons */}
            <button
                disabled={isLoading}
                onClick={handleCreate}
                className='mx-auto max-w-[300px] tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transform transition-all duration-300 h-[58px] lg:w-[280px] w-full text-secondary-alt uppercase text-[14px] font-haasRegular'
            >
                {isLoading ? "SAVING..." : "SAVE"}
            </button>
        </div>
    )
}

export default ProductListAdd;