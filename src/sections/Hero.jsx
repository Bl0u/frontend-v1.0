import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../fonts/style/fontsStyle.css";
import React from 'react';
import { LiquidButton } from '../components/LiquidButton';

export const Hero = ({ contentVisible = true, skipAnimation = false }) => {
    const heroRef = useRef(null);
    const buttonRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const shouldReduceMotion = useReducedMotion() || skipAnimation;
    const controls = useAnimation();

    useEffect(() => {
        if (contentVisible || skipAnimation) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [contentVisible, skipAnimation, controls]);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });

        // Create new particles more frequently for liquid effect
        if (Math.random() > 0.3) {
            const newParticle = {
                id: Math.random(),
                x,
                y,
                color: ['#FF12DC', '#00ADFE', '#FFB912', '#9403FD'][Math.floor(Math.random() * 4)],
                size: Math.random() * 3 + 2, // Variable size for liquid effect
                waveOffset: Math.random() * Math.PI * 2,
            };
            setParticles((prev) => [...prev, newParticle]);

            // Remove particle after animation completes
            setTimeout(() => {
                setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
            }, 1500);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setParticles([]);
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
    };

    return (
        <section
            ref={heroRef}
            className="relative isolate min-h-[90vh] flex flex-col justify-center py-12 md:py-16 overflow-hidden"
        >
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10"
            >
                <source src="/assets/hero-section-background-5.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="max-w-[90rem] mx-auto px-8 lg:px-16 xl:px-24 text-center relative z-10">

                {/* Premium Badge */}
                <motion.div
                    className="flex justify-center mb-2"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0 } }
                    }}
                >
                    <div className="relative group p-[1.5px] rounded-xl overflow-hidden">
                        {/* Animated Border Background */}
                        <motion.div
                            className="absolute inset-[-150%] opacity-60"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            style={{
                                background: 'conic-gradient(from 0deg, transparent 20%, #001E80 50%, transparent 80%)'
                            }}
                        />

                        <div className="relative inline-flex items-center gap-2 border border-[#222]/10 px-4 py-1.5 rounded-[11px] tracking-tight shadow-sm bg-white/80 backdrop-blur-xl group-hover:bg-white transition-colors duration-300">
                            <svg className="w-3.5 h-3.5 text-[#001E80]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L14.4 8.4L21 9.6L16.2 14.4L17.4 21L12 17.4L6.6 21L7.8 14.4L3 9.6L9.6 8.4L12 2Z" fill="currentColor" />
                            </svg>
                            <span className="font-bold text-sm text-[#010D3E]">Trusted by 1000+ students</span>
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    style={{
                        fontFamily: "Zuume-Bold",
                        letterSpacing: "0.5px",
                        // fontSize: "85px"
                    }}
                    className="text-[5.25rem] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-4 pb-1 leading-[1.1]"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }
                    }}
                >
                    Everything you need to study... {" "}
                    <span style={{
                        fontFamily: "Zuuma-Italic", fontStyle: "italic", fontWeight: 300,
                        letterSpacing: "-3px",
                        paddingRight: "10px",
                    }}>
                        in one place
                    </span>
                </motion.h1>

                {/* Controlled Reveal Wrapper */}
                <motion.div
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20, pointerEvents: "none" },
                        visible: { opacity: 1, y: 0, pointerEvents: "auto", transition: { staggerChildren: 0.2, delayChildren: 0.5 } }
                    }}
                >
                    <motion.p
                        className="text-[16px] text-[#010D3E]/80 tracking-tight mt-0 max-w-3xl mx-auto"
                        variants={fadeInUpVariants}
                    >
                        Access high-quality course materials, past exams, and assignments curated by senior students, and connect with committed partners to bring your academic goals to life.
                    </motion.p>
                    <motion.div
                        className="flex flex-col gap-6 justify-center items-center mt-[40px]"
                        variants={fadeInUpVariants}
                    >
                        {/* Mock AI Message Box */}
                        <div className="w-full max-w-2xl bg-gradient-to-b from-black via-black via-[60%] to-[#001E80] rounded-[24px] p-4 flex items-center gap-4 border border-white/10 shadow-2xl relative overflow-hidden group min-h-[80px]">
                            {/* Gemini Aura Effect */}
                            <div className="absolute -left-20 top-0 w-64 h-64 bg-[#00ADFE]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#00ADFE]/20 transition-colors duration-500"></div>

                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/40 ml-1">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>

                            <div className="flex-1 flex flex-col items-start px-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for your university, exams, material, partners..."
                                    className="w-full bg-transparent border-none outline-none text-[17px] text-white/90 font-medium font-sans placeholder:text-white/40 focus:ring-0 p-0"
                                />
                            </div>

                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#6c757d] text-white mr-1 shadow-lg cursor-pointer hover:bg-[#5a6268] hover:scale-105 transition-all active:scale-95">
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Fade Gradient for seamless blend */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

        </section>
    );
};
