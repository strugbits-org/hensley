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
            threshold: 0.1,
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