import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Hero = ({ contentVisible = true }) => {
    const heroRef = useRef(null);
    const buttonRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState([]);
    const shouldReduceMotion = useReducedMotion();
    const controls = useAnimation();

    useEffect(() => {
        if (contentVisible) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [contentVisible, controls]);

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
            className="relative min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
        >
            {/* Base white background */}
            <div className="absolute inset-0 -z-20 bg-white"></div>

            {/* Layer A: Primary animated blob (deep navy → cyan) drifting left↔right and up↔down */}
            <motion.div
                className="absolute pointer-events-none will-change-transform"
                style={{
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle at 30% 50%, rgba(1, 13, 62, 0.4) 0%, rgba(0, 120, 212, 0.2) 40%, rgba(0, 173, 254, 0.1) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(90px)',
                    zIndex: '-10',
                }}
                animate={
                    shouldReduceMotion
                        ? { x: 0, y: 0 }
                        : {
                            // Drift left ↔ right and up ↔ down
                            x: [-150, 150, -150],
                            y: [-100, 100, -100],
                        }
                }
                transition={{
                    duration: 25,
                    ease: 'easeInOut',
                    repeat: shouldReduceMotion ? 0 : Infinity,
                }}
            />

            {/* Layer B: Secondary animated blob (purple → magenta) moving in opposite direction */}
            <motion.div
                className="absolute pointer-events-none will-change-transform"
                style={{
                    width: '700px',
                    height: '700px',
                    background: 'radial-gradient(circle at 70% 60%, rgba(148, 3, 253, 0.35) 0%, rgba(255, 18, 220, 0.15) 50%, rgba(255, 185, 18, 0.08) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(85px)',
                    zIndex: '-10',
                    top: '10%',
                    right: '-10%',
                }}
                animate={
                    shouldReduceMotion
                        ? { x: 0, y: 0 }
                        : {
                            // Move opposite to Layer A for dynamic effect
                            x: [150, -150, 150],
                            y: [100, -100, 100],
                        }
                }
                transition={{
                    duration: 30,
                    ease: 'easeInOut',
                    repeat: shouldReduceMotion ? 0 : Infinity,
                }}
            />

            {/* Layer C: Subtle noise texture overlay (5-10% opacity, non-animated) */}
            <div
                className="absolute inset-0 pointer-events-none will-change-auto"
                style={{
                    zIndex: '-9',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000000' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '400px 400px',
                    opacity: 0.08,
                }}
            />


            <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 text-center relative z-10">

                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 pb-2 leading-tight fjalla-one-regular"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Here ... Is the road towards your success
                </motion.h1>

                {/* Controlled Reveal Wrapper */}
                <motion.div
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20, pointerEvents: "none" },
                        visible: { opacity: 1, y: 0, pointerEvents: "auto", transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.p
                        className="text-lg md:text-xl text-[#010D3E] tracking-tight mt-6 max-w-3xl mx-auto"
                        variants={fadeInUpVariants}
                    >
                        Connect with students, find expert mentors, and access premium resources to ace your university projects.
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
                                className="relative bg-[#1a1a2e] text-white px-10 py-4 rounded-full font-bold tracking-tight inline-flex items-center gap-3 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="relative z-10">Join for free</span>
                                <FaArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

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
                        <Link to="/partners" className="text-black font-bold tracking-tight flex items-center gap-2 hover:gap-3 transition-all hover:translate-x-1 border-2 border-black px-8 py-3 rounded-full hover:bg-black/5">
                            Find Partners <FaArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
