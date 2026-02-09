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
        <section ref={sectionRef} className="relative bg-gradient-to-b from-[#FFFFFF] via-[#E8EDFF] to-[#D2DCFF] py-24 overflow-x-clip">
            <div className="container mx-auto px-4 md:px-6">

                <div className="grid md:grid-cols-2 gap-12 items-start relative">

                    {/* Left Column: What do we offer */}
                    <div className="relative z-10 sticky top-24">
                        <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur gap-1 mb-5">
                            <span className="font-bold text-sm">Everything you need</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-2 leading-tight">
                            What we offer
                        </h2>
                        <p className="text-xl md:text-2xl text-[#010D3E]/80 tracking-tight mt-6 leading-relaxed">
                            LearnCrew provides a complete ecosystem for your academic success. From forming the perfect team to finalizing your project with expert advice.
                        </p>

                        {/* Decorative Elements for Left Column */}
                        <motion.img
                            src="/assets/tube.png"
                            alt="Tube Image"
                            height={248}
                            width={248}
                            className="hidden md:block absolute -bottom-48 -left-32 -z-10 opacity-50"
                            style={{
                                translateY: translateY,
                            }}
                        />
                    </div>

                    {/* Right Column: List Features (No Scroll) */}
                    <div className="flex flex-col gap-6 relative">
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

                        <div className="relative z-10 flex flex-col gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_7px_14px_#EAEAEA] border border-white/50 hover:border-black/5 transition-all duration-300 group hover:-translate-y-1"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <motion.div
                                        className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-[#010D3E]/70 leading-relaxed text-lg">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};
