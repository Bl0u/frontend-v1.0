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
    const introLayerRef = useRef(null);
    const [heroContentVisible, setHeroContentVisible] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        // Lock scroll during animation
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                setAnimationDone(true);
                document.body.style.overflow = 'auto';
                if (introLayerRef.current) {
                    introLayerRef.current.style.display = 'none';
                }
                // Clear mask styles to prevent any clipping artifacts
                if (maskContainerRef.current) {
                    gsap.set(maskContainerRef.current, {
                        webkitMaskImage: 'none',
                        maskImage: 'none'
                    });
                }
            }
        });

        // 1. Text Sequence (Starts on black background overlay)
        tl.to(text1Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(text1Ref.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.8")

            .to(text2Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(text2Ref.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.8")

            .to(text3Ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" })

            // 2. Prepare Hero and transition
            .to(maskContainerRef.current, { opacity: 1, duration: 0.4 }, "-=0.2")
            .to(text3Ref.current, { opacity: 0, duration: 0.3 }, "-=0.1")
            // Fade out the black background overlay as the mask begins to reveal the hero
            .to(introLayerRef.current, { opacity: 0, duration: 0.8, ease: "none" }, "-=0.3")

            // 3. Mask Zoom (Faster)
            .fromTo(maskContainerRef.current,
                { webkitMaskSize: "15%", maskSize: "15%" },
                {
                    webkitMaskSize: "5000%",
                    maskSize: "5000%",
                    duration: 1.5,
                    ease: "power4.inOut"
                }
            )

            // 4. Final Reveal (Header)
            .to(headerRef.current, { opacity: 1, duration: 0.8 }, "-=1.0")
            .call(() => setHeroContentVisible(true), null, "-=1.5");

        return () => {
            tl.kill();
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div ref={containerRef} className="landing-scroll-container min-h-screen bg-black">
            {/* 1. Intro Text Layer (Fixed Overlay) */}
            <div ref={introLayerRef} className="intro-text-layer" style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'black',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none'
            }}>
                <h1 ref={text1Ref} className="intro-text" style={{
                    opacity: 0,
                    fontFamily: "Zuume-Semi-Bold-Italic",
                }}>Here ...</h1>
                <h1 ref={text2Ref} className="intro-text" style={{
                    opacity: 0,
                    fontFamily: "Zuume-Semi-Bold-Italic",
                }}>Is your road</h1>
                <h1 ref={text3Ref} className="intro-text" style={{
                    opacity: 0,
                    fontFamily: "Zuume-Semi-Bold-Italic",
                }}>Towards Success</h1>
            </div>

            {/* 2. Masked Hero Layer (Natural Flow) */}
            <div
                ref={maskContainerRef}
                className="masked-hero-layer"
                style={{
                    opacity: 0,
                    position: 'relative',
                    height: 'auto',
                    backgroundColor: 'var(--color-saas-background)',
                    zIndex: 10
                }}
            >
                <div className="hero-content-wrapper">
                    <Hero contentVisible={heroContentVisible} />
                </div>
            </div>

            {/* 3. Header (Fixed and persists) */}
            <div ref={headerRef} className="header-layer" style={{
                opacity: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 110
            }}>
                <Header />
            </div>

            {/* Rest of the Page content flows naturally */}
            <div className="relative z-20 bg-white">
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
