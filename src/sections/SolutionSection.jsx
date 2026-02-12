import React, { useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const features = [
    {
        title: "Centralized Resources",
        description: "Effortlessly search for threads and resources posted by peers from your specific college and university. Access critical information about your current lectures and subjects, including past exams from your professors and weekly lecture notes. Whether it's specialized material for well-known exams like IELTS and TOEFL, or sharing internship and interview experiences to guide one another, our hub provides the complete educational context you need to succeed.",
        lottieSrc: "https://lottie.host/37a092d5-4119-417c-93cc-9b90aa613d03/5ruDWwNrNb.lottie",
        color: "#ffffff",
        textColor: "#010D3E",
        isReversed: false
    },
    {
        title: "Partnership",
        description: "Finding the perfect partner is easier than ever through our dedicated Partnership Pool. Post your profile to share your goals and specify exactly what you need—whether it's finding a collaborator for a graduation project MVP in 5 weeks or a study buddy for a challenging programming language or subject. Connect with individuals who share your specific interests and turn collaborative learning into real-world results.",
        lottieSrc: "https://lottie.host/e0164715-5f37-4b7d-afbb-724b5b60addc/5p9vgoA7NI.lottie",
        color: "#F8F9FF",
        textColor: "#010D3E",
        isReversed: true
    },
    {
        title: "Mentorship",
        description: "Gain a decisive advantage by searching for mentors who can provide raw, honest advice and strategic guidance. Our mentors are individuals who have already reached the goals you're striving for, offering insights into career roadmaps, technical expertise, and personal growth. Get ahead with mock interviews, portfolio reviews, and seasoned perspectives that transform your potential into professional success.",
        lottieSrc: "https://lottie.host/0de53125-14f7-431e-b1f8-2334708b6e49/cIYILQexyA.lottie",
        color: "#f0f2ff",
        textColor: "#010D3E",
        isReversed: false
    },
    {
        title: "Chatting",
        description: "Stay connected and organized with our integrated real-time communication suite. Chat directly with your project partners to coordinate tasks, or message your mentors to receive instant guidance and feedback. With features designed for seamless collaboration—including file sharing and group discussions—you can ensure your project moves from concept to completion without missing a beat.",
        lottieSrc: "https://lottie.host/ad64e9fd-131f-4a0c-90d4-fd09a0b7689f/KGtz7770Y4.lottie",
        color: "#010D3E",
        textColor: "#ffffff",
        isReversed: true
    }
];

const Card = ({ i, title, description, lottieSrc, color, textColor, progress, range, targetScale, isReversed }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start'],
    });

    const scale = useTransform(progress, range, [1, targetScale]);
    const opacity = useTransform(progress, range, [1, 1]); // Keep opacity full or fade if desired

    return (
        <div
            ref={container}
            className="h-screen flex items-center justify-center sticky top-0"
        >
            <motion.div
                style={{
                    backgroundColor: color,
                    scale,
                    top: `calc(15vh + ${i * 25}px)`, // Offset from the sticky header
                }}
                className="relative h-[550px] w-[90%] md:w-[85%] lg:w-[75%] rounded-[40px] p-8 md:p-12 lg:p-16 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/20"
            >
                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center h-full gap-8 md:gap-12`}>
                    {/* Text Column */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                        <h3
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                            style={{ fontFamily: 'Zuume-Bold', color: textColor }}
                        >
                            {title}
                        </h3>
                        <p
                            className="text-lg md:text-xl leading-relaxed opacity-80"
                            style={{ color: textColor }}
                        >
                            {description}
                        </p>
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

    return (
        <section ref={container} className="relative bg-[#EAEEFE]">
            {/* Sticky Header Container */}
            <div className="sticky top-0 h-[25vh] flex flex-col items-center justify-center text-center z-20 pointer-events-none">
                <div className="px-6 pointer-events-auto">
                    <motion.h2
                        className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight"
                        style={{ fontFamily: 'Zuume-Bold' }}
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        What we offer
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-[#010D3E]/80 max-w-2xl mx-auto mt-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        A complete ecosystem designed to empower your academic journey and professional growth.
                    </motion.p>
                </div>
            </div>

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
