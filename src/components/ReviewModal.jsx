import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import testimonialService from '../features/testimonials/testimonialService';

const ReviewModal = ({ isOpen, onClose, user }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setLoading(true);
        try {
            await testimonialService.addTestimonial({ rating, comment }, user.token);
            toast.success('Thank you for your review!');
            setRating(0);
            setComment('');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-8 md:p-12"
                >
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#001E80]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#001E80]/3 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes size={18} />
                    </button>

                    <div className="relative z-10 text-center space-y-6">
                        <div className="space-y-2">
                            <h2
                                className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent"
                                style={{ fontFamily: 'Zuume-Bold' }}
                            >
                                Share Your Experience
                            </h2>
                            <p className="text-sm text-[#010D3E]/50 font-medium">
                                Your feedback helps us build a better Hub for everyone.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div className="flex flex-col items-center gap-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80]">Your Rating</label>
                                <div className="flex gap-2">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                className={`text-2xl transition-all hover:scale-110 ${ratingValue <= (hover || rating) ? 'text-[#001E80]' : 'text-gray-200'
                                                    }`}
                                                onClick={() => setRating(ratingValue)}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <FaStar />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] ml-2">What do you think?</label>
                                <textarea
                                    className="w-full h-32 p-5 bg-gray-50/50 border-2 border-transparent focus:border-[#001E80]/20 focus:bg-white rounded-3xl outline-none transition-all text-sm resize-none"
                                    placeholder="Write your review here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#001E80] hover:bg-blue-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        Broadcast Review <FaPaperPlane size={12} />
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

export default ReviewModal;
