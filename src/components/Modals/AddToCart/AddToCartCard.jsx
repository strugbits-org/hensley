import React from 'react';
import { CustomLink } from '@/components/common/CustomLink';
import Image from 'next/image';
import image from '@/assets/chair.png'

function AddToCartCard({ data, onAddToCart, type = 'listing' }) {
    return (
        <CustomLink to={`/product/${'/'}`} className={`relative w-full group transition-all duration-300 ease-in-out flex flex-col p-2 justify-between h-full `}>
            <div className={`h-full overflow-hidden flex justify-center items-center ${type === 'listing' ? 'bg-white' : ''}`}>
                {/* <PrimaryImage timeout={50} alt={name} url={mainMedia} fit='fit' customClasses={"min-h-[217px] md:min-h-[263px] 2xl:min-h-[515px] max-h-[550px] h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"} /> */}
                <Image src={image} className='h-full w-full'/>
            </div>
        </CustomLink>
    );
}

export default AddToCartCard;
