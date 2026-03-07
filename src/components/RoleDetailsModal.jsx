import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { FaTimes, FaCheck, FaInfoCircle, FaStar, FaUserShield } from 'react-icons/fa';

const RoleDetailsModal = ({ isOpen, onClose, roleData }) => {
    if (!roleData) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden my-auto"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#001E80]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>

                        <div className="relative p-8 md:p-10 max-h-[85vh] overflow-y-auto">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#001E80] z-20"
                            >
                                <FaTimes size={20} />
                            </button>

                            {/* Title Section */}
                            <div className="mb-10">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#001E80]/5 text-[#001E80] text-[10px] font-black uppercase tracking-widest mb-4">
                                    <FaInfoCircle size={10} /> Hub Network Roles
                                </span>
                                <h2
                                    className="text-4xl md:text-5xl font-black text-[#010D3E] uppercase Zuume-Bold leading-none"
                                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '1px' }}
                                >
                                    {roleData.title}
                                </h2>
                                <p className="text-[#010D3E]/50 text-base mt-4 font-medium leading-relaxed">
                                    {roleData.description}
                                </p>
                            </div>

                            <div className="space-y-12">
                                {/* Responsibilities */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#001E80]"></div>
                                        Core Responsibilities
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {roleData.responsibilities.map((item, idx) => (
                                            <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:bg-gray-100/50 transition-colors">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#001E80]/10 flex items-center justify-center">
                                                    <FaCheck size={10} className="text-[#001E80]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[15px] font-bold text-[#010D3E]">{item.title}</p>
                                                    <p className="text-sm text-[#010D3E]/60 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#001E80]"></div>
                                        Benefits & Perks
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {roleData.benefits.map((item, idx) => (
                                            <div key={idx} className="p-5 rounded-[2rem] bg-[#001E80]/[0.02] border border-[#001E80]/5 flex items-start gap-4 hover:border-[#001E80]/10 hover:bg-[#001E80]/[0.04] transition-all">
                                                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#001E80]/10 to-[#010D3E]/5 flex items-center justify-center text-[#001E80]">
                                                    <FaStar size={14} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-black text-[#010D3E] Zuume-Bold uppercase tracking-wide">{item.title}</p>
                                                    <p className="text-sm text-[#010D3E]/50 leading-relaxed font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Who Should Apply */}
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#001E80] to-[#010D3E] text-white shadow-xl shadow-[#001E80]/20">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-6 flex items-center gap-2">
                                        <FaUserShield size={14} /> Who should apply?
                                    </h3>
                                    <ul className="space-y-4">
                                        {roleData.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-start gap-4 text-[15px] opacity-90 font-medium leading-relaxed">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 opacity-40"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* CTA Link */}
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-10 py-4 rounded-2xl bg-gray-100 text-[#010D3E] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all border border-gray-100"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default RoleDetailsModal;
