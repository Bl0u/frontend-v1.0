import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaLinkedin, FaUniversity, FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import recruitmentService from '../features/recruitment/recruitmentService';

const MentorIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 4L15.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 4L8.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const LeadIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2524 22.1614 16.5523C21.6184 15.8522 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const RecruitmentModal = ({ isOpen, onClose, user, type: initialType }) => {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(initialType || null);
    const [formData, setFormData] = useState({
        expertise: '',
        linkedin: '',
        bio: '',
        university: '',
        faculty: '',
        level: '',
        motivation: ''
    });

    // Sync selectedType if initialType changes (though we aim for null start now)
    useEffect(() => {
        if (isOpen) {
            setSelectedType(initialType || null);
        }
    }, [isOpen, initialType]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isMentor = selectedType === 'mentor';

        // Basic validation
        if (isMentor) {
            if (!formData.expertise || !formData.linkedin || !formData.bio) {
                toast.error('Please fill in all mentor requirements');
                return;
            }
        } else {
            if (!formData.university || !formData.faculty || !formData.level || !formData.motivation) {
                toast.error('Please fill in all lead requirements');
                return;
            }
        }

        setLoading(true);
        try {
            await recruitmentService.submitApplication({
                type: selectedType,
                data: isMentor
                    ? { expertise: formData.expertise, linkedin: formData.linkedin, bio: formData.bio }
                    : { university: formData.university, faculty: formData.faculty, level: formData.level, motivation: formData.motivation }
            }, user.token);

            toast.success('Application submitted successfully! We will review it soon.');
            onClose();
            // Reset form
            setFormData({
                expertise: '',
                linkedin: '',
                bio: '',
                university: '',
                faculty: '',
                level: '',
                motivation: ''
            });
            setSelectedType(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const SelectionCard = ({ type, title, desc, icon: Icon, colorClass }) => (
        <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type)}
            className="flex flex-col items-center text-center p-8 bg-white/50 border border-black/5 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group w-full"
        >
            <div className={`p-5 rounded-2xl mb-4 transition-colors ${colorClass} bg-opacity-10 group-hover:bg-opacity-20`}>
                <Icon className={`w-10 h-10 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-xl font-black text-[#010D3E] uppercase Zuume-Bold mb-2">{title}</h3>
            <p className="text-xs text-[#010D3E]/50 font-medium leading-relaxed">{desc}</p>
            <div className="mt-6 p-2 rounded-full bg-gray-100 group-hover:bg-[#001E80] group-hover:text-white transition-colors">
                <FaChevronRight size={12} />
            </div>
        </motion.button>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-8 md:p-12"
                >
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#001E80]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#001E80]/3 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 z-20"
                    >
                        <FaTimes size={18} />
                    </button>

                    <div className="relative z-10 space-y-8">
                        {!selectedType ? (
                            <div className="space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-4xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent uppercase Zuume-Bold">Join Our Network</h2>
                                    <p className="text-sm text-[#010D3E]/50 font-medium">Select your preferred path to get started</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <SelectionCard
                                        type="mentor"
                                        title="Expert Mentor"
                                        desc="Guide teams with your industry expertise and experience."
                                        icon={MentorIcon}
                                        colorClass="bg-blue-600"
                                    />
                                    <SelectionCard
                                        type="student_lead"
                                        title="Student Lead"
                                        desc="Manage resources and lead your faculty peers."
                                        icon={LeadIcon}
                                        colorClass="bg-indigo-600"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header with Back Button */}
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <button
                                        onClick={() => setSelectedType(null)}
                                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex items-center gap-2 text-xs font-bold"
                                    >
                                        <FaArrowLeft size={14} />
                                    </button>

                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-[#001E80]/10 rounded-2xl text-[#001E80]">
                                            {selectedType === 'mentor' ? <MentorIcon className="w-10 h-10" /> : <LeadIcon className="w-10 h-10" />}
                                        </div>
                                    </div>
                                    <h2
                                        className="text-4xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent uppercase"
                                        style={{ fontFamily: 'Zuume-Bold' }}
                                    >
                                        {selectedType === 'mentor' ? 'Become a Mentor' : 'Join as Student Lead'}
                                    </h2>
                                    <p className="text-sm text-[#010D3E]/50 font-medium">
                                        {selectedType === 'mentor'
                                            ? 'Share your expertise and guide the next generation of creators.'
                                            : 'Represent your level and manage critical academic resources.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {selectedType === 'mentor' ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">Area of Expertise</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="expertise"
                                                        placeholder="e.g. Fullstack Development, UI/UX, AI"
                                                        className="w-full p-4 pl-12 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                                                        value={formData.expertise}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                        <MentorIcon className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">LinkedIn Profile</label>
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        name="linkedin"
                                                        placeholder="https://linkedin.com/in/username"
                                                        className="w-full p-4 pl-12 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                                                        value={formData.linkedin}
                                                        onChange={handleChange}
                                                    />
                                                    <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">Short Bio / Achievements</label>
                                                <div className="relative">
                                                    <textarea
                                                        name="bio"
                                                        placeholder="Tell us about yourself and why you want to mentor..."
                                                        className="w-full h-24 p-5 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm resize-none"
                                                        value={formData.bio}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">University</label>
                                                    <input
                                                        type="text"
                                                        name="university"
                                                        placeholder="University Name"
                                                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                                                        value={formData.university}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">Faculty</label>
                                                    <input
                                                        type="text"
                                                        name="faculty"
                                                        placeholder="Faculty / Major"
                                                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                                                        value={formData.faculty}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">Year / Level</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="level"
                                                        placeholder="e.g. 3rd Year, Level 400"
                                                        className="w-full p-4 pl-12 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                                                        value={formData.level}
                                                        onChange={handleChange}
                                                    />
                                                    <FaUniversity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">Motivation</label>
                                                <div className="relative">
                                                    <textarea
                                                        name="motivation"
                                                        placeholder="Why are you suitable for this role?..."
                                                        className="w-full h-24 p-5 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm resize-none"
                                                        value={formData.motivation}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#001E80] hover:bg-blue-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                Submit Application <FaPaperPlane size={12} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RecruitmentModal;
