import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './MorphingCTA.css';
import '../styles/MaskAnimations.css';

gsap.registerPlugin(ScrollTrigger);

const MorphingCTA = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(containerRef);

            const featuresWrap = q(".morph-features")[0];
            const searchBar = q(".morph-search-bar")[0];
            const successText = q(".morph-success-text")[0];
            const featureEls = q(".morph-feature");
            const bgEls = q(".morph-feature-bg");
            const contentEls = q(".morph-feature-content");
            const buttonTextItems = q(".morph-search-bar .mas, .morph-search-bar .mask-btn-urban"); // Select inner text
            const extraContent = q(".morph-extra-content")[0];
            const lottieWrap = q(".morph-lottie-container")[0];

            if (!featuresWrap || !searchBar || featureEls.length === 0) return;

            // Ensure initial visibility and pixel-perfect centering (overriding CSS)
            gsap.set(featureEls, { opacity: 1, visibility: 'visible', xPercent: -50, yPercent: -50 });
            gsap.set(searchBar, {
                opacity: 0,
                visibility: 'visible',
                xPercent: -50,
                yPercent: -50,
                top: "50%",
                left: "50%",
                y: 0
            });

            if (successText) gsap.set(successText, { opacity: 0 });

            // Hide button text initially so it doesn't show during morph/expansion
            gsap.set(buttonTextItems, { opacity: 0 });
            // Hide extra content initially
            if (extraContent) gsap.set(extraContent, { opacity: 0, y: 20 });
            // Hide Lottie initially
            if (lottieWrap) gsap.set(lottieWrap, { opacity: 0, scale: 0.8 });

            // Start positions (percent inside .morph-features box)
            const startPos = [
                { top: 25, left: 15 },
                { top: 15, left: 50 },
                { top: 25, left: 85 },
                { top: 65, left: 20 },
                { top: 75, left: 75 },
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
                    end: "+=3000", // Scroll distance (Increased for more "frames" and smoother transition)
                    scrub: 3.0, // Added more latency for liquid-smooth momentum
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // ---- PHASE A: move all features to center
            // Duration 1.0 + stagger 0.05 for 5 items = 1.2s total convergence
            tl.to(featureEls, {
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
                duration: 1.0,
                ease: "none",
                stagger: 0.05,
            }, 0);

            // ---- PHASE B: shrink backgrounds into circles
            tl.to(bgEls, {
                width: circlePx,
                height: circlePx,
                borderRadius: 999,
                borderWidth: 0.35 * remPx,
                duration: 1.0,
                ease: "none",
                stagger: 0.05,
            }, 0);

            // ---- PHASE C: fade feature text away
            tl.to(contentEls, {
                opacity: 0,
                duration: 0.15,
                ease: "none",
                stagger: 0.02,
            }, 0.05);

            // ---- PHASE D: fade the features out
            // Start at 0.72 (40% before the last item finishes convergence at 1.2)
            tl.to(featureEls, {
                opacity: 0,
                duration: 0.3, // Slightly longer fade to blend better with convergence
                ease: "none",
            }, 0.65);

            // ---- PHASE E: reveal search bar (button container) 
            // Origin at center (explicitly set above in initialization)
            tl.to(searchBar, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.3,
                ease: "none",
            }, 0.65);

            // ---- PHASE F: expand button and move it down slightly
            // Start growth even before icons reach the center (at 1.0s)
            tl.to(searchBar, {
                width: () => `${getFinalWidthRem()}rem`,
                height: `${buttonHpx}px`,
                y: 100,
                duration: 1.0,
                ease: "power4.inOut",
            }, 0.9);

            // ---- PHASE G: Reveal Button Text (Delayed until expansion is done)
            tl.to(buttonTextItems, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out"
            }, ">"); // Starts after previous animation (expansion) ends

            // ---- PHASE H: Transition ownership of background to inner mask button
            tl.to(searchBar, {
                background: "transparent",
                boxShadow: "none",
                duration: 0.1
            }, "<");

            // ---- PHASE I: Show "Success" text AND Extra Content
            if (successText) {
                tl.to(successText, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                }, "<"); // Run simultaneously
            }

            if (extraContent) {
                tl.to(extraContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                }, "<+=0.1"); // Start slightly after
            }

            if (lottieWrap) {
                tl.to(lottieWrap, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                }, "<"); // Run with extra content
            }

        }, containerRef); // Scope selector to containerRef

        return () => ctx.revert();
    }, []);

    return (
        <section className="morph-cta-container" ref={containerRef}>
            {/* --- 3D Decorative Objects (Star & Spring) --- */}
            <motion.img
                src="/assets/star.png"
                alt="Star 3D"
                width={360}
                className="absolute hidden md:block"
                style={{
                    left: '5%',
                    top: '5%',
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

            <motion.img
                src="/assets/spring.png"
                alt="Spring 3D"
                width={360}
                className="absolute hidden md:block"
                style={{
                    right: '5%',
                    bottom: '10%',
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

            {/* --- Lottie Animation (Revealed after morph) --- */}
            <div className="morph-lottie-container">
                <DotLottieReact
                    src="https://lottie.host/5f9926e9-1817-4421-8b72-707662e1984a/VvIJVUf9g5.lottie"
                    loop
                    autoplay
                />
            </div>

            {/* Header Text */}
            <div className="morph-header">
                <h2
                    className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text drop-shadow-sm mb-4"
                    style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                >
                    Ready to find your... <span className="morph-success-text" style={{ opacity: 0 }}>Success</span>
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

                {/* Feature 4: PRO-BONO MENTORSHIPS */}
                <div className="morph-feature">
                    <div className="morph-feature-bg"></div>
                    <div className="morph-feature-content">
                        <p>PRO-BONO MENTORSHIPS</p>
                    </div>
                </div>

                {/* Feature 5: AI ASSISTANT */}
                <div className="morph-feature">
                    <div className="morph-feature-bg"></div>
                    <div className="morph-feature-content">
                        <p>AI ASSISTANT</p>
                    </div>
                </div>

                {/* The thing we morph into: Wrapper Container for Mask Button */}
                <div className="morph-search-bar mask-container-urban">
                    <span className="mas">Sign up for free</span>
                    <Link to="/register" className="mask-btn-urban">
                        Sign up for free
                    </Link>
                </div>

                {/* Extra content revealed at the end */}
                <div className="morph-extra-content">
                    <p>Join thousands of students and build your future.</p>
                </div>
            </div>
        </section>
    );
};

export default MorphingCTA;
