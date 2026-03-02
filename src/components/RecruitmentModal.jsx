import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaUserGraduate, FaChalkboardTeacher, FaLinkedin, FaUniversity, FaQuoteLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import recruitmentService from '../features/recruitment/recruitmentService';

const RecruitmentModal = ({ isOpen, onClose, user, type }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        expertise: '',
        linkedin: '',
        bio: '',
        university: '',
        faculty: '',
        level: '',
        motivation: ''
    });

    const isMentor = type === 'mentor';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                type,
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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-[#001E80]/10 rounded-2xl text-[#001E80]">
                                    {isMentor ? <FaChalkboardTeacher size={32} /> : <FaUserGraduate size={32} />}
                                </div>
                            </div>
                            <h2
                                className="text-4xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent uppercase"
                                style={{ fontFamily: 'Zuume-Bold' }}
                            >
                                {isMentor ? 'Become a Mentor' : 'Join as Student Lead'}
                            </h2>
                            <p className="text-sm text-[#010D3E]/50 font-medium">
                                {isMentor
                                    ? 'Share your expertise and guide the next generation of creators.'
                                    : 'Represent your level and manage critical academic resources.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isMentor ? (
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
                                            <FaChalkboardTeacher className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RecruitmentModal;
