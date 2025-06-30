'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { MatchFeatureSlider } from './MatchFeatureSlide'
import { logError } from '@/utils';
import { fetchSortedProducts } from '@/services/collections';
import { PrimaryImage } from '@/components/common/PrimaryImage';
import Loading from '@/app/loading';
import { debounce } from 'lodash';
import { queryProducts } from '@/services/products';
import { updateMatchedProducts } from '@/services/admin';

const InputField = React.memo(({ id, label, placeholder, classes, borderColor = 'secondary-alt', type = "text", onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className={`gap-y-[8px] flex flex-col ${classes}`}>
            {label && (
                <label htmlFor={id} className="uppercase block text-sm font-medium text-secondary-alt font-haasBold">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    w-full placeholder-secondary font-haasLight p-3 rounded-sm bg-gray-100
                    border-b 
                    border-${borderColor} ${isFocused ? 'border-b-2' : 'border-b'}
                    hover:border-b-2
                    outline-none transition-all duration-300 uppercase
                `}
            />
        </div>
    );
});

const Card = React.memo(({ data, onClick }) => {
    const { product } = data;

    const handleClick = useCallback(() => {
        onClick(product);
    }, [onClick, product]);

    return (
        <div className='w-full group border border-primary-border pb-6 px-[5px] pt-[5px] relative'>
            <div className='w-full'>
                <PrimaryImage url={product.mainMedia} className='h-full w-full object-contain' />
            </div>
            <span
                className='text-[12px] mt-2 block text-secondary-alt uppercase font-haasRegular'
            >
                {product.name}
            </span>
            <div className='w-full px-[15px] hidden group-hover:block absolute sm:top-5 top-11 left-1/2 transform -translate-x-1/2'>
                <button onClick={handleClick} className={`rounded-full w-full sm:my-[33px] p-2 bg-white tracking-[3px] group transform transition-all duration-300 hover:bg-primary relative`}>
                    <span className='font-haasLight uppercase lg:text-[12px] group-hover:font-haasBold'>Add</span>
                </button>
            </div>
        </div>
    )
});

const MatchFeature = ({ data }) => {
    const { productData } = data;
    const { matchedProducts: matchedProductsData } = productData;
    const [products, setProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchedProducts, setMatchedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const matchedProductIds = useMemo(() =>
        new Set(matchedProducts.map(item => item._id)),
        [matchedProducts]
    );

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchSortedProducts({ limit: 100 });
            setProducts(response.items);
        } catch (error) {
            logError("Error while fetching products", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedSearch = useCallback(
        debounce(async (value) => {
            if (value.trim()) {
                setLoading(true);
                try {
                    const searchResults = await queryProducts(value);
                    setFilterProducts(searchResults);
                } catch (error) {
                    logError("Error while searching products", error);
                    const filteredProducts = products.filter(({ product }) => {
                        if (!product) return false;
                        const isMatched = matchedProductIds.has(product._id);
                        const matchesSearch = product.name && product.name.toLowerCase().includes(value.toLowerCase());
                        return !isMatched && matchesSearch;
                    });
                    setFilterProducts(filteredProducts);
                } finally {
                    setLoading(false);
                }
            } else {
                setFilterProducts(products);
            }
        }, 500),
        [products, matchedProductIds]
    );

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleProductChange = useCallback((product) => {
        setMatchedProducts(prev => {
            if (prev.some(item => item._id === product._id)) {
                return prev.filter(item => item._id !== product._id);
            } else {
                return [product, ...prev];
            }
        });
    }, []);

    const availableProducts = useMemo(() => {
        return filterProducts.filter(({ product }) => !matchedProductIds.has(product._id));
    }, [filterProducts, matchedProductIds]);

    useEffect(() => {
        if (!searchTerm) {
            setFilterProducts(products);
        }
    }, [products, searchTerm]);

    useEffect(() => {
        fetchProducts();
        const matchedItems = matchedProductsData.map(({ product }) => product);
        setMatchedProducts(matchedItems);
    }, [fetchProducts, matchedProductsData]);

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);
            await updateMatchedProducts({ mainProduct: productData, matchedProducts });
            setIsUpdated(true);
        } catch (error) {
            logError("Error while updating matched products", error);
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        if (isUpdated) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }, [isUpdated]);

    return (
        <div className='relative sm:w-[650px] sm:h-[800px] pt-[20px] pb-[20px] w-[600px] max-sm:h-[700px] hide-scrollbar sm:mt-0 mt-[50px] overflow-y-scroll flex-col flex gap-x-[24px] gap-y-[20px] px-[20px] bg-primary-alt z-[999999] box-border'>
            <div className='w-full text-center'>
                <span
                    className='text-[25px] text-secondary-alt uppercase font-recklessRegular'
                >
                    match it with
                </span>
            </div>
            <div className='w-full min-h-[220px]'>
                <MatchFeatureSlider data={matchedProducts} onClick={handleProductChange} />
            </div>
            <div className='w-full'>
                <label className="block text-[16px] leading-[19px] font-haasBold uppercase font-medium text-secondary-alt mb-2">
                    Search
                </label>
                <InputField
                    id="search"
                    placeholder="ENTER A PRODUCT NAME"
                    borderColor="secondary-alt"
                    classes={'w-[50%]'}
                    onChange={handleSearch}
                />
            </div>
            <div className='w-full grid sm:grid-cols-4 grid-cols-2 gap-[16px] overflow-y-scroll hide-scrollbar'>
                {!loading && availableProducts.map((product) => {
                    return <Card key={product._id} data={product} onClick={handleProductChange} />
                })}
            </div>
            {availableProducts.length === 0 && !loading && (
                <div className='w-full flex justify-center items-center text-secondary-alt font-haasRegular uppercase text-[18px]'>
                    No products found
                </div>
            )}
            {loading && (
                <div className='w-full flex justify-center items-center'>
                    <Loading custom />
                </div>
            )}

            {!loading && (
                <div className='w-full inset-0 flex justify-center items-end'>
                    <button disabled={isUpdating || isUpdated} onClick={handleUpdate} className={`rounded-full w-full p-2 bg-primary tracking-[3px] group transform transition-all duration-300 relative hover:bg-secondary-alt hover:text-primary disabled:opacity-50`}>
                        <span className='font-haasLight uppercase lg:text-[12px]'>{isUpdating ? 'Updating...' : isUpdated ? 'Product updated, reloading...' : 'Update'}</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default MatchFeature;