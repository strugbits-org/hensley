"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { generateImageURL } from "@/utils/generateImageURL";
import { debounce } from 'lodash';
import Image from 'next/image';

export const PrimaryImage = ({
    url,
    type = "default",
    original = false,
    fit = "fill",
    q = "90",
    min_w,
    min_h,
    customClasses = "",
    alt = "",
    attributes = {},
    defaultDimensions = { width: 400, height: 300 },
    timeout = 200,
    useNextImage = false
}) => {
    if (!url) return null;

    const ref = useRef(null);
    const [dimensions, setDimensions] = useState({
        width: defaultDimensions.width,
        height: defaultDimensions.height
    });
    const [isLoaded, setIsLoaded] = useState(false);

    const generateSrc = useMemo(() => {
        if (original) return generateImageURL({ wix_url: url, original });

        const { width, height } = dimensions;

        switch (type) {
            case "default":
                return generateImageURL({ wix_url: url, w: width, h: height, original, fit, q });
            case "product":
                return `${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
            case "insta":
                return `https://static.wixstatic.com/media/${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
            default:
                return "";
        }
    }, [url, type, original, fit, q, dimensions]);

    const updateDimensions = () => {
        if (!ref.current) return;

        const newWidth = ref.current.clientWidth;
        const newHeight = ref.current.clientHeight;

        const width = min_w && min_w > newWidth ? min_w : newWidth || defaultDimensions.width;
        const height = min_h && min_h > newHeight ? min_h : newHeight || defaultDimensions.height;

        if (width !== dimensions.width || height !== dimensions.height) {
            setDimensions({ width, height });
        }
    };

    const handleResize = useMemo(() =>
        debounce(updateDimensions, 200),
        []);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateDimensions();
            setIsLoaded(true);
        }, timeout);

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            handleResize.cancel();
            window.removeEventListener('resize', handleResize);
        };
    }, [timeout, handleResize]);

    const imageProps = {
        ref,
        className: customClasses,
        alt: alt || "Image",
        ...attributes
    };

    if (!isLoaded && !original) return <div ref={ref} className={customClasses} />;

    return useNextImage ? (
        <Image
            {...imageProps}
            src={generateSrc}
            width={dimensions.width}
            height={dimensions.height}
            quality={parseInt(q, 10)}
            loading="eager"
        />
    ) : (
        <img
            {...imageProps}
            src={generateSrc}
        />
    );
};