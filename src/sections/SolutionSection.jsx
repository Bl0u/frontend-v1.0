import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

const FeatureItem = ({ title, description, lottieSrc, isReversed }) => {
    return (
        <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 py-16 md:py-24`}>
            {/* Animation Column */}
            <motion.div
                className="w-full md:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: isReversed ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="w-full max-w-[500px] aspect-square relative">
                    <DotLottieReact
                        src={lottieSrc}
                        loop
                        autoplay
                    />
                </div>
            </motion.div>

            {/* Text Column */}
            <motion.div
                className="w-full md:w-1/2 text-center md:text-left"
                initial={{ opacity: 0, x: isReversed ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-[#010D3E] mb-6" style={{ fontFamily: 'Zuume-Bold' }}>
                    {title}
                </h3>
                <p className="text-lg md:text-xl text-[#010D3E]/70 leading-relaxed max-w-xl mx-auto md:mx-0">
                    {description}
                </p>
            </motion.div>
        </div>
    );
};

export const SolutionSection = () => {
    const features = [
        {
            title: "Centralized Resources",
            description: "Effortlessly search for threads and resources posted by peers from your specific college and university. Access critical information about your current lectures and subjects, including past exams from your professors and weekly lecture notes. Whether it's specialized material for well-known exams like IELTS and TOEFL, or sharing internship and interview experiences to guide one another, our hub provides the complete educational context you need to succeed.",
            lottieSrc: "https://lottie.host/37a092d5-4119-417c-93cc-9b90aa613d03/5ruDWwNrNb.lottie",
            isReversed: false
        },
        {
            title: "Partnership",
            description: "Finding the perfect partner is easier than ever through our dedicated Partnership Pool. Post your profile to share your goals and specify exactly what you need—whether it's finding a collaborator for a graduation project MVP in 5 weeks or a study buddy for a challenging programming language or subject. Connect with individuals who share your specific interests and turn collaborative learning into real-world results.",
            lottieSrc: "https://lottie.host/e0164715-5f37-4b7d-afbb-724b5b60addc/5p9vgoA7NI.lottie",
            isReversed: true
        },
        {
            title: "Mentorship",
            description: "Gain a decisive advantage by searching for mentors who can provide raw, honest advice and strategic guidance. Our mentors are individuals who have already reached the goals you're striving for, offering insights into career roadmaps, technical expertise, and personal growth. Get ahead with mock interviews, portfolio reviews, and seasoned perspectives that transform your potential into professional success.",
            lottieSrc: "https://lottie.host/0de53125-14f7-431e-b1f8-2334708b6e49/cIYILQexyA.lottie",
            isReversed: false
        },
        {
            title: "Chatting",
            description: "Stay connected and organized with our integrated real-time communication suite. Chat directly with your project partners to coordinate tasks, or message your mentors to receive instant guidance and feedback. With features designed for seamless collaboration—including file sharing and group discussions—you can ensure your project moves from concept to completion without missing a beat.",
            lottieSrc: "https://lottie.host/ad64e9fd-131f-4a0c-90d4-fd09a0b7689f/KGtz7770Y4.lottie",
            isReversed: true
        }
    ];

    return (
        <section id="solution" className="relative py-24 overflow-hidden bg-white">
            <div className="container mx-auto px-6 relative z-10">
                {/* Hook / Headline */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight pb-4"
                        style={{ fontFamily: 'Zuume-Bold' }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        What we offer
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-[#010D3E]/80 max-w-2xl mx-auto mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        A complete ecosystem designed to empower your academic journey and professional growth.
                    </motion.p>
                </div>

                {/* Features List */}
                <div className="flex flex-col">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} {...feature} />
                    ))}
                </div>
            </div>

            {/* Subtle Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px]" />
            </div>
        </section>
    );
};
