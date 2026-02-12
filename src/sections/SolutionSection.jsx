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
            description: "Access a repository of past projects, code snippets, and study materials. Share your own resources and earn Stars to unlock premium content.",
            lottieSrc: "https://lottie.host/37a092d5-4119-417c-93cc-9b90aa613d03/5ruDWwNrNb.lottie",
            isReversed: false
        },
        {
            title: "Partnership",
            description: "Find students with complementary skills for your graduation projects. Connect with like-minded individuals and build your dream team effortlessly.",
            lottieSrc: "https://lottie.host/e0164715-5f37-4b7d-afbb-724b5b60addc/5p9vgoA7NI.lottie",
            isReversed: true
        },
        {
            title: "Mentorship",
            description: "Get guidance from experienced mentors throughout your academic journey. Book sessions, get feedback on your pitch, and refine your project to perfection.",
            lottieSrc: "https://lottie.host/0de53125-14f7-431e-b1f8-2334708b6e49/cIYILQexyA.lottie",
            isReversed: false
        },
        {
            title: "Chatting",
            description: "Communicate seamlessly with your team and mentors. Stay updated, share ideas, and collaborate in real-time to ensure project success.",
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
