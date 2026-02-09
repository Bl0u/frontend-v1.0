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
        <section ref={sectionRef} className="relative bg-gradient-to-b from-[#FFFFFF] via-[#E8EDFF] to-[#D2DCFF] py-24 overflow-x-clip">
            {/* Subtle animated gradient blobs */}
            <motion.div
                className="absolute top-0 -left-40 w-80 h-80 rounded-full mix-blend-screen opacity-15"
                style={{
                    background: 'radial-gradient(circle, #9403FD 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, 80, 0],
                    y: [0, -80, 0],
                }}
                transition={{
                    duration: 20,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-0 -right-40 w-80 h-80 rounded-full mix-blend-screen opacity-15"
                style={{
                    background: 'radial-gradient(circle, #00ADFE 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, -80, 0],
                    y: [0, 80, 0],
                }}
                transition={{
                    duration: 22,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="max-w-[540px] mx-auto relative">
                    <motion.h2
                        className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5"
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
                        <Link to="/register" className="bg-black text-white px-6 py-3 rounded-lg font-bold tracking-tight hover:bg-black/80 transition-colors shadow-lg hover:shadow-xl inline-block">
                            Sign up for free
                        </Link>
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
