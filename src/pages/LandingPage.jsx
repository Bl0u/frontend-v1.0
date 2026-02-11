
import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg'; // Ensure this path is correct
import { Header } from '../sections/Header';
import { Hero } from '../sections/Hero';
import { LogoTicker } from '../sections/LogoTicker';
import { ProductShowcase } from '../sections/ProductShowcase';
import { Pricing } from '../sections/Pricing';
import { Testimonials } from '../sections/Testimonials';
import { CallToAction } from '../sections/CallToAction';
import { Footer } from '../sections/Footer';

const LandingPage = () => {
    const containerRef = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const maskContainerRef = useRef(null);
    const heroContentRef = useRef(null);
    const headerRef = useRef(null);
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            // Total scroll height is defined by the container's height (e.g., 800vh)
            const totalScrollHeight = containerRef.current ? containerRef.current.offsetHeight - windowHeight : 0;
            const progress = Math.min(Math.max(scrollY / windowHeight, 0), 8); // Normalized roughly to vh units

            // --- ANIMATION TIMELINE ---

            // 1. Text Sequence (0 - 3.5)
            // Helper: Fade in/out
            const fade = (start, duration, hold) => {
                if (progress < start) return 0;
                if (progress < start + duration) return (progress - start) / duration; // In
                if (progress < start + duration + hold) return 1; // Hold
                if (progress < start + (duration * 2) + hold) return 1 - (progress - (start + duration + hold)) / duration; // Out
                return 0;
            };

            if (text1Ref.current) text1Ref.current.style.opacity = fade(0, 0.5, 0.5); // "Here..."
            if (text2Ref.current) text2Ref.current.style.opacity = fade(1.2, 0.5, 0.5); // "Is your road..."
            // "Towards Success" sequence stays a bit longer before masking starts
            if (text3Ref.current) text3Ref.current.style.opacity = fade(2.4, 0.5, 1.0);

            // 2. Mask Animation (3.5 - 6.5)
            const maskStart = 3.5;
            const zoomStart = 3.8;
            const zoomEnd = 6.5;

            if (maskContainerRef.current) {
                // Fade in the masked container (it starts hidden)
                let maskOpacity = 0;
                if (progress > maskStart) {
                    maskOpacity = Math.min((progress - maskStart) / 0.5, 1);
                }
                maskContainerRef.current.style.opacity = maskOpacity;

                // Zoom Effect
                // Scale starts at ~20% (text size) and zooms into huge to reveal content inside
                let scale = 15; // Initial size in %
                if (progress > zoomStart) {
                    const zoomProgress = Math.min((progress - zoomStart) / (zoomEnd - zoomStart), 1);
                    // Exponential easing for that "flight through" feeling
                    scale = 15 + Math.pow(zoomProgress, 4) * 5000;
                }

                const maskSize = `${scale}%`;
                maskContainerRef.current.style.maskSize = maskSize;
                maskContainerRef.current.style.webkitMaskSize = maskSize;
            }

            // 3. Hero Content Reveal (6.5 - 7.5)
            // The Hero component itself is inside the mask. 
            // We might want to fade in specific elements *inside* Hero if they have their own refs, 
            // but for now, the mask reveal does the job for the *background/shape*.
            // If Hero has text/buttons, we might want to toggle a class or opacity on them.
            // Let's assume the Hero is fully visible once mask is huge.

            // 4. Navbar & Content Flow (7.5+)
            if (headerRef.current) {
                let headerOpacity = 0;
                if (progress > 7.0) {
                    headerOpacity = Math.min((progress - 7.0) / 0.5, 1);
                }
                headerRef.current.style.opacity = headerOpacity;
                headerRef.current.style.pointerEvents = headerOpacity > 0.5 ? 'auto' : 'none';
            }

            // Un-fix logic if we wanted to scroll naturally after animation,
            // but for this pattern, we usually map the rest of the page *after* the scroll spacer.
            // However, React structure here puts sections *below*. 
            // So we need to make sure the "Following" sections appear naturally after the Spacer.
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="landing-scroll-container">
            {/* Fixed/Sticky Viewport */}
            <div className="landing-sticky-viewport">

                {/* 1. Intro Text Layer */}
                <div className="intro-text-layer">
                    <h1 ref={text1Ref} className="intro-text" style={{ opacity: 0 }}>Here ...</h1>
                    <h1 ref={text2Ref} className="intro-text" style={{ opacity: 0 }}>Is your road ...</h1>
                    <h1 ref={text3Ref} className="intro-text" style={{ opacity: 0 }}>Towards Success</h1>
                </div>

                {/* 2. Masked Hero Layer */}
                <div ref={maskContainerRef} className="masked-hero-layer" style={{ opacity: 0 }}>
                    {/* The Hero is rendered here. 
                        Crucially, the 'mask-image' CSS on parent will cut this. 
                    */}
                    <div className="hero-content-wrapper">
                        <Hero />
                    </div>
                </div>

                {/* 3. Header (Hidden initially) */}
                <div ref={headerRef} className="header-layer" style={{ opacity: 0 }}>
                    <Header />
                </div>
            </div>

            {/* Spacer to create scrollable height */}
            <div style={{ height: '800vh' }}></div>

            {/* Rest of the Page content flows after the spacer */}
            <div className="relative z-10 bg-white">
                <LogoTicker />
                <ProductShowcase />
                <Pricing />
                <Testimonials />
                <CallToAction />
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
