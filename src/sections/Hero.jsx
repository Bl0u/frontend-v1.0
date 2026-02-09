import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Hero = () => {
    const heroRef = useRef(null);

    return (
        <section
            ref={heroRef}
            className="relative pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 gradient-animated-hero"
                    style={{
                        background: 'linear-gradient(-45deg, #9403FD 0%, #00ADFE 25%, #FF12DC 50%, #FFB912 75%, #9403FD 100%)',
                    }}
                />
                {/* Floating Blob Overlays for depth */}
                <motion.div
                    className="absolute top-0 -left-40 w-80 h-80 blob-float rounded-full mix-blend-screen opacity-30"
                    style={{
                        background: 'radial-gradient(circle, #FF12DC 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-96 h-96 blob-float rounded-full mix-blend-screen opacity-25"
                    style={{
                        background: 'radial-gradient(circle, #00ADFE 0%, transparent 70%)',
                        filter: 'blur(50px)',
                    }}
                    animate={{
                        x: [0, -150, 0],
                        y: [0, 150, 0],
                    }}
                    transition={{
                        duration: 25,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 right-0 w-72 h-72 blob-float rounded-full mix-blend-screen opacity-20"
                    style={{
                        background: 'radial-gradient(circle, #FFB912 0%, transparent 70%)',
                        filter: 'blur(45px)',
                    }}
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 18,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="md:flex items-center justify-center md:justify-between">
                    <div className="md:w-[478px]">
                        <motion.div
                            className="inline-flex border border-white/30 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/20 backdrop-blur gap-1 items-center mb-5 cursor-pointer hover:bg-white/30 transition-colors"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="font-bold text-sm text-white">Version 2.0 is here</span>
                            <span className="text-sm text-white/90">Explore Resources</span>
                            <FaArrowRight className="h-3 w-3 text-white" />
                        </motion.div>
                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mt-6 pb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            Find your perfect project partner
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-white/90 tracking-tight mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            Connect with students, find expert mentors, and access premium resources to ace your university projects.
                        </motion.p>
                        <motion.div
                            className="flex gap-4 items-center mt-[30px]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <Link to="/register" className="bg-white text-[#9403FD] px-6 py-3 rounded-lg font-bold tracking-tight hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl hover:scale-105">
                                Join for free
                            </Link>
                            <Link to="/partners" className="text-white font-medium tracking-tight flex items-center gap-1 hover:gap-2 transition-all hover:translate-x-1">
                                Find Partners <FaArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Decorative Gradient Circle on Right Side */}
                    <motion.div
                        className="hidden md:block absolute -right-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-screen opacity-40"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 185, 18, 0.4) 0%, rgba(148, 3, 253, 0.2) 50%, transparent 100%)',
                            filter: 'blur(60px)',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                    />
                </div>
            </div>
        </section>
    );
};
