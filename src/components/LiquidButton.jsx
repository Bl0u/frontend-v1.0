import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const DEFAULT_COLORS = ['#FF12DC', '#00ADFE', '#FFB912', '#9403FD'];

export const LiquidButton = ({
    to = "/register",
    text = "Register for free",
    colors = DEFAULT_COLORS,
    className = ""
}) => {
    const buttonRef = useRef(null);
    const [particles, setParticles] = useState([]);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (Math.random() > 0.3) {
            const newParticle = {
                id: Math.random(),
                x,
                y,
                color: colors[Math.floor(Math.random() * colors.length)],
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
        setParticles([]);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            <Link
                ref={buttonRef}
                to={to}
                className="relative bg-white text-[#1059a2] px-8 py-3 rounded-full font-bold tracking-tight inline-flex items-center gap-3 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <span className="relative z-10">{text}</span>
                <FaArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1059a2]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

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
                                borderRadius: ['50%', '60% 40% 45% 55%', '50%', '45% 55% 50% 50%', '50%', '50%'],
                            }}
                            transition={{
                                duration: 1.5,
                                ease: 'easeOut',
                                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            }}
                        />
                    ))}
                </div>
            </Link>
        </motion.div>
    );
};
