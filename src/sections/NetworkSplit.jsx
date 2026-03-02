import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

const NetworkBadge = ({ icon, text, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="relative group p-[1px] rounded-xl overflow-hidden inline-flex"
    >
        {/* Animated Border Background */}
        <motion.div
            className="absolute inset-[-150%] opacity-0 group-hover:opacity-40 transition-opacity"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
                background: 'conic-gradient(from 0deg, transparent 20%, #001E80 50%, transparent 80%)'
            }}
        />

        <div className="relative inline-flex items-center gap-2 border border-[#222]/10 px-4 py-1.5 rounded-[11px] tracking-tight shadow-sm bg-white/80 backdrop-blur-xl group-hover:bg-white transition-colors duration-300">
            <span className="text-[#001E80]">{icon}</span>
            <span className="font-bold text-sm text-[#010D3E]">{text}</span>
        </div>
    </motion.div>
);

const NetworkSplit = () => {
    return (
        <section className="relative py-24 bg-[#F3F3F5] overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Mentors Column (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <NetworkBadge icon={<FaChalkboardTeacher size={14} />} text="Expert Mentors" delay={0.1} />
                        <h2
                            className="text-4xl md:text-5xl font-black text-[#010D3E] leading-tight"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            GUIDE THE NEXT <br />
                            <span className="text-[#001E80]">GENERATION.</span>
                        </h2>
                        <p className="text-[#010D3E]/60 text-lg font-medium max-w-md">
                            Share your expertise and help students navigate complex graduation missions.
                        </p>
                        <Link
                            to="/work-with-us"
                            className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-[#001E80] group"
                        >
                            Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </motion.div>

                    {/* Students Column (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 md:text-right flex flex-col md:items-end"
                    >
                        <NetworkBadge icon={<FaGraduationCap size={14} />} text="Hub Association" delay={0.2} />
                        <h2
                            className="text-4xl md:text-5xl font-black text-[#010D3E] leading-tight"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            LEAD YOUR <br />
                            <span className="text-[#001E80]">COMMUNITY.</span>
                        </h2>
                        <p className="text-[#010D3E]/60 text-lg font-medium max-w-md">
                            Become a Hub lead in your university and build a thriving ecosystem.
                        </p>
                        <Link
                            to="/work-with-us"
                            className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-[#001E80] group"
                        >
                            Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Subtle SVG Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#001E80" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </section>
    );
};

export default NetworkSplit;
