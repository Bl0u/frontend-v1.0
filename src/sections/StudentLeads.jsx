import { motion } from 'framer-motion';
import { FaGraduationCap, FaGlobeAmericas, FaUsers, FaChartLine } from 'react-icons/fa';

const StudentLeads = () => {
    return (
        <section className="relative py-24 bg-[#010D3E] overflow-hidden">
            {/* Network background effect - Synced with NetworkSplit */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Precise Dot Grid Background */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(black 1.5px, transparent 1.5px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Subtle Radial Mask for depth on dark background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#010D3E_80%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/60 text-xs font-black uppercase tracking-[0.2em]"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Hub Ambassador Network
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white leading-tight"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '1px' }}
                    >
                        ONE LEAD PER <span className="text-blue-500">LEVEL.</span> <br />
                        ONE LEAD PER <span className="text-indigo-400">COLLEGE.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        Inspired by GDSC, we're building an elite network of student leaders to represent the Hub in every university across the globe.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    {[
                        {
                            icon: <FaGraduationCap />,
                            title: "Lead Your Peers",
                            desc: "Represent the Hub at your specific level and university."
                        },
                        {
                            icon: <FaUsers />,
                            title: "Build Community",
                            desc: "Organize local workshops and networking events."
                        },
                        {
                            icon: <FaGlobeAmericas />,
                            title: "Global Network",
                            desc: "Connect with leads from universities worldwide."
                        },
                        {
                            icon: <FaChartLine />,
                            title: "Career Growth",
                            desc: "Gain exclusive leadership experience for your CV."
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx }}
                            className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-2"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <button className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all active:scale-95 overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative">Join the Elite Network</span>
                    </button>
                    <p className="mt-6 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Applications Open for 2026</p>
                </motion.div>
            </div>
        </section>
    );
};

export default StudentLeads;
