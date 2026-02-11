import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaUserFriends, FaChalkboardTeacher, FaLayerGroup } from 'react-icons/fa';

export const ProductShowcase = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

    const features = [
        {
            title: "Partner Matching",
            description: "Find students with complementary skills for your graduation projects. Swipe, connect, and build your dream team.",
            icon: <FaUserFriends className="w-6 h-6 text-white" />,
            color: "bg-[#FF4D6D]"
        },
        {
            title: "Expert Mentorship",
            description: "Get guidance from experienced mentors. Book sessions, get feedback on your pitch, and refine your project.",
            icon: <FaChalkboardTeacher className="w-6 h-6 text-white" />,
            color: "bg-[#590D22]"
        },
        {
            title: "Resource Hub",
            description: "Access a repository of past projects, code snippets, and study materials. Share your own resources and earn Stars.",
            icon: <FaLayerGroup className="w-6 h-6 text-white" />,
            color: "bg-[#010D3E]"
        }
    ];

    return (
        <section ref={sectionRef} className="relative bg-gradient-to-b from-[#FFFFFF] via-[#E8EDFF] to-[#D2DCFF] py-24 overflow-hidden">
            {/* Dynamic Animated Gradient Blobs */}
            <motion.div
                className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-40 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 173, 254, 0.35) 0%, rgba(148, 3, 253, 0.25) 100%)',
                    filter: 'blur(60px)',
                    borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%',
                }}
                animate={{
                    x: [0, 60, -40, 0],
                    y: [0, -50, 40, 0],
                    rotate: [0, 15, -10, 0],
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
                className="absolute bottom-0 right-0 w-[600px] h-[500px] opacity-35 pointer-events-none"
                style={{
                    background: 'linear-gradient(225deg, rgba(255, 185, 18, 0.3) 0%, rgba(255, 18, 220, 0.2) 100%)',
                    filter: 'blur(70px)',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                }}
                animate={{
                    x: [0, -70, 50, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.1, 0.95, 1],
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

                <div className="grid md:grid-cols-2 gap-12 items-start relative">

                    {/* Left Column: What do we offer */}
                    {/* Left Column: What do we offer */}
                    <div className="relative z-10 sticky top-1/2 -translate-y-1/2 self-start">
                        <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur gap-1 mb-5">
                            <span className="font-bold text-sm">Everything you need</span>
                        </div>
                        <h2                     style={{ 
                        fontFamily: "Zuume-Bold", 
                        letterSpacing: "0.5px",
                    }} className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-2 leading-tight fjalla-one-regular">
                            What we offer
                        </h2>
                        <p className="text-xl md:text-2xl text-[#010D3E]/80 tracking-tight mt-6 leading-relaxed">
                            LearnCrew provides a complete ecosystem for your academic success. From forming the perfect team to finalizing your project with expert advice.
                        </p>
                    </div>

                    {/* Right Column: List Features (Scrollable) */}
                    <div className="flex flex-col gap-6 relative h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-2">
                        <motion.img
                            src="/assets/pyramid.png"
                            alt="Pyramid Image"
                            height={262}
                            width={262}
                            className="hidden md:block absolute -top-32 -right-32 z-0 opacity-50"
                            style={{
                                translateY: translateY,
                            }}
                        />

                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_7px_14px_#EAEAEA] border border-white/50 hover:border-black/5 transition-all duration-300 group shrink-0"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                                    <p className="text-[#010D3E]/70 leading-relaxed text-lg">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
};
