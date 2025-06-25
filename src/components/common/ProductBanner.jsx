import React, { useEffect, useRef, useState } from 'react';
import 'animate.css';
import { PrimaryImage } from './PrimaryImage';
import { CustomLink } from './CustomLink';

export const ProductBanner = ({ data }) => {
  const { title, image, url } = data;
  const titleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Only animate once
        }
      },
      { threshold: 0.3 } // Adjust threshold as needed
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  return (
    <div className="relative col-span-3 h-[400px] sm:h-[230px] lg:h-[425px] border my-[24px]">
      <PrimaryImage
        url={image}
        alt={`Banner for ${title}`}
        fit='fit'
        min_w={1920}
        customClasses="w-full h-full absolute inset-0 object-cover"
      />
      <CustomLink
        to={url}
        className="absolute inset-0 z-20 flex justify-end items-center lg:gap-x-[24px] sm:gap-x-[10px] lg:mr-[239px] sm:mr-[100px] gap-x-[15px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 132.853 132.854"
          className=" h-[110px] w-[110px] sm:h-[70px] sm:w-[70px] lg:h-[132px] lg:w-[132px]"
        >
          <g transform="translate(0.702 0.379)">
            <g transform="translate(-0.377 0.121)">
              <path
                d="M.353.5H131.881V132.028"
                transform="translate(0.147 -0.501)"
                fill="none"
                stroke="#F4F1EC"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <line
                x1="132"
                y2="132"
                transform="translate(0.028 0)"
                fill="none"
                stroke="#F4F1EC"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
              <line
                x1="132"
                y2="132"
                transform="translate(0.028 0)"
                fill="none"
                stroke="#F4F1EC"
                strokeMiterlimit="10"
                strokeWidth="1"
              />
            </g>
          </g>
        </svg>
        <h3
          ref={titleRef}
          className={`text-primary-alt font-haasRegular
            text-[20px]
          lg:text-[27px] lg:leading-[30px]
          uppercase max-w-[160px] lg:max-w-[200px]
          ${isVisible ? 'animate__animated animate__fadeInUp' : 'opacity-0'}
        `}
        >
          {title}
        </h3>
      </CustomLink>
    </div>
  );
};
