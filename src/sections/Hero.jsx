import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Hero = () => {
    const heroRef = useRef(null);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
        >
            {/* Dynamic Organic Animated Gradient Background */}
            <div className="absolute inset-0 -z-10" style={{
                background: 'linear-gradient(-45deg, #dbeafe 0%, #f3e8ff 25%, #fce7f3 50%, #dbeafe 75%, #f3e8ff 100%)',
            }}>
                {/* Large flowing gradient blob - Purple/Blue */}
                <motion.div
                    className="absolute -top-20 -left-20 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-60"
                    style={{
                        background: 'linear-gradient(135deg, rgba(148, 3, 253, 0.4) 0%, rgba(0, 173, 254, 0.3) 100%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [0, 150, -100, 0],
                        y: [0, -120, 80, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Medium organic blob - Pink/Purple */}
                <motion.div
                    className="absolute top-0 right-0 w-[400px] h-[600px] md:w-[600px] md:h-[800px] opacity-50"
                    style={{
                        background: 'linear-gradient(225deg, rgba(255, 18, 220, 0.35) 0%, rgba(148, 3, 253, 0.25) 100%)',
                        filter: 'blur(70px)',
                        borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%',
                    }}
                    animate={{
                        x: [0, -150, 100, 0],
                        y: [0, 120, -80, 0],
                        rotate: [0, 25, -25, 0],
                        borderRadius: [
                            '40% 60% 70% 30% / 60% 30% 70% 40%',
                            '60% 40% 30% 70% / 40% 70% 30% 60%',
                            '50% 50% 50% 50% / 50% 50% 50% 50%',
                            '40% 60% 70% 30% / 60% 30% 70% 40%',
                        ],
                    }}
                    transition={{
                        duration: 25,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Bottom flowing blob - Blue/Cyan */}
                <motion.div
                    className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] md:w-[650px] md:h-[650px] opacity-40"
                    style={{
                        background: 'linear-gradient(45deg, rgba(0, 173, 254, 0.4) 0%, rgba(59, 255, 255, 0.25) 100%)',
                        filter: 'blur(65px)',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    }}
                    animate={{
                        x: [0, 180, -120, 0],
                        y: [0, -100, 80, 0],
                        scale: [1, 1.25, 0.85, 1],
                        borderRadius: [
                            '30% 70% 70% 30% / 30% 30% 70% 70%',
                            '70% 30% 30% 70% / 70% 70% 30% 30%',
                            '50% 50% 50% 50% / 50% 50% 50% 50%',
                            '30% 70% 70% 30% / 30% 30% 70% 70%',
                        ],
                    }}
                    transition={{
                        duration: 22,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Accent blob - Orange/Yellow */}
                <motion.div
                    className="absolute bottom-20 right-1/4 w-[300px] h-[400px] md:w-[500px] md:h-[600px] opacity-35"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255, 185, 18, 0.35) 0%, rgba(255, 140, 0, 0.2) 100%)',
                        filter: 'blur(75px)',
                        borderRadius: '60% 40% 30% 70% / 40% 50% 60% 50%',
                    }}
                    animate={{
                        x: [0, -120, 140, 0],
                        y: [0, 140, -100, 0],
                        rotate: [0, -30, 30, 0],
                        borderRadius: [
                            '60% 40% 30% 70% / 40% 50% 60% 50%',
                            '30% 60% 70% 40% / 50% 40% 50% 60%',
                            '70% 30% 40% 60% / 60% 50% 40% 50%',
                            '60% 40% 30% 70% / 40% 50% 60% 50%',
                        ],
                    }}
                    transition={{
                        duration: 18,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Small floating accent - Purple */}
                <motion.div
                    className="absolute top-1/3 left-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(148, 3, 253, 0.4) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                    }}
                    animate={{
                        x: [0, -160, 160, 0],
                        y: [0, 160, -160, 0],
                        scale: [1, 1.3, 0.7, 1],
                    }}
                    transition={{
                        duration: 15,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Extra flowing blob - Right side */}
                <motion.div
                    className="absolute top-1/4 -right-32 w-[450px] h-[450px] opacity-25 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 255, 255, 0.3) 0%, rgba(0, 173, 254, 0.2) 100%)',
                        filter: 'blur(60px)',
                        borderRadius: '70% 30% 50% 50% / 30% 30% 70% 70%',
                    }}
                    animate={{
                        x: [0, -200, 120, 0],
                        y: [0, 160, -120, 0],
                        rotate: [0, 60, -40, 0],
                        scale: [1, 1.3, 0.8, 1],
                    }}
                    transition={{
                        duration: 20,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />

                {/* Extra flowing blob - Center bottom */}
                <motion.div
                    className="absolute -bottom-40 left-1/3 w-[500px] h-[400px] opacity-20 pointer-events-none"
                    style={{
                        background: 'linear-gradient(45deg, rgba(255, 18, 220, 0.3) 0%, rgba(255, 185, 18, 0.2) 100%)',
                        filter: 'blur(70px)',
                        borderRadius: '50% 50% 30% 70% / 30% 70% 70% 30%',
                    }}
                    animate={{
                        x: [0, 200, -160, 0],
                        y: [0, -140, 120, 0],
                        rotate: [0, -50, 40, 0],
                        scale: [1, 1.25, 0.75, 1],
                    }}
                    transition={{
                        duration: 23,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />
            </div>

            {/* Floating decorative elements like in Home */}
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 opacity-15 rounded-full blur-3xl"
                style={{ background: 'linear-gradient(135deg, #9403FD 0%, #00ADFE 100%)' }}
                animate={{
                    y: [0, -30, 0],
                    x: [0, -50, 0],
                }}
                transition={{
                    duration: 8,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-72 h-72 opacity-20 rounded-full blur-3xl"
                style={{ background: 'linear-gradient(135deg, #FF12DC 0%, #FFB912 100%)' }}
                animate={{
                    y: [0, 40, 0],
                    x: [0, 40, 0],
                }}
                transition={{
                    duration: 10,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 1,
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
                    Find your perfect project partner
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
                    <Link to="/register" className="bg-black text-white px-8 py-3 rounded-full font-bold tracking-tight hover:bg-black/80 transition-colors shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2">
                        Join for free
                        <FaArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/partners" className="text-black font-bold tracking-tight flex items-center gap-2 hover:gap-3 transition-all hover:translate-x-1 border-2 border-black px-8 py-3 rounded-full hover:bg-black/5">
                        Find Partners <FaArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
