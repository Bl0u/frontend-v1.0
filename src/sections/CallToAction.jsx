import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export const CallToAction = () => {
    const buttonRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState([]);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });

        if (Math.random() > 0.3) {
            const newParticle = {
                id: Math.random(),
                x,
                y,
                color: ["#adb5bd", "#dee2e6", "#f8f9fa", "#6c757d"][
                    Math.floor(Math.random() * 4)
                ],
                size: Math.random() * 3 + 2,
                waveOffset: Math.random() * Math.PI * 2,
            };
            setParticles((prev) => [...prev, newParticle]);
            setTimeout(() => {
                setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
            }, 1500);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setParticles([]);
    };

    return (
        <section className="relative w-full bg-white py-16 px-4">
            {/* Floating Card */}
            <div
                className="relative mx-auto w-[90%] rounded-3xl flex flex-col items-center justify-center gap-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #212529 0%, #495057 40%, #adb5bd 80%, #f8f9fa 100%)",
                    minHeight: "50vh",
                    boxShadow:
                        "0 25px 60px rgba(33,37,41,0.3), 0 10px 20px rgba(33,37,41,0.15)",
                }}
            >
                {/* Subtle noise texture overlay for premium feel */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />

                {/* Subtle inner border glow */}
                <div className="absolute inset-[1px] rounded-3xl border border-white/10 pointer-events-none" />

                {/* Headline */}
                <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-center text-[#f8f9fa] relative z-10 drop-shadow-lg"
                    style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                >
                    Ready to find your success?
                </h2>

                {/* Subtext */}
                <p className="text-[#dee2e6] text-base md:text-lg text-center max-w-md relative z-10 opacity-80">
                    Join thousands of students already growing together.
                </p>

                {/* Register Button — Hero-style with liquid particles */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative z-10"
                >
                    <Link
                        ref={buttonRef}
                        to="/register"
                        className="relative bg-[#f8f9fa] text-[#212529] px-10 py-4 rounded-full font-bold tracking-tight inline-flex items-center gap-3 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className="relative z-10">Register for free</span>
                        <FaArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c757d]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                        {/* Liquid Particle container */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                            {particles.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    className="absolute rounded-full pointer-events-none blur-sm"
                                    style={{
                                        width: particle.size,
                                        height: particle.size,
                                        backgroundColor: particle.color,
                                        left: particle.x,
                                        top: particle.y,
                                        boxShadow: `0 0 12px ${particle.color}, 0 0 24px ${particle.color}80`,
                                        filter: `drop-shadow(0 0 8px ${particle.color})`,
                                    }}
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{
                                        y: [0, -20, -40, -60, -80, -100],
                                        x: [
                                            0,
                                            Math.sin(particle.waveOffset) * 30,
                                            Math.sin(particle.waveOffset + Math.PI / 2) * 20,
                                            Math.sin(particle.waveOffset + Math.PI) * 35,
                                            Math.sin(particle.waveOffset + Math.PI * 1.5) * 15,
                                            Math.sin(particle.waveOffset + Math.PI * 2) * 25,
                                        ],
                                        scale: [0.5, 0.8, 1, 0.9, 0.6, 0],
                                        opacity: [0.8, 1, 1, 0.8, 0.4, 0],
                                        borderRadius: [
                                            "50%",
                                            "60% 40% 45% 55%",
                                            "50%",
                                            "45% 55% 50% 50%",
                                            "50%",
                                            "50%",
                                        ],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "easeOut",
                                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                                    }}
                                />
                            ))}
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
