import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const NetworkBadge = ({ icon, text, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="relative group p-[1.5px] rounded-xl overflow-hidden inline-flex"
    >
        {/* Persistent Animated Border Background (Hero Style) */}
        <motion.div
            className="absolute inset-[-150%] opacity-60"
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

const FeaturePoint = ({ text }) => (
    <li className="flex items-start gap-3 text-base opacity-90 leading-tight text-[#010D3E]/80">
        <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#001E80]/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="#001E80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
        <span>{text}</span>
    </li>
);

const NetworkSplit = () => {
    return (
        <section className="relative py-20 bg-[#F3F3F5] overflow-hidden">
            {/* "Fired Up" Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Aura Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.08, 0.05],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#001E80] rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.03, 0.06, 0.03],
                        x: [0, -40, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#001E80] rounded-full blur-[120px]"
                />

                {/* Pulsing Network Nodes (Decorative) */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-[#001E80]/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start relative">

                    {/* Central Vertical Divider */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#001E80]/10 to-transparent -translate-x-1/2"></div>

                    {/* Mentors Column (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <NetworkBadge icon={<FaChalkboardTeacher size={14} />} text="Expert Mentors" delay={0.1} />

                        <div className="space-y-4">
                            <h3
                                className="text-3xl md:text-5xl font-black text-[#010D3E] leading-[1.1] uppercase Zuume-Bold"
                                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                            >
                                Feeling generous and wanna help other students? <br />
                                <span className="text-[#001E80]">Here is the right place.</span>
                            </h3>
                            <p className="text-[16px] text-[#010D3E]/80 tracking-tight font-medium max-w-lg">
                                Here you can claim pro-bonos and help students with their project, and give back to the community.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            <FeaturePoint text="Guide ambitious graduation teams" />
                            <FeaturePoint text="Share industry insights and best practices" />
                            <FeaturePoint text="Build your reputation as a thought leader" />
                        </ul>
                    </motion.div>

                    {/* Students Column (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 flex flex-col items-start"
                    >
                        <NetworkBadge icon={<FaGraduationCap size={14} />} text="Hub Association" delay={0.2} />

                        <div className="space-y-4">
                            <h3
                                className="text-3xl md:text-5xl font-black text-[#010D3E] leading-[1.1] uppercase Zuume-Bold"
                                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                            >
                                Looking to help other students? <br />
                                <span className="text-[#001E80]">You're in the right place.</span>
                            </h3>
                            <p className="text-[16px] text-[#010D3E]/80 tracking-tight font-medium max-w-lg">
                                Be your level's student lead and contact us.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            <FeaturePoint text="Coordinate resources for your faculty level" />
                            <FeaturePoint text="Help maintain your level's resource threads" />
                            <FeaturePoint text="Represent your peers in the Hub network" />
                        </ul>
                    </motion.div>
                </div>

                {/* Unified CTA Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-wrap justify-center gap-6"
                >
                    <Link
                        to="/work-with-us"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#001E80] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#001E80]/20 hover:scale-105 transition-all group"
                    >
                        Become a Mentor <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/work-with-us"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#001E80]/10 text-[#001E80] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/5 hover:scale-105 transition-all group"
                    >
                        <span className="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Fill Information
                        </span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
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
