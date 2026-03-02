import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaChalkboardTeacher, FaLightbulb, FaRocket } from 'react-icons/fa';

const MentorRecruitment = () => {
    return (
        <section className="relative py-32 bg-white overflow-hidden">
            {/* Network background effect - Synced with NetworkSplit */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Precise Dot Grid Background */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(black 1.5px, transparent 1.5px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Subtle Radial Mask for depth on light background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,white_80%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
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
                            STUDENT MISSIONS.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-[#010D3E]/60 text-lg md:text-xl font-medium max-w-xl"
                        >
                            Help bridge the gap between academic theory and real-world impact. Join our elite mentor network and guide teams on high-impact projects.
                        </motion.p>

                        <div className="space-y-6 pt-4">
                            {[
                                { icon: <FaChalkboardTeacher />, text: "Guide student teams through technical hurdles" },
                                { icon: <FaLightbulb />, text: "Share industry-standard architectural insights" },
                                { icon: <FaRocket />, text: "Scale social impact via the Pitch Hub" }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * idx + 0.3 }}
                                    className="flex items-center gap-4 text-[#010D3E]/80 font-bold"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-[#001E80] border border-gray-100 italic">
                                        {item.icon}
                                    </div>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="pt-8"
                        >
                            <button className="group relative px-10 py-5 bg-[#001E80] hover:bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#001E80]/20 transition-all active:scale-95 flex items-center gap-3">
                                Become a Mentor <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 p-2 rounded-[3rem] bg-gradient-to-br from-white to-[#EAEEFE] border border-white shadow-2xl shadow-[#001E80]/10 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <div className="aspect-square bg-white rounded-[2.5rem] p-6 flex flex-col justify-center items-center text-center space-y-3">
                                    <span className="text-4xl">🌎</span>
                                    <h4 className="font-black text-[#001E80] text-sm uppercase">Impact</h4>
                                    <p className="text-[10px] text-gray-400 font-bold">Community Reach</p>
                                </div>
                                <div className="aspect-square bg-[#001E80] rounded-[2.5rem] p-6 flex flex-col justify-center items-center text-center space-y-3 text-white">
                                    <span className="text-4xl italic">🎓</span>
                                    <h4 className="font-black text-xs uppercase">Elite Status</h4>
                                    <p className="text-[10px] text-white/40 font-bold">Verified Mentor</p>
                                </div>
                                <div className="aspect-square bg-blue-500 rounded-[2.5rem] p-6 flex flex-col justify-center items-center text-center space-y-3 text-white">
                                    <span className="text-4xl">⚡</span>
                                    <h4 className="font-black text-xs uppercase">Scale</h4>
                                    <p className="text-[10px] text-white/40 font-bold">Rapid Growth</p>
                                </div>
                                <div className="aspect-square bg-white rounded-[2.5rem] p-6 flex flex-col justify-center items-center text-center space-y-3">
                                    <span className="text-4xl">🤝</span>
                                    <h4 className="font-black text-[#001E80] text-sm uppercase">Network</h4>
                                    <p className="text-[10px] text-gray-400 font-bold">Industry Leads</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-4 flex flex-col justify-center items-center gap-2"
                        >
                            <div className="w-10 h-1 rounded-full bg-green-400"></div>
                            <span className="text-[8px] font-black uppercase text-gray-400">Status: Active</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorRecruitment;
