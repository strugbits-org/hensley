'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchSortedProducts, fetchSubcategoriesData } from '@/services/collections';
import { findSortIndexByCategory, logError } from '@/utils';
import { PrimaryImage } from '@/components/common/PrimaryImage';
import { updateSortedProducts } from '@/services/admin';
import { invalidatePath } from '@/services/invalidation';

const Card = ({ data, id, position }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const { product } = data;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: !isDragging ? transition ?? 'transform 200ms ease' : undefined,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='py-[20px] flex flex-col gap-y-[8px] px-[10px] bg-white cursor-grab border border-gray-200 shadow-md min-h-[420px] rounded'
        >
            <span className='text-[18px] block text-secondary-alt uppercase font-haasRegular'>
                {product.name}
            </span>
            <div className='w-full px-[20px] h-[274px]'>
                <PrimaryImage url={product.mainMedia} alt={product.name} customClasses="h-full w-full object-contain" />
            </div>
            <div className='h-[40px] w-[40px] self-end flex justify-center items-center rounded-full border border-primary-border'>
                <span className='text-[12px] text-secondary-alt uppercase font-haasBold'>
                    {position}
                </span>
            </div>
        </div>
    );
};

const Listing = ({ data, CategoriesData, backToCategories }) => {
    const { collections } = data;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortIndex, setSortIndex] = useState(null);
    const [updating, setUpdating] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id || loading) return;
        setProducts(prev => {
            const oldIndex = prev.findIndex(item => item.product._id === active.id);
            const newIndex = prev.findIndex(item => item.product._id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleSave = async () => {
        try {
            setUpdating(true);
            const orderedProducts = products.map((item, index) => ({ ...item, [sortIndex]: index + 1 }));
            await updateSortedProducts(orderedProducts);
            invalidatePath(`/subcategory/${collections.slug}`);
        } catch (error) {
            logError("Error saving data", error);
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        fetchCategoryProducts();
    }, [])


    const fetchCategoryProducts = async () => {
        try {
            const subCategoriesData = await fetchSubcategoriesData(collections._id);
            const subCategories = subCategoriesData?.subcategories || [];
            const collectionIds = [collections._id, ...subCategories.map(item => item._id)];
            const sortIndex = findSortIndexByCategory(CategoriesData, collections._id);
            setSortIndex(sortIndex)
            const sortedProducts = await fetchSortedProducts({
                collectionIds,
                limit: "infinite",
                sortIndex
            });
            setProducts(sortedProducts.items);
        } catch (error) {
            logError(`Error fetching category page data: ${error.message}`, error);
            return []
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='px-[50px] py-[20px] flex flex-col gap-y-[15px] max-lg:mt-3 '>
                <div className='w-full flex max-sm:flex-col items-center justify-between gap-y-[15px]'>
                    <span className='sm:text-[30px] sm:leading-[25px] text-[20px] block text-secondary-alt uppercase font-haasBold'>
                        {collections.name}
                    </span>
                    <div className='w-full grid grid-cols-2 gap-x-[10px] lg:max-w-[220px] '>
                        <button onClick={backToCategories} disabled={updating} className='tracking-[3px] hover:tracking-[5px] border border-secondary-alt hover:bg-secondary-alt hover:text-primary hover:font-haasBold transition-all h-[40px] text-secondary-alt uppercase text-[14px] font-haasRegular'>
                            Back
                        </button>
                        <button onClick={handleSave} disabled={updating} className='tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transition-all h-[40px] text-secondary-alt uppercase text-[14px] font-haasRegular'>
                            {updating ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>

                {loading && <p className='text-secondary-alt text-[20px] font-haasRegular uppercase col-span-3 mx-auto my-20'>Loading Products...</p>}

                {!loading && (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={products.map((item) => item.product._id)} strategy={rectSortingStrategy}>
                            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[12px]'>
                                {products.map((product, index) => (
                                    <Card
                                        key={product._id}
                                        id={product.product._id}
                                        data={product}
                                        position={index + 1}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default Listing;
