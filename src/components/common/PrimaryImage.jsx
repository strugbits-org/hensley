"use client"
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { generateImageURL, generateImageURLAlternate, generateSVGURL } from "@/utils/generateImageURL";
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
    max_w,
    max_h,
    customClasses = "",
    alt = "",
    attributes = {},
    defaultDimensions = { width: 400, height: 300 },
    timeout = 200,
    useNextImage = false
}) => {
    if (!url) return null;

    const ref = useRef(null);
    const dimensionsRef = useRef({
        lastUpdated: 0,
        initialSetComplete: false
    });

    const [dimensions, setDimensions] = useState(() => {
        // Apply max constraints to default dimensions if provided
        let width = defaultDimensions.width;
        let height = defaultDimensions.height;

        if (max_w && width > max_w) width = max_w;
        if (max_h && height > max_h) height = max_h;

        return { width, height };
    });
    const [isLoaded, setIsLoaded] = useState(false);

    const generateSrc = useMemo(() => {
        // Return early if we don't have valid dimensions yet
        if (!isLoaded && !original) return "";
        if (original) return generateImageURL({ wix_url: url, original });

        const { width, height } = dimensions;

        // Ensure we have valid dimensions before generating URLs
        if (!width || !height || width <= 0 || height <= 0) return "";

        try {
            switch (type) {
                case "default":
                    return generateImageURL({ wix_url: url, w: width, h: height, original, fit, q });
                case "alternate":
                    return generateImageURLAlternate({ wix_url: url, w: width, h: height, original, fit, q });
                case "svg":
                    return generateSVGURL(url);
                case "product":
                    return `${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                case "insta":
                    return `https://static.wixstatic.com/media/${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                default:
                    return "";
            }
        } catch (error) {
            console.error("Error generating image URL:", error);
            return "";
        }
    }, [url, type, original, fit, q, dimensions, isLoaded]);

    const updateDimensions = useCallback(() => {
        if (!ref.current) return;

        // Throttle updates - no more than once every 300ms
        const now = Date.now();
        if (now - dimensionsRef.current.lastUpdated < 300 && dimensionsRef.current.initialSetComplete) {
            return;
        }

        const newWidth = ref.current.clientWidth;
        const newHeight = ref.current.clientHeight;

        // Don't update if we don't have valid dimensions from the DOM yet
        if (newWidth === 0 && newHeight === 0 && !dimensionsRef.current.initialSetComplete) {
            return;
        }

        // Apply min/max constraints
        let width = min_w && min_w > newWidth ? min_w : newWidth || defaultDimensions.width;
        let height = min_h && min_h > newHeight ? min_h : newHeight || defaultDimensions.height;

        // Apply max constraints if provided
        if (max_w && width > max_w) width = max_w;
        if (max_h && height > max_h) height = max_h;

        // Use a functional update to avoid the dependency on dimensions
        setDimensions(prevDimensions => {
            if (width !== prevDimensions.width || height !== prevDimensions.height) {
                // Update the timestamp
                dimensionsRef.current.lastUpdated = now;
                dimensionsRef.current.initialSetComplete = true;
                return { width, height };
            }
            return prevDimensions;
        });
    }, [min_w, min_h, max_w, max_h, defaultDimensions]);

    const handleResize = useMemo(() =>
        debounce(updateDimensions, 200),
        [updateDimensions]);
        
    useEffect(() => {
        let isComponentMounted = true;

        // Initialize dimensions only once when component mounts
        const timer = setTimeout(() => {
            if (isComponentMounted) {
                updateDimensions();
                setIsLoaded(true);
            }
        }, timeout);

        // Only add the resize listener after the initial dimension setting
        window.addEventListener('resize', handleResize);

        return () => {
            isComponentMounted = false;
            clearTimeout(timer);
            handleResize.cancel();
            window.removeEventListener('resize', handleResize);
        };
    }, [timeout, handleResize, updateDimensions]);

    const imageProps = {
        ref,
        className: customClasses,
        alt: alt || "Image",
        ...attributes
    };

    // Only show placeholder while loading
    if (!isLoaded && !original) {
        return <div ref={ref} className={customClasses} />;
    }

    // Don't render image if we don't have a valid source
    const src = generateSrc;
    if (!src) {
        return <div ref={ref} className={customClasses} />;
    }

    return useNextImage ? (
        <Image
            {...imageProps}
            src={src}
            width={dimensions.width}
            height={dimensions.height}
            quality={parseInt(q, 10)}
            loading="eager"
        />
    ) : (
        <img
            {...imageProps}
            src={src}
        />
    );
};