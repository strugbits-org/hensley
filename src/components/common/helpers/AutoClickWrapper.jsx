import { useEffect, useRef } from 'react';

const AutoClickWrapper = ({ children, onIntersect, rootMargin = '600px' }) => {
    const elementRef = useRef(null);

    useEffect(() => {
        if (!window.IntersectionObserver) return;
        const element = elementRef.current;
        if (!element) return;

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
            });
        };

        // rootMargin extends the viewport so load-more fires before the sentinel
        // is actually reached — the next batch is usually in-flight (or done) by
        // the time the user scrolls to the bottom of the current one.
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin,
            threshold: 0,
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [onIntersect, rootMargin]);

    return (
        <div ref={elementRef}>
            {children}
        </div>
    );
};

export default AutoClickWrapper;