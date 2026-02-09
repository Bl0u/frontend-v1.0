
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Hero = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start end', 'end start'],
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

    return (
        <section
            ref={heroRef}
            className="relative pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip"
        >
            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="md:flex items-center">
                    <div className="md:w-[478px]">
                        <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur gap-1 items-center mb-5 cursor-pointer hover:bg-white/50 transition-colors">
                            <span className="font-bold text-sm">Version 2.0 is here</span>
                            <span className="text-sm">Explore Resources</span>
                            <FaArrowRight className="h-3 w-3" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 pb-2">
                            Find your perfect project partner
                        </h1>
                        <p className="text-xl text-[#010D3E] tracking-tight mt-6">
                            Connect with students, find expert mentors, and access premium resources to ace your university projects.
                        </p>
                        <div className="flex gap-4 items-center mt-[30px]">
                            <Link to="/register" className="bg-black text-white px-4 py-2 rounded-lg font-medium tracking-tight hover:bg-black/80 transition-colors">
                                Join for free
                            </Link>
                            <Link to="/partners" className="text-black font-medium tracking-tight flex items-center gap-1 hover:gap-2 transition-all">
                                Find Partners <FaArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
                        <motion.img
                            src="/assets/cog.png"
                            alt="Cog 3D Image"
                            className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
                            animate={{
                                translateY: [-30, 30],
                            }}
                            transition={{
                                repeat: Infinity,
                                repeatType: 'mirror',
                                duration: 3,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.img
                            src="/assets/cylinder.png"
                            width={220}
                            height={220}
                            alt="Cylinder 3D Image"
                            className="hidden md:block -top-8 -left-32 md:absolute"
                            style={{
                                translateY: translateY,
                            }}
                        />
                        <motion.img
                            src="/assets/noodle.png"
                            width={220}
                            className="hidden lg:block absolute top-[524px] left-[448px] rotate-[30deg]"
                            alt="Noodle 3D Image"
                            style={{
                                translateY: translateY,
                                rotate: 30,
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
