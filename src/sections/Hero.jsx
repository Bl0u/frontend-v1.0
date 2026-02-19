import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../fonts/style/fontsStyle.css";
import React from 'react';

export const Hero = ({ contentVisible = true, skipAnimation = false }) => {
    const heroRef = useRef(null);
    const buttonRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState([]);
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
            className="relative isolate min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
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

            <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 text-center relative z-10">

                <motion.h1
                    style={{
                        fontFamily: "Zuume-Bold",
                        letterSpacing: "0.5px",
                    }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 pb-2 leading-tight"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }
                    }}
                >
                    Here Is the road towards your... {" "}
                    <span style={{
                        fontFamily: "Zuuma-Italic", fontStyle: "italic", fontWeight: 300,
                        letterSpacing: "-3px",
                        paddingRight: "10px",
                    }}>
                        success
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
                        className="text-base md:text-lg text-[#010D3E]/80 tracking-tight mt-6 max-w-3xl mx-auto"
                        variants={fadeInUpVariants}
                    >
                        Access premium resources, find dedicated partners, and learn from industry experts to turn your academic vision into reality.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-[30px]"
                        variants={fadeInUpVariants}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Link
                                ref={buttonRef}
                                to="/register"
                                className="relative bg-[#ffffff] text-[#1059a2] px-10 py-4 rounded-full font-bold tracking-tight inline-flex items-center gap-3 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="relative z-10">Register for free</span>
                                <FaArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1059a2]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

                                {/* Liquid Particle container */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                                    {particles.map((particle) => (
                                        <motion.div
                                            key={particle.id}
                                            className="absolute rounded-full pointer-events-none blur-sm"
                                            style={{
                                                width: particle.size,
                                                height: particle.size,
                                                backgroundColor: particle.color,
                                                left: particle.x,
                                                top: particle.y,
                                                boxShadow: `0 0 12px ${particle.color}, 0 0 24px ${particle.color}80`,
                                                filter: `drop-shadow(0 0 8px ${particle.color})`,
                                            }}
                                            initial={{
                                                scale: 0.5,
                                                opacity: 1,
                                            }}
                                            animate={{
                                                // Liquid wave motion - up and side to side
                                                y: [
                                                    0,
                                                    -20,
                                                    -40,
                                                    -60,
                                                    -80,
                                                    -100
                                                ],
                                                x: [
                                                    0,
                                                    Math.sin(particle.waveOffset) * 30,
                                                    Math.sin(particle.waveOffset + Math.PI / 2) * 20,
                                                    Math.sin(particle.waveOffset + Math.PI) * 35,
                                                    Math.sin(particle.waveOffset + Math.PI * 1.5) * 15,
                                                    Math.sin(particle.waveOffset + Math.PI * 2) * 25,
                                                ],
                                                // Liquid morphing effect
                                                scale: [0.5, 0.8, 1, 0.9, 0.6, 0],
                                                opacity: [0.8, 1, 1, 0.8, 0.4, 0],
                                                borderRadius: ['50%', '60% 40% 45% 55%', '50%', '45% 55% 50% 50%', '50%', '50%'],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                ease: 'easeOut',
                                                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                                            }}
                                        />
                                    ))}
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Fade Gradient for seamless blend */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

        </section>
    );
};
