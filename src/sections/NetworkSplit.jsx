import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import RecruitmentModal from '../components/RecruitmentModal';
import { toast } from 'react-toastify';

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
        <span className="mt-[2px] shrink-0 w-5 h-5 rounded-full bg-[#001E80]/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="#001E80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
        <span>{text}</span>
    </li>
);

const NetworkSplit = () => {
    const { user } = useContext(AuthContext);
    const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
    const [initialRecruitmentType, setInitialRecruitmentType] = useState(null);

    const handleApply = (type = null) => {
        if (!user) {
            toast.error('Please login to apply');
            return;
        }
        setInitialRecruitmentType(type);
        setIsRecruitmentModalOpen(true);
    };

    return (
        <section className="relative py-20 bg-[#F3F3F5] overflow-hidden">
            {/* Blending "Trick" Gradients */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

            {/* "Fired Up" Background Elements - Synced with Ambassador Network dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Precise Dot Grid Background */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(black 1.5px, transparent 1.5px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Subtle Radial Mask for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#F3F3F5_80%)]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
                {/* Row 1: Unified Hook */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto"
                >
                    <h3
                        className="text-4xl md:text-5xl lg:text-7xl font-black text-[#010D3E] leading-[1.1] uppercase Zuume-Bold"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Looking to help other students? <br />
                        <span className="text-[#001E80]" style={{
                            fontFamily: 'Zuuma-Italic',
                            fontStyle: 'italic',
                            fontWeight: 300,
                            letterSpacing: '-1.5px',
                            textTransform: 'none'
                        }}>You're in the right place.</span>
                    </h3>
                </motion.div>

                {/* Row 2: Recruitment Details */}
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
                        <div className="space-y-6">
                            <NetworkBadge icon={<FaChalkboardTeacher size={14} />} text="Expert Mentors" delay={0.1} />

                            <div className="space-y-4">
                                <h4
                                    className="text-2xl md:text-3xl font-black text-[#010D3E] uppercase Zuume-Bold"
                                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                                >
                                    Claim Pro-Bono
                                </h4>
                                <p className="text-[16px] text-[#010D3E]/80 tracking-tight font-medium max-w-lg leading-relaxed">
                                    Help students with their graduation projects, share your industry expertise, and give back to the community.
                                </p>
                            </div>
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
                        <div className="space-y-6">
                            <NetworkBadge icon={<FaGraduationCap size={14} />} text="Hub Association" delay={0.2} />

                            <div className="space-y-4">
                                <h4
                                    className="text-2xl md:text-3xl font-black text-[#010D3E] uppercase Zuume-Bold"
                                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                                >
                                    Become a Student Lead
                                </h4>
                                <p className="text-[16px] text-[#010D3E]/80 tracking-tight font-medium max-w-lg leading-relaxed">
                                    Represent your level in the Hub network, coordinate resources for your peers, and lead your faculty.
                                </p>
                            </div>
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
                    className="mt-16 flex justify-center"
                >
                    <button
                        onClick={() => handleApply()}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#001E80] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#001E80]/30 hover:scale-105 active:scale-95 transition-all group"
                    >
                        Join our Network <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Unified Recruitment Modal */}
                <RecruitmentModal
                    isOpen={isRecruitmentModalOpen}
                    onClose={() => setIsRecruitmentModalOpen(false)}
                    user={user}
                    type={initialRecruitmentType}
                />
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
