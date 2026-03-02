import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaGraduationCap, FaBook, FaSearch, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AIChatBot = ({ onApplyFilters, userToken }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI Academic Assistant. Ask me to find specific threads, professors, or subjects across any university!', type: 'text' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${userToken}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/ai/recommend`, { prompt: userMsg }, config);

            const botResponse = {
                role: 'bot',
                text: data.explanation,
                type: 'recommendation',
                threads: data.threads,
                filters: data.filters
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I hit a snag while interpreting that. Please try again or use the manual filters.', role: 'bot', type: 'text' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#001E80] to-[#010D3E] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#001E80]/40 z-50 hover:scale-110 active:scale-95 transition-all group"
            >
                <FaRobot size={28} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white">Assistant</span>
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
                        className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,30,128,0.2)] z-50 overflow-hidden flex flex-col border border-[#001E80]/10"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#001E80] to-[#010D3E] p-6 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FaRobot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest">Academic Bot</h3>
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Query Interpret Mode</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#001E80] text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>

                                        {msg.type === 'recommendation' && (
                                            <div className="mt-4 space-y-3">
                                                {/* Filter Feedback */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {msg.filters.university && <span className="bg-[#EAEEFE] text-[#001E80] text-[9px] font-black p-1 rounded uppercase tracking-tighter">📍 {msg.filters.university}</span>}
                                                    {msg.filters.subject && <span className="bg-[#EAEEFE] text-[#001E80] text-[9px] font-black p-1 rounded uppercase tracking-tighter">📚 {msg.filters.subject}</span>}
                                                </div>

                                                {/* Threads */}
                                                <div className="space-y-2">
                                                    {msg.threads.length > 0 ? (
                                                        msg.threads.map(thread => (
                                                            <a
                                                                key={thread._id}
                                                                href={`/resources/thread/${thread._id}`}
                                                                className="block p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#001E80]/30 hover:bg-[#EAEEFE]/30 transition-all group"
                                                            >
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[9px] font-black text-[#001E80]/40 uppercase tracking-widest">{thread.type}</span>
                                                                    {thread.isPaid && <span className="text-[9px] font-black text-amber-500">⭐ {thread.price}</span>}
                                                                </div>
                                                                <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#001E80]">{thread.title}</p>
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic">No specific threads found for these parameters yet.</p>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => {
                                                        onApplyFilters(msg.filters);
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full mt-2 py-2 bg-white border border-[#001E80]/20 text-[#001E80] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#001E80] hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <FaSearch size={10} /> Sync Main Hub to these Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#001E80]/40 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-[#001E80]/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-[#001E80] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                            <input
                                type="text"
                                placeholder="E.g. I need DSA resources from Cairo Uni..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#001E80]/10 focus:border-[#001E80]/20 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-12 h-12 bg-[#001E80] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#001E80]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatBot;
