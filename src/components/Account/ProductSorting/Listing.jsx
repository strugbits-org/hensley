'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import image from '@/assets/product-set-1.png'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// === Sortable Card Component ===
const Card = ({ id, title, position }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: !isDragging ? transition ?? 'transform 200ms ease' : undefined,
    zIndex: isDragging ? 999 : 'auto', // optional: bring dragged card on top
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
        {title}
      </span>
      <div className='w-full px-[20px] h-[274px]'>
        <Image
          src={image}
          className='h-full w-full object-contain'
          width={200}
          height={200}
          alt='product image'
        />
      </div>
      <div className='h-[40px] w-[40px] self-end flex justify-center items-center rounded-full border border-primary-border'>
        <span className='text-[12px] text-secondary-alt uppercase font-haasBold'>
          {position}
        </span>
      </div>
    </div>
  );
};


// === Initial Data ===
const initialData = [
    {
        id: '1',
        title: 'vintage - dance floor',
        image: '/product-set-1.png',
    },
    {
        id: '2',
        title: 'modern - stage decor',
        image: '/product-set-1.png',
    },
    {
        id: '3',
        title: 'boho - lounge area',
        image: '/product-set-1.png',
    },
    {
        id: '4',
        title: 'elegant - centerpiece',
        image: '/product-set-1.png',
    },
    {
        id: '5',
        title: 'rustic - bar setup',
        image: '/product-set-1.png',
    },
];

// === Main Component ===
const Listing = () => {
    const [items, setItems] = useState(initialData);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setItems((prevItems) => arrayMove(prevItems, oldIndex, newIndex));
        }
    };

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='px-[50px] py-[20px] flex flex-col gap-y-[15px] max-lg:mt-3 '>
                <div className='w-full flex max-sm:flex-col items-center justify-between gap-y-[15px]'>
                    <span className='sm:text-[30px] sm:leading-[25px] text-[20px] block text-secondary-alt uppercase font-haasBold'>
                        Additional Products
                    </span>
                    <div className='w-full grid grid-cols-2 gap-x-[10px] lg:max-w-[220px] '>
                        <button className='tracking-[3px] hover:tracking-[5px] border border-black hover:font-haasBold transition-all h-[40px] text-secondary-alt uppercase text-[14px] font-haasRegular'>
                            Back
                        </button>
                        <button className='tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transition-all h-[40px] text-secondary-alt uppercase text-[14px] font-haasRegular'>
                            Save
                        </button>
                    </div>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-[12px]'>
                            {items.map((item, index) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    image={item.image}
                                    position={index + 1}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default Listing;
