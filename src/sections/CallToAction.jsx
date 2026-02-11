import { FaArrowRight } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

    return (
        <section ref={sectionRef} className="relative bg-gradient-to-b from-[#FFFFFF] via-[#F0E8FF] to-[#E8D2FF] py-24 overflow-hidden">
            {/* Dynamic animated gradient blobs */}
            <motion.div
                className="absolute -top-40 -left-20 w-[500px] h-[500px] opacity-40 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(148, 3, 253, 0.35) 0%, rgba(255, 18, 220, 0.3) 100%)',
                    filter: 'blur(65px)',
                    borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%',
                }}
                animate={{
                    x: [0, 70, -40, 0],
                    y: [0, -50, 40, 0],
                    scale: [1, 1.1, 0.95, 1],
                    borderRadius: [
                        '40% 60% 70% 30% / 60% 30% 70% 40%',
                        '60% 40% 30% 70% / 40% 70% 30% 60%',
                        '50% 50% 50% 50% / 50% 50% 50% 50%',
                        '40% 60% 70% 30% / 60% 30% 70% 40%',
                    ],
                }}
                transition={{
                    duration: 20,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-35 pointer-events-none"
                style={{
                    background: 'linear-gradient(225deg, rgba(0, 173, 254, 0.35) 0%, rgba(255, 185, 18, 0.25) 100%)',
                    filter: 'blur(70px)',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                }}
                animate={{
                    x: [0, -80, 50, 0],
                    y: [0, 70, -40, 0],
                    rotate: [0, 20, -15, 0],
                    borderRadius: [
                        '30% 70% 70% 30% / 30% 30% 70% 70%',
                        '70% 30% 30% 70% / 70% 70% 30% 30%',
                        '50% 50% 50% 50% / 50% 50% 50% 50%',
                        '30% 70% 70% 30% / 30% 30% 70% 70%',
                    ],
                }}
                transition={{
                    duration: 25,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="max-w-[540px] mx-auto relative">
                    <motion.h2
                        style={{
                            fontFamily: "Zuume-Bold",
                            letterSpacing: "0.5px",
                        }}
                        className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5 fjalla-one-regular"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        Ready to find your crew?
                    </motion.h2>
                    <motion.p
                        className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Join thousands of students and mentors. Build your project, find partners, and succeed together.
                    </motion.p>

                    <motion.img
                        src="/assets/star.png"
                        alt="Star Image"
                        width={360}
                        className="absolute -left-[350px] -top-[137px]"
                        style={{
                            translateY: translateY,
                        }}
                    />
                    <motion.img
                        src="/assets/spring.png"
                        alt="Spring Image"
                        width={360}
                        className="absolute -right-[331px] -top-[19px]"
                        style={{
                            translateY: translateY,
                        }}
                    />
                </div>

                <motion.div
                    className="flex gap-2 mt-10 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <div className="mask-container-urban">
                            <span className="mas">Sign up for free</span>
                            <Link to="/register" className="mask-btn-urban">
                                Sign up for free
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/resources" className="text-black font-bold tracking-tight flex items-center gap-1 hover:gap-2 transition-all px-6 py-3 rounded-lg hover:bg-black/5">
                            Browse Resources <FaArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};
