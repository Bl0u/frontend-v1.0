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
                    d="M1049 0V132.5H1285.5V246H1799V1060L1882 1017.5L1834.5 1003.5L1964.5 972.5L1903 958.5L2073.5 946.5L2016.5 989H2073.5L1964.5 1029.5H2073.5L1799 1150L1733 1003.5L1718.5 1060H230L289.5 1114.5M289.5 1114.5L100 1060L133 1114.5L-6.5 1060L50.5 1114.5H289.5ZM289.5 1114.5V1793.5H1796.5V2579.5H289.5V4150.5H1037V4335.5H1856V5199L1874.5 6633H1056V7089.5"
                />
            </svg>
        </div>
    );
};
