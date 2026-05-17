import { useEffect, useRef } from 'react';

const AutoClickWrapper = ({ children, onIntersect }) => {
    const elementRef = useRef(null);

    useEffect(() => {
        if (!window.IntersectionObserver) return;
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            // Fire the intersection well before the sentinel actually reaches
            // the viewport so the next page of products is already fetching
            // by the time the user scrolls down to it. 800px is roughly the
            // height of one row of cards on mobile and two on desktop —
            // enough lead time that load-more feels instant at normal scroll
            // speed, but not so much that we prefetch pages the user never
            // visits.
            rootMargin: '400px',
            threshold: 0,
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [onIntersect]);

    return (
        <div ref={elementRef}>
            {children}
        </div>
    );
};

export default AutoClickWrapper;