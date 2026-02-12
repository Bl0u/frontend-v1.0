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
import gsap from 'gsap';

const LandingPage = () => {
    const containerRef = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const maskContainerRef = useRef(null);
    const headerRef = useRef(null);
    const stickyViewportRef = useRef(null);
    const spacerRef = useRef(null);
    const [heroContentVisible, setHeroContentVisible] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        // Lock scroll during animation
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                setAnimationDone(true);
                document.body.style.overflow = 'auto';
                if (stickyViewportRef.current) {
                    stickyViewportRef.current.style.position = 'relative';
                    stickyViewportRef.current.style.height = 'auto'; // Allow content to define height
                }
                if (spacerRef.current) {
                    spacerRef.current.style.display = 'none';
                }
            }
        });

        // 1. Text Sequence
        tl.to(text1Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(text1Ref.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.8")

            .to(text2Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(text2Ref.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.8")

            .to(text3Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })

            // 2. Mask Animation Reveal
            .to(maskContainerRef.current, { opacity: 1, duration: 0.6 }, "+=0.5")
            .to(text3Ref.current, { opacity: 0, duration: 0.4 }, "-=0.3")

            // Mask Zoom (Scale from 15% to 5000%)
            .fromTo(maskContainerRef.current,
                { webkitMaskSize: "15%", maskSize: "15%" },
                {
                    webkitMaskSize: "5000%",
                    maskSize: "5000%",
                    duration: 2.5,
                    ease: "power4.inOut"
                }
            )

            // 3. Final Reveal
            .to(headerRef.current, { opacity: 1, duration: 0.8 }, "-=1.0")
            .call(() => setHeroContentVisible(true), null, "-=1.5");

        return () => {
            tl.kill();
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div ref={containerRef} className="landing-scroll-container">
            {/* Fixed/Sticky Viewport */}
            <div ref={stickyViewportRef} className="landing-sticky-viewport" style={animationDone ? { position: 'relative', height: 'auto' } : {}}>

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
                <div
                    ref={maskContainerRef}
                    className="masked-hero-layer"
                    style={{
                        opacity: 0,
                        ...(animationDone ? {
                            position: 'relative',
                            height: 'auto',
                            zIndex: 1,
                            webkitMaskImage: 'none',
                            maskImage: 'none'
                        } : {})
                    }}
                >
                    {/* The Hero is rendered here. 
                        Crucially, the 'mask-image' CSS on parent will cut this. 
                    */}
                    <div className="hero-content-wrapper" style={animationDone ? { height: 'auto' } : {}}>
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
            <div ref={spacerRef} style={{ height: '800vh' }}></div>

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
