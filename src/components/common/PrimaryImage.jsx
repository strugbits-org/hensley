"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { generateImageURL, generateImageURLAlternate, generateSVGURL, generateCoreImageURL } from "@/utils/generateImageURL";
import { resolveCoreMediaUrl } from "@/utils";
import fallbackImage from "@/assets/fallback-img.png";

export const PrimaryImage = ({
    url,
    size,
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
    const lastDimsRef = useRef({ w: 0, h: 0 });
    const [src, setSrc] = useState();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();

    const resolveDimension = (measuredValue, fallbackValue, minimumValue) => {
        const numericMeasuredValue = Number(measuredValue) || 0;
        const numericFallbackValue = Number(fallbackValue) || 0;
        const numericMinimumValue = Number(minimumValue) || 0;

        return Math.max(numericMeasuredValue, numericFallbackValue, numericMinimumValue, 1);
    };

    // Suppress re-fetches during layout settle. Only re-fetch when the
    // container has grown meaningfully larger than any size we've already
    // fetched — a shrinking container can keep using the higher-resolution
    // image we already loaded (no visible flash, no aspect-crop jump from
    // the CDN re-cropping at a new size). Slider transitions and flex
    // reflows commonly cause shrink-then-grow churn that this skips.
    const SIZE_HYSTERESIS = 0.15;
    const dimsChangedMeaningfully = (nextW, nextH) => {
        const { w: prevW, h: prevH } = lastDimsRef.current;
        if (!prevW || !prevH) return true;
        const growW = (nextW - prevW) / prevW;
        const growH = (nextH - prevH) / prevH;
        return growW > SIZE_HYSTERESIS || growH > SIZE_HYSTERESIS;
    };

    const isWixUrl = (u) => typeof u === 'string' && (u.startsWith('wix:image://v1/') || u.startsWith('wix:vector://v1/'));

    const generateSrc = () => {
        if (!isWixUrl(url)) {
            // Core media path. Resolve to an absolute URL with no transform params
            // first; we'll add params from the live container measurement below.
            // (resolveCoreMediaUrl with no second arg still routes through the
            // transform-path guard so /transform/ is injected when the backend
            // hasn't deployed yet.)
            const baseUrl = resolveCoreMediaUrl(url);
            if (!baseUrl) return "";

            // Non-rasterable media (videos, SVGs, PDFs) — resolveCoreMediaUrl
            // already returned the raw URL without /transform/. Pass through.
            if (!baseUrl.includes("/transform/")) return baseUrl;

            if (ref.current) {
                const nextWidth = resolveDimension(ref.current.clientWidth, defaultDimensions?.width, min_w);
                const nextHeight = resolveDimension(ref.current.clientHeight, defaultDimensions?.height, min_h);

                // Layout-settle suppression: if we already have a URL and the
                // new container size is within the hysteresis band, keep the
                // current src to avoid the visible re-fetch flash.
                if (src && !dimsChangedMeaningfully(nextWidth, nextHeight)) {
                    return src;
                }

                // Track the largest dimensions we've requested on each axis
                // independently. A resize that is wider-but-shorter shouldn't
                // discard the taller image we already have, since the next
                // resize back to the original aspect would otherwise re-fetch.
                const requestW = Math.max(lastDimsRef.current.w || 0, nextWidth);
                const requestH = Math.max(lastDimsRef.current.h || 0, nextHeight);
                lastDimsRef.current = { w: requestW, h: requestH };
                setHeight(currentHeight => currentHeight === nextHeight ? currentHeight : nextHeight);
                setWidth(currentWidth => currentWidth === nextWidth ? currentWidth : nextWidth);
                return generateCoreImageURL({
                    url: baseUrl,
                    w: requestW,
                    h: requestH,
                    q: Number(q) || 75,
                    // PrimaryImage defaults `fit` to "fill"; that maps to the CDN
                    // default so we omit it from the query.
                    fit: fit === "fill" ? undefined : fit,
                    original,
                });
            }

            // Pre-mount: render with the legacy size hint so the first paint
            // isn't unbounded. ResizeObserver will refine this on mount.
            return resolveCoreMediaUrl(url, size);
        }

        if (original) return generateImageURL({ wix_url: url, original });

        if (ref.current) {
            const nextWidth = resolveDimension(ref.current.clientWidth, defaultDimensions?.width, min_w);
            const nextHeight = resolveDimension(ref.current.clientHeight, defaultDimensions?.height, min_h);

            if (src && !dimsChangedMeaningfully(nextWidth, nextHeight)) {
                return src;
            }

            // See Core-path comment above: track max dims per-axis so a
            // narrower-but-taller (or vice versa) resize doesn't drop the
            // already-loaded image.
            const requestW = Math.max(lastDimsRef.current.w || 0, nextWidth);
            const requestH = Math.max(lastDimsRef.current.h || 0, nextHeight);
            lastDimsRef.current = { w: requestW, h: requestH };
            setHeight(currentHeight => currentHeight === nextHeight ? currentHeight : nextHeight);
            setWidth(currentWidth => currentWidth === nextWidth ? currentWidth : nextWidth);

            switch (type) {
                case "default":
                    return generateImageURL({ wix_url: url, w: requestW, h: requestH, original, fit, q });
                case "alternate":
                    return generateImageURLAlternate({ wix_url: url, w: requestW, h: requestH, original, fit, q });
                case "svg":
                    return generateSVGURL(url);
                case "product":
                    return `${url}/v1/${fit}/w_${requestW},h_${requestH},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                case "insta":
                    return `https://static.wixstatic.com/media/${url}/v1/${fit}/w_${requestW},h_${requestH},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
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
