
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
import MorphingCTA from '../components/MorphingCTA';
import "../fonts/style/fontsStyle.css";

const LandingPage = () => {
    const containerRef = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const maskContainerRef = useRef(null);
    const headerRef = useRef(null);
    const stickyViewportRef = useRef(null);
    const [heroContentVisible, setHeroContentVisible] = useState(false);

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

            if (text1Ref.current) text1Ref.current.style.opacity = fade(0, 0.2, 0.1); // "Here..."
            if (text2Ref.current) text2Ref.current.style.opacity = fade(0.3, 0.2, 0.1); // "Is your road..."
            // "Towards Success" sequence stays a bit longer before masking starts
            if (text3Ref.current) text3Ref.current.style.opacity = fade(0.6, 0.2, 0.4);

            // 2. Mask Animation (3.5 - 6.5)
            const maskStart = 1.3;
            const zoomStart = 1.5;
            const zoomEnd = 4.0;

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
                    scale = 15 + Math.pow(zoomProgress, 3) * 10000;
                }

                const maskSize = `${scale}%`;
                maskContainerRef.current.style.maskSize = maskSize;
                maskContainerRef.current.style.webkitMaskSize = maskSize;
            }

            // 3. Hero Content Reveal & Navbar (Trigger at ~80% of zoom, around 6.0)
            const revealThreshold = 3.5;
            if (progress > revealThreshold) {
                setHeroContentVisible(true);
            } else {
                setHeroContentVisible(false);
            }

            // 4. Navbar - visible only during hero section
            const heroEndScroll = windowHeight * 8; // 800vh spacer height
            const isPastHero = scrollY >= heroEndScroll;

            // Hide the entire sticky viewport once past the hero
            if (stickyViewportRef.current) {
                stickyViewportRef.current.style.display = isPastHero ? 'none' : '';
            }

            if (headerRef.current) {
                if (isPastHero) {
                    // Completely hide navbar after hero section
                    headerRef.current.style.opacity = 0;
                    headerRef.current.style.pointerEvents = 'none';
                    headerRef.current.style.display = 'none';
                } else {
                    headerRef.current.style.display = '';
                    let headerOpacity = 0;
                    if (progress > revealThreshold) {
                        headerOpacity = Math.min((progress - revealThreshold) / 0.5, 1);
                        // Fade out as we approach the end of the hero section
                        const fadeOutStart = heroEndScroll - windowHeight;
                        if (scrollY > fadeOutStart) {
                            const fadeOutProgress = (scrollY - fadeOutStart) / windowHeight;
                            headerOpacity *= Math.max(1 - fadeOutProgress, 0);
                        }
                    }
                    headerRef.current.style.opacity = headerOpacity;
                    headerRef.current.style.pointerEvents = headerOpacity > 0.5 ? 'auto' : 'none';
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="landing-scroll-container">
            {/* Fixed/Sticky Viewport */}
            <div ref={stickyViewportRef} className="landing-sticky-viewport">

                {/* 1. Intro Text Layer */}
                <div className="intro-text-layer">
                    <h1 ref={text1Ref} className="intro-text" style={{
                        opacity: 0,
                        fontFamily: "Zuume-Semi-Bold-Italic",
                        letterSpacing: "0px",
                    }}>Here ...</h1>
                    <h1 ref={text2Ref} className="intro-text" style={{
                        opacity: 0,
                        fontFamily: "Zuume-Semi-Bold-Italic",
                        letterSpacing: "0px"
                    }}>Is your road</h1>
                    <h1 ref={text3Ref} className="intro-text" style={{
                        opacity: 0,
                        fontFamily: "Zuume-Semi-Bold-Italic",
                        letterSpacing: "0px"
                    }}>Towards Success</h1>
                </div>

                {/* 2. Masked Hero Layer */}
                <div ref={maskContainerRef} className="masked-hero-layer" style={{ opacity: 0 }}>
                    {/* The Hero is rendered here. 
                        Crucially, the 'mask-image' CSS on parent will cut this. 
                    */}
                    <div className="hero-content-wrapper">
                        {/* Pass visibility prop to Hero */}
                        <Hero contentVisible={heroContentVisible} />
                    </div>
                </div>
            </div>

            {/* 3. Header (Fixed Top-Level for Persistence) */}
            <div ref={headerRef} className="header-layer" style={{ opacity: 0, position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
                <Header />
            </div>

            {/* Spacer to create scrollable height */}
            <div style={{ height: '800vh' }}></div>

            {/* Rest of the Page content flows after the spacer */}
            <div className="relative z-10 bg-white">
                <LogoTicker />
                <ProductShowcase />
                <Pricing />
                <Testimonials />
                <MorphingCTA />
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
