import { FaCheck, FaStar } from 'react-icons/fa';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const Pricing = () => {
    const pricingTiers = [
        {
            title: 'Star Pack',
            monthlyPrice: '$5',
            buttonText: 'Buy 500 Stars',
            popular: false,
            inverse: false,
            features: [
                '500 Stars Balance',
                'Unlock 5 Premium Resources',
                'Prioritize your Requests',
                'Support Creator Community',
            ],
        },
        {
            title: 'Pro Bundle',
            monthlyPrice: '$10',
            buttonText: 'Buy 1200 Stars',
            popular: true,
            inverse: true,
            features: [
                '1200 Stars Balance (20% Bonus)',
                'Unlock 12 Premium Resources',
                'Book 1 Expert Session',
                'Verified Student Badge',
                'Priority Support',
            ],
        },
        {
            title: 'Mentor Pass',
            monthlyPrice: 'Earn',
            buttonText: 'Apply Now',
            popular: false,
            inverse: false,
            features: [
                'Monetize your expertise',
                'Set your own rates',
                'Cash out earnings',
                'Mentor Dashboard',
                'Top Rated Badge',
            ],
        },
    ];

    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const cards = cardRefs.current;
        const totalScrollHeight = window.innerHeight * 3;

        // Positions and rotations for 3 cards
        // Spreading them across the screen (14%, 50%, 86% roughly)
        const positions = [18, 50, 82];
        const rotations = [-12, 0, 12];

        // 1. Pin the entire pricing section to the viewport
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScrollHeight}`,
            pin: true,
            pinSpacing: true,
        });

        // 2. Spread the cards horizontally and rotate them slightly
        cards.forEach((card, index) => {
            if (!card) return;
            gsap.to(card, {
                left: `${positions[index]}%`,
                rotation: rotations[index],
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${window.innerHeight}`,
                    scrub: 0.5,
                },
            });
        });

        // 3. Sequential 3D Flip after spreading
        cards.forEach((card, index) => {
            if (!card) return;
            const frontEl = card.querySelector(".flip-card-front");
            const backEl = card.querySelector(".flip-card-back");

            // Stagger the flip points
            const staggerOffset = index * 0.1;
            const startOffset = (1 / 3) + staggerOffset;
            const endOffset = (2 / 3) + staggerOffset;

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${totalScrollHeight}`,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progress >= startOffset && progress <= endOffset) {
                        const animationProgress = (progress - startOffset) / (1 / 3);
                        // Convert [0, 1] to [-180, 0] and [0, 180]
                        const frontRotation = -180 * animationProgress;
                        const backRotation = 180 - 180 * animationProgress;

                        if (frontEl) frontEl.style.transform = `rotateY(${frontRotation}deg)`;
                        if (backEl) backEl.style.transform = `rotateY(${backRotation}deg)`;

                        // Slightly straighten the card tilt as it flips for realism
                        const currentRot = rotations[index] * (1 - animationProgress);
                        card.style.transform = `translate(-50%, -50%) rotate(${currentRot}deg)`;
                    } else if (progress < startOffset) {
                        if (frontEl) frontEl.style.transform = `rotateY(0deg)`;
                        if (backEl) backEl.style.transform = `rotateY(180deg)`;
                        card.style.transform = `translate(-50%, -50%) rotate(${rotations[index]}deg)`;
                    } else if (progress > endOffset) {
                        if (frontEl) frontEl.style.transform = `rotateY(-180deg)`;
                        if (backEl) backEl.style.transform = `rotateY(0deg)`;
                        card.style.transform = `translate(-50%, -50%) rotate(0deg)`;
                    }
                },
            });
        });

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-white overflow-hidden p-0" style={{ minHeight: '100vh', margin: '0' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .cards-animation-container {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    z-index: 5;
                }
                .pricing-card-3d {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 320px;
                    height: 520px;
                    perspective: 2000px;
                    transform-style: preserve-3d;
                    will-change: transform, left;
                }
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }
                .flip-card-front, .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 28px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                }
                .flip-card-front {
                    z-index: 2;
                    transform: rotateY(0deg);
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                    background: linear-gradient(145deg, #001E80 0%, #000411 100%);
                    color: white;
                    justify-content: center;
                    align-items: center;
                    padding: 2.5rem;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.4);
                }
                .drop-shadow-glow {
                    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
                }
            `}} />

            <div className="container mx-auto px-4 relative z-20 pt-20">
                <div className="max-w-[700px] mx-auto text-center">
                    <h2 style={{ fontFamily: "Zuume-Bold" }} className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text Zuume-Bold uppercase">
                        Unlock more with Stars
                    </h2>
                    <p className="text-2xl text-[#010D3E] mt-4 opacity-80">
                        Get the resources you need to succeed. Top up instantly.
                    </p>
                </div>
            </div>

            <div ref={containerRef} className="cards-animation-container">
                {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, inverse, features }, index) => (
                    <div
                        key={title}
                        ref={el => cardRefs.current[index] = el}
                        className="pricing-card-3d"
                    >
                        <div className="flip-card-inner">
                            {/* FRONT FACE */}
                            <div className={clsx(
                                'flip-card-front p-10 border flex flex-col',
                                inverse ? 'bg-black text-white border-white/10' : 'bg-white text-black border-gray-100'
                            )}>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className={clsx('text-lg font-bold opacity-60', inverse && 'text-white')}>
                                        {title}
                                    </h3>
                                    {popular && (
                                        <div className="text-xs px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-500 font-semibold tracking-wide">
                                            Most Popular
                                        </div>
                                    )}
                                </div>
                                <div className="text-5xl font-bold mb-10 tracking-tight">{monthlyPrice}</div>
                                <button className={clsx(
                                    'w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-sm mb-10',
                                    inverse ? 'bg-white text-black' : 'bg-black text-white hover:bg-black/90'
                                )}>
                                    {buttonText}
                                </button>
                                <ul className="space-y-5">
                                    {features.map((feature, fIndex) => (
                                        <li key={fIndex} className="text-sm flex items-start gap-4">
                                            <FaStar className={clsx("mt-1 flex-shrink-0", inverse ? "text-yellow-300" : "text-yellow-400")} />
                                            <span className="opacity-80 leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* BACK FACE */}
                            <div className="flip-card-back">
                                <div className="mb-8 p-6 rounded-full bg-white/5 border border-white/10">
                                    <FaStar className="text-7xl text-yellow-400 drop-shadow-glow" />
                                </div>
                                <h3 className="text-4xl font-bold mb-4 tracking-tighter Zuume-Bold uppercase">
                                    {title}
                                </h3>
                                <p className="text-white/50 text-center text-base leading-relaxed max-w-[240px]">
                                    {index === 0 && "Perfect for individuals and hobbyists starting their journey."}
                                    {index === 1 && "Advanced features and priority access for professionals."}
                                    {index === 2 && "Monetize your expertise and lead the community forward."}
                                </p>
                                <div className="mt-12 px-8 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                                    Elite Tier Access
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
