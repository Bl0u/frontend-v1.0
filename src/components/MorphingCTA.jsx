import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import './MorphingCTA.css';

gsap.registerPlugin(ScrollTrigger);

const MorphingCTA = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const featuresWrap = document.querySelector(".morph-features");
            const searchBar = document.querySelector(".morph-search-bar");
            const searchText = document.querySelector(".morph-search-bar p");
            const featureEls = gsap.utils.toArray(".morph-feature");
            const bgEls = gsap.utils.toArray(".morph-feature-bg");
            const contentEls = gsap.utils.toArray(".morph-feature-content");

            if (!featuresWrap || !searchBar || featureEls.length === 0) return;

            // Ensure initial visibility - CRITICAL FIX
            gsap.set(featureEls, { opacity: 1, visibility: 'visible' });
            gsap.set(searchBar, { opacity: 0, visibility: 'visible' });

            // Start positions (percent inside .morph-features box)
            const startPos = [
                { top: 25, left: 20 },
                { top: 15, left: 50 },
                { top: 25, left: 80 },
            ];

            // Place features initially
            featureEls.forEach((el, i) => {
                if (startPos[i]) {
                    gsap.set(el, { top: `${startPos[i].top}%`, left: `${startPos[i].left}%` });
                }
            });

            // helper: rem in px
            const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const circlePx = 3 * remPx; // 3rem
            const buttonHpx = 5 * remPx; // 5rem

            // Calculate final width based on screen size
            const getFinalWidthRem = () => (window.innerWidth < 640 ? 18 : 22);

            // Timeline driven by scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top", // Start when top of section hits top of viewport
                    end: "+=2000", // Scroll distance
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // ---- PHASE A: move all 3 features to center
            tl.to(featureEls, {
                top: "50%",
                left: "50%",
                duration: 1,
                ease: "none",
                stagger: 0.04,
            }, 0);

            // ---- PHASE B: shrink backgrounds into circles
            tl.to(bgEls, {
                width: circlePx,
                height: circlePx,
                borderRadius: 999,
                borderWidth: 0.35 * remPx,
                duration: 1,
                ease: "none",
                stagger: 0.04,
            }, 0);

            // ---- PHASE C: fade feature text away
            tl.to(contentEls, {
                opacity: 0,
                duration: 0.25,
                ease: "none",
                stagger: 0.02,
            }, 0.15);

            // ---- PHASE D: fade the 3 features out
            tl.to(featureEls, {
                opacity: 0,
                duration: 0.25,
                ease: "none",
            }, 0.55);

            // ---- PHASE E: reveal search bar (button) where the merge happened
            tl.to(searchBar, {
                opacity: 1,
                pointerEvents: "auto", // Enable clicks
                duration: 0.15,
                ease: "none",
            }, 0.55);

            // ---- PHASE F: expand button and move it down slightly
            tl.to(searchBar, {
                width: () => `${getFinalWidthRem()}rem`,
                height: `${buttonHpx}px`,
                y: 100, // Move down in px instead of percent for stability
                duration: 0.8,
                ease: "power2.out",
            }, 0.62);

            // ---- PHASE G: show text
            tl.to(searchText, {
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
            }, 0.85);

        }, containerRef); // Scope selector to containerRef

        return () => ctx.revert();
    }, []);

    return (
        <section className="morph-cta-container" ref={containerRef}>
            {/* --- 3D Decorative Objects (Star & Spring) --- */}
            {/* Star Image - Floating Left */}
            <motion.img
                src="/assets/star.png"
                alt="Star 3D"
                width={360}
                className="absolute hidden md:block" // Hide on small screens if needed
                style={{
                    left: '-10%',
                    top: '-10%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0.9
                }}
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Spring Image - Floating Right */}
            <motion.img
                src="/assets/spring.png"
                alt="Spring 3D"
                width={360}
                className="absolute hidden md:block"
                style={{
                    right: '-10%',
                    bottom: '-5%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0.9
                }}
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Header Text */}
            <div className="morph-header">
                <h2
                    className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text drop-shadow-sm mb-4"
                    style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                >
                    Ready to find your...
                </h2>
            </div>


            <div className="morph-features">
                {/* Feature 1: MENTOR */}
                <div className="morph-feature">
                    <div className="morph-feature-bg"></div>
                    <div className="morph-feature-content">
                        <p>MENTOR</p>
                    </div>
                </div>

                {/* Feature 2: PARTNER */}
                <div className="morph-feature">
                    <div className="morph-feature-bg"></div>
                    <div className="morph-feature-content">
                        <p>PARTNER</p>
                    </div>
                </div>

                {/* Feature 3: RESOURCES */}
                <div className="morph-feature">
                    <div className="morph-feature-bg"></div>
                    <div className="morph-feature-content">
                        <p>RESOURCES</p>
                    </div>
                </div>

                {/* The thing we morph into: Sign Up Button */}
                <Link to="/register" className="morph-search-bar">
                    <p>Sign up for free</p>
                </Link>
            </div>
        </section>
    );
};

export default MorphingCTA;
