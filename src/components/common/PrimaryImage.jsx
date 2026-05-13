"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { generateImageURL, generateImageURLAlternate, generateSVGURL } from "@/utils/generateImageURL";
import { resolveCoreMediaUrl } from "@/utils";
import fallbackImage from "@/assets/fallback-img.png";

export const PrimaryImage = ({
    url,
    type = "default",
    original,
    fit = "fill",
    q = "90",
    min_w = 10,
    min_h = 10,
    customClasses = "",
    alt = "",
    attributes,
    defaultDimensions,
    timeout = 0,
    useNextImage = false,
    priority = false,
    loading = "lazy",
    sizes = "100vw",
    unoptimized = true
}) => {

    if (!url) return null;

    const ref = useRef();
    const [src, setSrc] = useState();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();

    const resolveDimension = (measuredValue, fallbackValue, minimumValue) => {
        const numericMeasuredValue = Number(measuredValue) || 0;
        const numericFallbackValue = Number(fallbackValue) || 0;
        const numericMinimumValue = Number(minimumValue) || 0;

        return Math.max(numericMeasuredValue, numericFallbackValue, numericMinimumValue, 1);
    };

    const isWixUrl = (u) => typeof u === 'string' && (u.startsWith('wix:image://v1/') || u.startsWith('wix:vector://v1/'));

    const generateSrc = () => {
        if (!isWixUrl(url)) return resolveCoreMediaUrl(url);

        if (original) return generateImageURL({ wix_url: url, original });

        if (ref.current) {
            const nextWidth = resolveDimension(ref.current.clientWidth, defaultDimensions?.width, min_w);
            const nextHeight = resolveDimension(ref.current.clientHeight, defaultDimensions?.height, min_h);

            setHeight(currentHeight => currentHeight === nextHeight ? currentHeight : nextHeight);
            setWidth(currentWidth => currentWidth === nextWidth ? currentWidth : nextWidth);

            switch (type) {
                case "default":
                    return generateImageURL({ wix_url: url, w: nextWidth, h: nextHeight, original, fit, q });
                case "alternate":
                    return generateImageURLAlternate({ wix_url: url, w: nextWidth, h: nextHeight, original, fit, q });
                case "svg":
                    return generateSVGURL(url);
                case "product":
                    return `${url}/v1/${fit}/w_${nextWidth},h_${nextHeight},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                case "insta":
                    return `https://static.wixstatic.com/media/${url}/v1/${fit}/w_${nextWidth},h_${nextHeight},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                default:
                    return "";
            }
        }

        return generateImageURL({ wix_url: url, original, fit, q });
    };

    const handleResize = () => {
        const newSrc = generateSrc();
        setSrc(currentSrc => currentSrc === newSrc ? currentSrc : newSrc);
    };

    useEffect(() => {
        let timeoutId;
        let observer;

        if (timeout > 0) {
            timeoutId = window.setTimeout(handleResize, timeout);
        } else {
            handleResize();
        }

        if (typeof ResizeObserver !== 'undefined' && ref.current) {
            observer = new ResizeObserver(() => {
                handleResize();
            });
            observer.observe(ref.current);
        } else {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }

            if (observer) {
                observer.disconnect();
            } else {
                window.removeEventListener('resize', handleResize);
            }
        };

    }, [url, defaultDimensions?.height, defaultDimensions?.width, fit, min_h, min_w, original, q, timeout, type]);


    return (
        <>
            {useNextImage && src && height && width ?
                <Image ref={ref} src={src} quality={Number(q)} priority={priority} loading={priority ? "eager" : loading} sizes={sizes} unoptimized={unoptimized} height={height} width={width} className={customClasses} {...attributes} alt={alt} />
                : <img
                    ref={ref}
                    src={src || fallbackImage.src}
                    className={customClasses}
                    alt={alt}
                    loading={loading}
                    decoding="async"
                    fetchPriority={priority ? "high" : "auto"}
                    {...attributes}
                />
            }
        </>
    );
};
