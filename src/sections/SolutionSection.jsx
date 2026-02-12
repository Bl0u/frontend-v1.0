import React, { useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
    {
        title: "Centralized Resources",
        points: [
            "Access university-specific threads and educational context easily.",
            "Find professor-specific past exams and weekly lecture notes.",
            "Dedicated sections for IELTS, TOEFL, and internship experiences.",
            "Stay updated with anything related to your college or university."
        ],
        lottieSrc: "https://lottie.host/37a092d5-4119-417c-93cc-9b90aa613d03/5ruDWwNrNb.lottie",
        color: "#ffffff",
        textColor: "#010D3E",
        isReversed: false
    },
    {
        title: "Partnership",
        points: [
            "Join the Partnership Pool to find collaborators with matching skills.",
            "Post specific project needs, like a graduation project MVP in 5 weeks.",
            "Find study buddies for specific programming languages or subjects.",
            "Browse profiles to find partners who share your exact interests."
        ],
        lottieSrc: "https://lottie.host/e0164715-5f37-4b7d-afbb-724b5b60addc/5p9vgoA7NI.lottie",
        color: "#F8F9FF",
        textColor: "#010D3E",
        isReversed: true
    },
    {
        title: "Mentorship",
        points: [
            "Access raw, experience-based advice from those who've reached your goals.",
            "Structured guidance for career roadmaps and technical excellence.",
            "Mock interviews, portfolio reviews, and seasoned perspectives.",
            "Efficiently find mentors who are exactly where you want to be."
        ],
        lottieSrc: "https://lottie.host/0de53125-14f7-431e-b1f8-2334708b6e49/cIYILQexyA.lottie",
        color: "#f0f2ff",
        textColor: "#010D3E",
        isReversed: false
    },
    {
        title: "Chatting",
        points: [
            "Real-time communication directly with your project partners.",
            "Direct messaging with mentors for instant feedback and guidance.",
            "Integrated file sharing and organized project channels.",
            "Stay synchronized with every member of your academic team."
        ],
        lottieSrc: "https://lottie.host/ad64e9fd-131f-4a0c-90d4-fd09a0b7689f/KGtz7770Y4.lottie",
        color: "#ffffff",
        textColor: "#010D3E",
        isReversed: true
    },
    {
        title: "AI Discovery Assistant",
        points: [
            "Smart matching logic to find best mentors, partners, and resources.",
            "Share your specific requirements and get precise recommendations.",
            "Interactive assistant acts as your academic and professional co-pilot.",
            "Bridge the gap between your needs and the platform's vast ecosystem."
        ],
        lottieSrc: "https://lottie.host/7771dde5-66df-4a0f-9e35-21a40e1d198b/LtPEHK4x1o.lottie",
        color: "#ffffff",
        textColor: "#010D3E",
        isReversed: false,
        isAI: true
    }
];

const Card = ({ i, title, points, lottieSrc, color, textColor, progress, range, targetScale, isReversed, isAI }) => {
    const container = useRef(null);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div
            ref={container}
            className="h-screen flex items-center justify-center sticky top-0"
        >
            <motion.div
                style={{
                    backgroundColor: color,
                    scale,
                    top: `calc(15vh + ${i * 25}px)`,
                }}
                className="relative h-[550px] w-[90%] md:w-[85%] lg:w-[75%] rounded-[40px] p-8 md:p-12 lg:p-16 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/20"
            >

                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center h-full gap-8 md:gap-12 relative z-10`}>
                    {/* Text Column */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                        <h3
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 pb-2"
                            style={{ fontFamily: 'Zuume-Bold', color: textColor }}
                        >
                            {title}
                        </h3>
                        <ul className="space-y-4">
                            {points.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 text-lg md:text-xl opacity-90 leading-tight" style={{ color: textColor }}>
                                    <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${textColor === '#ffffff' ? 'bg-white' : 'bg-[#010D3E]'}`} />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Animation Column */}
                    <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
                        <div className="w-full max-w-[450px] aspect-square">
                            <DotLottieReact
                                src={lottieSrc}
                                loop
                                autoplay
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const SolutionSection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    // Control header visibility. Hide when scrolling past the last card progress.
    const headerOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);
    const headerY = useTransform(scrollYProgress, [0.9, 1], [0, -50]);

    return (
        <section ref={container} className="relative bg-[#EAEEFE]">
            {/* Sticky Header Container */}
            <motion.div
                style={{ opacity: headerOpacity, y: headerY }}
                className="sticky top-0 h-[25vh] flex flex-col items-center justify-center text-center z-20 pointer-events-none"
            >
                <div className="px-6 pointer-events-auto">
                    <motion.h2
                        className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight pb-2"
                        style={{ fontFamily: 'Zuume-Bold' }}
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        What we offer
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-[#010D3E]/80 max-w-2xl mx-auto mt-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        A complete ecosystem designed to empower your academic journey and professional growth.
                    </motion.p>
                </div>
            </motion.div>

            {/* Cards Container */}
            <div className="relative pb-[10vh]">
                {features.map((feature, i) => {
                    const targetScale = 1 - (features.length - i) * 0.05;
                    return (
                        <Card
                            key={`f_${i}`}
                            i={i}
                            {...feature}
                            progress={scrollYProgress}
                            range={[i * (1 / features.length), 1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </div>

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-[-10%] w-[800px] h-[800px] bg-purple-100/30 rounded-full blur-[120px]" />
            </div>
        </section>
    );
};
