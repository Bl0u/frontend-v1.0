import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Hero = () => {
    const heroRef = useRef(null);
    const buttonRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState([]);

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

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
        >
            {/* Clear Background with Animated Liquid Shapes */}
            <div className="absolute inset-0 -z-10 bg-white/95"></div>

            {/* Floating Liquid Shapes */}
            {/* Top-left Purple/Blue blob */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '500px',
                    height: '500px',
                    background: 'linear-gradient(135deg, rgba(148, 3, 253, 0.35) 0%, rgba(0, 173, 254, 0.25) 100%)',
                    borderRadius: '45% 55% 60% 40% / 55% 45% 55% 45%',
                    filter: 'blur(60px)',
                }}
                animate={{
                    top: ['5%', '15%', '5%'],
                    left: ['-15%', '-5%', '-15%'],
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                }}
                transition={{
                    duration: 18,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />

            {/* Top-right Pink/Magenta blob */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '550px',
                    height: '450px',
                    background: 'linear-gradient(225deg, rgba(255, 18, 220, 0.3) 0%, rgba(255, 185, 18, 0.2) 100%)',
                    borderRadius: '60% 40% 45% 55% / 40% 60% 50% 50%',
                    filter: 'blur(70px)',
                }}
                animate={{
                    top: ['0%', '20%', '0%'],
                    right: ['-20%', '5%', '-20%'],
                    scale: [1, 1.15, 1],
                    rotate: [0, -60, 0],
                }}
                transition={{
                    duration: 20,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 1,
                }}
            />

            {/* Center-left Cyan/Blue flowing sheet */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '500px',
                    height: '400px',
                    background: 'linear-gradient(45deg, rgba(0, 173, 254, 0.3) 0%, rgba(59, 255, 255, 0.2) 100%)',
                    borderRadius: '70% 30% 55% 45% / 45% 55% 45% 55%',
                    filter: 'blur(65px)',
                }}
                animate={{
                    top: ['20%', '40%', '20%'],
                    left: ['-10%', '10%', '-10%'],
                    scale: [1, 1.25, 1],
                    rotate: [0, 50, 0],
                }}
                transition={{
                    duration: 22,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 0.5,
                }}
            />

            {/* Bottom-right Purple circle blob */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '450px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(148, 3, 253, 0.3) 0%, rgba(255, 18, 220, 0.15) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(75px)',
                }}
                animate={{
                    bottom: ['-10%', '10%', '-10%'],
                    right: ['-15%', '5%', '-15%'],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 19,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 2,
                }}
            />

            {/* Bottom-left Orange/Yellow wavy shape */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '480px',
                    height: '360px',
                    background: 'linear-gradient(180deg, rgba(255, 185, 18, 0.28) 0%, rgba(255, 18, 220, 0.2) 100%)',
                    borderRadius: '50% 50% 40% 60% / 55% 45% 55% 45%',
                    filter: 'blur(68px)',
                }}
                animate={{
                    bottom: ['10%', '30%', '10%'],
                    left: ['15%', '35%', '15%'],
                    scale: [1, 1.2, 1],
                    rotate: [0, -40, 0],
                }}
                transition={{
                    duration: 21,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 1.5,
                }}
            />

            {/* Center subtle flowing connection */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '420px',
                    height: '300px',
                    background: 'linear-gradient(90deg, rgba(0, 173, 254, 0.25) 0%, rgba(148, 3, 253, 0.2) 100%)',
                    borderRadius: '50% 50% 50% 50% / 40% 60% 40% 60%',
                    filter: 'blur(60px)',
                }}
                animate={{
                    top: ['35%', '55%', '35%'],
                    left: ['20%', '40%', '20%'],
                    scale: [1, 1.15, 1],
                    rotate: [0, 35, 0],
                }}
                transition={{
                    duration: 18,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 0.8,
                }}
            />


            <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 text-center relative z-10">
                <motion.div
                    className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/50 backdrop-blur gap-1 items-center mb-5 cursor-pointer hover:bg-white/70 transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="font-bold text-sm text-black">Version 2.0 is here</span>
                    <span className="text-sm text-black/80">Explore Resources</span>
                    <FaArrowRight className="h-3 w-3 text-black" />
                </motion.div>
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 pb-2 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Here is the road towards your success
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl text-[#010D3E] tracking-tight mt-6 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Connect with students, find expert mentors, and access premium resources to ace your university projects.
                </motion.p>
                <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-[30px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
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
            </div>
        </section>
    );
};
