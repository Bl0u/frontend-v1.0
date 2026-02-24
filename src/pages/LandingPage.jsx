import React, { useEffect, useRef, useState } from 'react';
import { Hero } from '../sections/Hero';
import { LogoTicker } from '../sections/LogoTicker';
import { MasterSVGOverlay } from '../sections/MasterSVGOverlay';
import { SolutionSection } from '../sections/SolutionSection';
import { Pricing } from '../sections/Pricing';
import { Testimonials } from '../sections/Testimonials';
import { Footer } from '../sections/Footer';
import { CallToAction } from '../sections/CallToAction';
import "../fonts/style/fontsStyle.css";
import gsap from 'gsap';

const LandingPage = () => {
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const text3Ref = useRef(null);
    const maskContainerRef = useRef(null);
    const introLayerRef = useRef(null);

    const [heroContentVisible, setHeroContentVisible] = useState(false);

    // 10-minute selective cache for intro animation
    const [skipIntro, setSkipIntro] = useState(() => {
        const lastIntroTime = localStorage.getItem('lastIntroTime_v2');
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        if (lastIntroTime && now - parseInt(lastIntroTime) < tenMinutes) {
            return true;
        }
        return false;
    });

    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        if (skipIntro) {
            setAnimationDone(true);
            setHeroContentVisible(true);
            document.body.style.overflow = 'auto';
            // Explicitly clear mask styles to prevent "stuck" zoom artifacts
            if (maskContainerRef.current) {
                gsap.set(maskContainerRef.current, {
                    webkitMaskImage: 'none',
                    maskImage: 'none',
                    opacity: 1
                });
            }
            window.dispatchEvent(new CustomEvent('navbar-release'));
            return;
        }

        // Lock scroll during animation
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                setAnimationDone(true);
                document.body.style.overflow = 'auto';
                localStorage.setItem('lastIntroTime_v2', Date.now().toString());
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

        // 1. Text Sequence - 30% Faster
        tl.to(text1Ref.current, { opacity: 1, duration: 0.5, ease: "power2.out" })
            .to(text1Ref.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.5")

            .to(text2Ref.current, { opacity: 1, duration: 0.5, ease: "power2.out" })
            .to(text2Ref.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.5")

            .to(text3Ref.current, { opacity: 1, duration: 0.5, ease: "power2.out" })

            // 2. Prepare Hero and transition (Gapless)
            .to(text3Ref.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.5")
            .to(maskContainerRef.current, { opacity: 1, duration: 0.2 }, "-=0.4")

            // 3. Mask Zoom
            .fromTo(maskContainerRef.current,
                { webkitMaskSize: "15%", maskSize: "15%" },
                {
                    webkitMaskSize: "5000%",
                    maskSize: "5000%",
                    duration: 2.0,
                    ease: "power4.inOut"
                },
                "-=0.2"
            )
            // Fade out the black background overlay during the zoom
            .to(introLayerRef.current, { opacity: 0, duration: 0.8, ease: "none" }, "-=2.0")

            // 4. Final Reveal (Trigger Hero content and Navbar)
            .call(() => {
                setHeroContentVisible(true);
                window.dispatchEvent(new CustomEvent('navbar-release'));
            }, null, "-=1.0");

        return () => {
            tl.kill();
            document.body.style.overflow = 'auto';
        };
    }, [skipIntro]);

    return (
        <div className="landing-scroll-container min-h-screen bg-black">
            {/* Skip Animation Button removed as per request */}

            {!skipIntro && !animationDone && (
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
                    <h1 ref={text1Ref} className="intro-text" style={{ opacity: 0, fontFamily: "Zuume-Semi-Bold-Italic" }}>Build.</h1>
                    <h1 ref={text2Ref} className="intro-text" style={{ opacity: 0, fontFamily: "Zuume-Semi-Bold-Italic" }}>Connect.</h1>
                    <h1 ref={text3Ref} className="intro-text" style={{ opacity: 0, fontFamily: "Zuume-Semi-Bold-Italic" }}>Succeed.</h1>
                </div>
            )}

            {/* Masked Hero Layer */}
            <div
                ref={maskContainerRef}
                className="masked-hero-layer"
                style={{
                    opacity: skipIntro ? 1 : 0,
                    position: 'relative',
                    height: 'auto',
                    backgroundColor: 'var(--color-saas-background)',
                    zIndex: 10
                }}
            >
                <div className="hero-content-wrapper">
                    <Hero contentVisible={heroContentVisible} skipAnimation={false} />
                </div>
            </div>

            <div className="relative z-20 bg-white">
                <LogoTicker />
                <div className="relative">
                    <MasterSVGOverlay skipAnimation={false} />
                    <SolutionSection skipAnimation={false} />
                    <Pricing skipAnimation={false} />
                    <Testimonials />
                    <CallToAction />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
