import { useState, useEffect } from 'react';
import { FaTimes, FaGlobe, FaArrowRight, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const JoinGroupModal = ({ isOpen, onClose, group, user }) => {
    const [config, setConfig] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingConfig, setFetchingConfig] = useState(false);

    useEffect(() => {
        if (isOpen && group) {
            fetchGroupConfig();
        }
    }, [isOpen, group]);

    const fetchGroupConfig = async () => {
        setFetchingConfig(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/group-configs`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const groupConfig = res.data.find(c => c.groupType === group.groupType);
            setConfig(groupConfig);

            // Initialize answers
            const initialAnswers = {};
            if (groupConfig?.questions) {
                groupConfig.questions.forEach(q => {
                    initialAnswers[q.label] = '';
                });
            }
            setAnswers(initialAnswers);
        } catch (error) {
            console.error('Error fetching group config:', error);
        } finally {
            setFetchingConfig(false);
        }
    };

    const handleJoin = async () => {
        // Simple validation
        const missing = config?.questions?.some(q => q.required && !answers[q.label]);
        if (missing) {
            toast.error('Please answer all required questions.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/chat/groups/${group._id}/join`, { answers }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Join request sent successfully!');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send join request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#EAEEFE]/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                            <img src={group.avatar || 'https://via.placeholder.com/150'} alt={group.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-gray-800">{group.name}</h3>
                            <p className="text-xs text-[#010D3E]/50 font-black uppercase tracking-widest">{group.groupType} Application</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {fetchingConfig ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading questions...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex gap-4">
                                <FaGlobe className="text-indigo-600 mt-1 shrink-0" />
                                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                                    Official community groups require a short application to ensure member quality. Your answers will be reviewed by group moderators.
                                </p>
                            </div>

                            {config?.questions && config.questions.length > 0 ? (
                                <div className="space-y-6">
                                    {config.questions.map((q, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                                    {q.label} {q.required && <span className="text-red-500">*</span>}
                                                </label>
                                            </div>
                                            {q.type === 'text' ? (
                                                <textarea
                                                    rows={3}
                                                    value={answers[q.label] || ''}
                                                    onChange={(e) => setAnswers({ ...answers, [q.label]: e.target.value })}
                                                    placeholder="Type your answer..."
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium resize-none shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {q.options.map((opt, oIdx) => (
                                                        <button
                                                            key={oIdx}
                                                            onClick={() => setAnswers({ ...answers, [q.label]: opt })}
                                                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${answers[q.label] === opt
                                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaLock className="mx-auto text-gray-200 mb-4" size={32} />
                                    <p className="text-gray-400 font-medium leading-relaxed italic">
                                        No specific questions set for this group type. Proceed to request membership directly.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : <>Submit Request <FaArrowRight /></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupModal;
