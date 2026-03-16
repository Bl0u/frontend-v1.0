import { motion } from 'framer-motion';
import {
    FaGraduationCap, FaUsers, FaChartLine,
    FaClipboardList, FaComments, FaHandshake,
    FaBullhorn, FaStar, FaShieldAlt, FaUserFriends,
    FaArrowRight, FaRegHandPaper
} from 'react-icons/fa';
import { LiquidButton } from '../components/LiquidButton';

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
            <h3
                className="text-xl font-bold text-[#010D3E] mb-4 tracking-tight"
                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
            >
                {title}
            </h3>
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
            <h4
                className="text-[15px] font-bold text-[#010D3E] mb-1 tracking-tight"
                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
            >
                {title}
            </h4>
            <p className="text-sm text-[#010D3E]/40 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const StudentLeads = () => {
    const responsibilities = [
        {
            icon: <FaClipboardList />,
            title: "Resource Coordination",
            points: [
                "Help coordinate your level's resource threads — past exams, lecture notes, and study materials stay organized and up-to-date.",
                "Reach out to seniors and high-achieving peers to fill gaps in material (when possible).",
            ]
        },
        {
            icon: <FaComments />,
            title: "Level Group Chat Management",
            points: [
                "Keep your level's group chat organized, on-topic, and a positive space for everyone.",
                "Pin important announcements — exam schedules, resource drops, Hub updates.",
                "Moderate conversations, enforce community guidelines, and ensure every student feels welcome.",
            ]
        },
        {
            icon: <FaHandshake />,
            title: "Community Building",
            points: [
                "Welcome new students into the Hub and guide them through onboarding.",
                "Help students in your level find the right project partners and collaborators.",
            ]
        },
        {
            icon: <FaBullhorn />,
            title: "Hub Representation",
            points: [
                "Relay student feedback to the Hub core team — what's missing, what's needed, what's working.",
                "Champion the Hub in your circles and help grow the platform at your campus.",
                "Submit a brief monthly check-in on resource health and engagement.",
            ]
        },
    ];

    const benefits = [
        { icon: <FaShieldAlt />, title: "Exclusive Position", desc: "Up to 3 Student Leads per level — a selective and prestigious role. You're not one of many." },
        { icon: <FaStar />, title: 'Official "Hub Student Lead" Title', desc: "Displayed on your Hub profile with a verified badge visible to all users." },
        { icon: <FaUserFriends />, title: "Private Lead Network", desc: "A cross-university group of ambitious leaders. Share strategies, get support, build lifelong connections." },
        { icon: <FaArrowRight />, title: "Direct Line to Hub Team", desc: "Your feedback gets priority. You actively shape how the platform evolves." },
        { icon: <FaStar />, title: "Monthly Stars Bonus", desc: "A recurring allocation of Stars to unlock premium resources for free." },
        { icon: <FaGraduationCap />, title: "Free Premium Access", desc: "Full access to all premium resources at your level — verify quality and recommend to peers." },
        { icon: <FaChartLine />, title: "Priority Support", desc: "Your issues and requests are always handled first." },
        { icon: <FaRegHandPaper />, title: "Recommendation Letter", desc: "Top-performing leads can request a formal recommendation from the Hub team." },
        { icon: <FaUsers />, title: "Real Leadership Experience", desc: "Manage a real community, coordinate resources, and build skills that matter in any career." },
    ];

    return (
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
            {/* Background effects — matching Mentor theme */}
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
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#001E80]/[0.02] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* === HEADER === */}
                <div className="max-w-4xl mx-auto text-center space-y-5 mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group p-[1.5px] rounded-xl overflow-hidden inline-flex"
                    >
                        <motion.div
                            className="absolute inset-[-150%] opacity-60"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            style={{ background: 'conic-gradient(from 0deg, transparent 20%, #001E80 50%, transparent 80%)' }}
                        />
                        <div className="relative inline-flex items-center gap-2 border border-[#222]/10 px-4 py-1.5 rounded-[11px] tracking-tight shadow-sm bg-white/80 backdrop-blur-xl group-hover:bg-white transition-colors duration-300">
                            <span className="text-[#001E80]"><FaGraduationCap size={14} /></span>
                            <span className="font-bold text-sm text-[#010D3E]">Hub Ambassador Network</span>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[#010D3E] leading-tight"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '1px' }}
                    >
                        UP TO 3 LEADS <br />PER <span className="text-[#001E80]">LEVEL.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#010D3E]/50 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        We're building an elite network of student leaders to represent the Hub at every academic level across Egypt.
                    </motion.p>
                </div>

                {/* === WHAT IS A STUDENT LEAD === */}
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
                                What Is a Student Lead?
                            </h3>
                            <p className="text-[#010D3E]/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                                A Student Lead is the official <span className="text-[#001E80] font-semibold">Hub Ambassador</span> for their specific academic level. You are the bridge between The Hub and your peers — you help coordinate resources alongside other contributors, manage your level's group chat, and keep the community alive at the ground level.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#010D3E]/25 uppercase tracking-widest">
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Selective</span>
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Prestigious</span>
                                <span className="px-3 py-1.5 rounded-full border border-[#001E80]/8 bg-white/60">Impactful</span>
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
                        Your Responsibilities
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[#010D3E]/30 text-center mb-12 max-w-lg mx-auto"
                    >
                        What you'll own as a Student Lead — manageable alongside your coursework.
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
                        Leading your level comes with real, tangible perks.
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
                                "You're a current student in a recognized university, or any other institution.",
                                "You're active on The Hub (or ready to become one of its most committed users).",
                                "People come to you for advice, study notes, or group coordination.",
                                "You're reliable and consistent — this is an ongoing commitment.",
                                "You genuinely want to help your peers succeed academically.",
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#010D3E]/50 leading-relaxed">
                                    <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#001E80]/8 flex items-center justify-center text-[#001E80] text-[10px] font-black">{i + 1}</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 text-center">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#001E80]/5 text-[#010D3E]/30 text-xs font-bold uppercase tracking-widest">
                                ⏱ ~3–5 hours per week • Mostly async
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* === CTA === */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <LiquidButton to="/work-with-us" text="Join the Elite Network" />
                    <p className="mt-6 text-[#010D3E]/20 text-[10px] font-black uppercase tracking-[0.3em]">Applications Open for 2026</p>
                </motion.div>
            </div>
        </section>
    );
};

export default StudentLeads;
