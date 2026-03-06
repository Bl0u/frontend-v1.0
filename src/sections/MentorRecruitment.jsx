import { motion } from 'framer-motion';
import {
    FaHandHoldingHeart, FaChalkboardTeacher, FaLightbulb, FaRocket,
    FaShieldAlt, FaTrophy, FaGlobeAmericas, FaHandsHelping,
    FaUserTie, FaArrowRight, FaRegCompass
} from 'react-icons/fa';

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const ResponsibilityCard = ({ icon, title, points, idx }) => (
    <motion.div
        variants={fadeInUp}
        custom={idx}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="group relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-[0_4px_30px_-8px_rgba(0,30,128,0.06)] hover:shadow-[0_8px_40px_-8px_rgba(0,30,128,0.12)] transition-all duration-500 hover:-translate-y-1"
    >
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#001E80]/5 text-[#001E80] flex items-center justify-center text-xl mb-5 group-hover:scale-110 group-hover:bg-[#001E80]/10 transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-[#010D3E] mb-4 tracking-tight">{title}</h3>
            <ul className="space-y-3">
                {points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#010D3E]/60 leading-relaxed">
                        <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-[#001E80]/8 flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#001E80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
);

const BenefitItem = ({ icon, title, desc, idx }) => (
    <motion.div
        variants={fadeInUp}
        custom={idx}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex items-start gap-5 group"
    >
        <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#001E80]/10 to-[#001E80]/5 text-[#001E80] flex items-center justify-center text-lg border border-[#001E80]/5 group-hover:scale-110 group-hover:border-[#001E80]/20 transition-all duration-300">
            {icon}
        </div>
        <div>
            <h4 className="text-[15px] font-bold text-[#010D3E] mb-1 tracking-tight">{title}</h4>
            <p className="text-sm text-[#010D3E]/40 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const MentorRecruitment = () => {
    const responsibilities = [
        {
            icon: <FaRegCompass />,
            title: "Project Guidance",
            points: [
                "Claim open missions from learners who need mentorship on specific projects.",
                "Guide teams through technical hurdles — architecture, stack selection, debugging, design patterns.",
                "Provide structured feedback at key milestones (proposal, MVP, mid-review, final).",
            ]
        },
        {
            icon: <FaLightbulb />,
            title: "Industry Knowledge Sharing",
            points: [
                "Teach how professionals actually build, ship, and scale software.",
                "Bridge the gap between textbook theory and real production environments.",
                "Offer career roadmap advice — what skills matter and how to prepare.",
            ]
        },
        {
            icon: <FaRocket />,
            title: "Pitch Hub Participation",
            points: [
                "Help teams refine their project pitch decks and presentation skills.",
                "Judge or advise on Pitch Hub submissions from a professional lens.",
                "Connect exceptional teams with industry contacts when appropriate.",
            ]
        },
        {
            icon: <FaHandsHelping />,
            title: "Flexible Commitment",
            points: [
                "Set your own schedule and pick missions that match your expertise.",
                "Async-first — most communication via Hub chat and threaded discussions.",
                "Short-term or long-term — mentor a single project or stay as a recurring advisor.",
            ]
        },
    ];

    const benefits = [
        { icon: <FaShieldAlt />, title: '"Verified Mentor" Badge', desc: "A distinct profile badge visible across the entire Hub platform." },
        { icon: <FaTrophy />, title: "Mentor Leaderboard", desc: "Your impact is tracked: projects guided, teams helped, ratings received. Top mentors are publicly highlighted." },
        { icon: <FaChalkboardTeacher />, title: "Thought Leader Status", desc: "The more you contribute, the more visible you become in the Hub ecosystem." },
        { icon: <FaGlobeAmericas />, title: "Direct Global Impact", desc: "Your guidance could be the difference between a mediocre project and a career-launching one — for learners worldwide." },
        { icon: <FaHandHoldingHeart />, title: "Give Back", desc: "Be the mentor you wished you had. Remember how hard it was when you were starting out." },
        { icon: <FaUserTie />, title: "Mentor Network", desc: "An exclusive circle of industry professionals who mentor on the Hub. Connect with peers across industries." },
    ];

    return (
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.03, 0.06, 0.03] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(#010D3E 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,white_80%)]" />
                {/* Ambient glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#001E80]/[0.02] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* === HEADER === */}
                <div className="max-w-4xl mx-auto text-center space-y-5 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#001E80]/5 border border-[#001E80]/10 text-[#001E80] text-xs font-black uppercase tracking-widest"
                    >
                        <FaHandHoldingHeart /> Expert Mentors Wanted
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[#010D3E] leading-tight"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        EMPOWER <span className="text-[#001E80]">PRO-BONO</span> <br />
                        LEARNER MISSIONS.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#010D3E]/50 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        Help bridge the gap between academic theory and real-world impact. Join our elite mentor network and guide learners worldwide on high-impact projects.
                    </motion.p>
                </div>

                {/* === WHAT IS A MENTOR === */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center mb-20"
                >
                    <div className="relative p-[1px] rounded-[2rem] overflow-hidden">
                        <motion.div
                            className="absolute inset-[-200%] opacity-20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{ background: 'conic-gradient(from 0deg, transparent 30%, #001E80 50%, transparent 70%)' }}
                        />
                        <div className="relative bg-gradient-to-br from-[#F8FAFF] to-[#EAEEFE] rounded-[2rem] p-10 md:p-14">
                            <h3
                                className="text-2xl md:text-3xl font-black text-[#010D3E] mb-4 uppercase"
                                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                            >
                                What Is a Hub Mentor?
                            </h3>
                            <p className="text-[#010D3E]/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                                A Hub Mentor is an <span className="text-[#001E80] font-semibold">industry professional</span> who volunteers their expertise to guide learners worldwide on high-impact projects — graduation projects, hackathons, capstone work, and real-world applications. This is a <span className="text-[#001E80] font-semibold">pro-bono</span> role. You're here because you believe in giving back and bridging the gap between theory and impact.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#010D3E]/25 uppercase tracking-widest">
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Pro-Bono</span>
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Industry Expert</span>
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Global Impact</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* === RESPONSIBILITIES === */}
                <div className="mb-24">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-[#010D3E] text-center mb-4 uppercase"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Your Role
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[#010D3E]/30 text-center mb-12 max-w-lg mx-auto"
                    >
                        Flexible, async-first, and entirely on your terms.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {responsibilities.map((item, idx) => (
                            <ResponsibilityCard key={idx} idx={idx} {...item} />
                        ))}
                    </div>
                </div>

                {/* === BENEFITS === */}
                <div className="mb-20">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-[#010D3E] text-center mb-4 uppercase"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        What You Get
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[#010D3E]/30 text-center mb-12 max-w-lg mx-auto"
                    >
                        Recognition, impact, and a network worth building for.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 max-w-5xl mx-auto">
                        {benefits.map((item, idx) => (
                            <BenefitItem key={idx} idx={idx} {...item} />
                        ))}
                    </div>
                </div>

                {/* === WHO SHOULD APPLY === */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-[#F8FAFF] to-[#EAEEFE] border border-[#001E80]/5">
                        <h3
                            className="text-2xl md:text-3xl font-black text-[#010D3E] mb-6 uppercase text-center"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            Who Should Apply?
                        </h3>
                        <ul className="space-y-4 max-w-lg mx-auto">
                            {[
                                "You're a working industry professional — any level, from junior engineers to CTOs.",
                                "You have real project experience — you've built, shipped, or contributed to real products.",
                                "You're passionate about teaching and enjoy watching others grow.",
                                "You're committed to at least one project engagement (typically 4–8 weeks).",
                                "You believe in pro-bono impact — you're doing this for purpose, not payment.",
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#010D3E]/50 leading-relaxed">
                                    <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#001E80]/8 flex items-center justify-center text-[#001E80] text-[10px] font-black">{i + 1}</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 text-center">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#001E80]/5 text-[#010D3E]/30 text-xs font-bold uppercase tracking-widest">
                                ⏱ ~2–4 hours per week • Async-first
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* === CTA === */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <button className="group relative px-12 py-5 bg-[#001E80] hover:bg-blue-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#001E80]/20 transition-all active:scale-95 overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative flex items-center gap-3">
                            Become a Mentor <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default MentorRecruitment;
