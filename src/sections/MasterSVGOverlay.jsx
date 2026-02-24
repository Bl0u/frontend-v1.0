import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MasterSVGOverlay.css';

gsap.registerPlugin(ScrollTrigger);

export const MasterSVGOverlay = ({ skipAnimation = false }) => {
    const containerRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        if (skipAnimation) return;

        const path = pathRef.current;
        if (!path) return;

        // Measure the total length of the SVG path
        const length = path.getTotalLength();

        // Set initial state: full dash = hidden
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        // Animate stroke-dashoffset based on scroll
        const tween = gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",   // Start drawing shortly after entering viewport
                end: "bottom bottom", // Finish drawing when reaching the bottom of the container
                scrub: 0.5,           // Tighter sync
                invalidateOnRefresh: true,
            }
        });

        return () => {
            if (tween.scrollTrigger) tween.scrollTrigger.kill();
            tween.kill();
        };
    }, [skipAnimation]);

    return (
        <div ref={containerRef} className="master-svg-overlay h-full">
            <svg
                viewBox="0 0 2076 7090"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <path
                    ref={pathRef}
                    d=""
                />
            </svg>
        </div>
    );
};
