import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import resourceService from '../features/resources/resourceService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaSearch, FaChevronLeft, FaFilter, FaArrowUp, FaArrowDown,
    FaRegComment, FaRegEye, FaPlus, FaBell, FaChevronRight, FaCheckCircle, FaBookmark
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SearchableDropdown from '../components/SearchableDropdown';
import { LiquidButton } from '../components/LiquidButton';
import { API_BASE_URL } from '../config';
import AIChatBot from '../components/AIChatBot';

const SUGGESTION_LISTS = {
    University: [
        'Cairo University', 'Alexandria University', 'Ain Shams University', 'Assiut University', 'Mansoura University',
        'Zagazig University', 'German University in Cairo (GUC)', 'American University in Cairo (AUC)', 'BUE'
    ],
    Subject: ['DSA', 'Algorithms', 'OS', 'Networking', 'Databases', 'AI', 'Web Dev'],
    Company: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Valeo', 'Vodafone'],
    Position: ['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Data Scientist']
};

const FILTER_TYPES = [
    { id: 'University', placeholder: 'Select University...' },
    { id: 'Subject', placeholder: 'Select Subject...' },
    { id: 'Company', placeholder: 'Select Company...' },
    { id: 'Position', placeholder: 'Select Role...' }
];

const ResourceHub = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();

    // Core State
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [activeThread, setActiveThread] = useState(null);
    const [threadPosts, setThreadPosts] = useState([]);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    // Filtering Logic
    const activeMetric = searchParams.get('metric') || 'Community'; // 'Community' | 'Guide'
    const [activeFilters, setActiveFilters] = useState({});

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createData, setCreateData] = useState({
        title: '', content: '', category: 'college', tags: '', isPaid: false, price: 0
    });

    const fetchThreads = useCallback(async () => {
        setLoading(true);
        try {
            const data = await resourceService.getThreads({
                curated: activeMetric === 'Guide',
                search: searchTerm,
                // Add tag filtering here if needed
            });
            setThreads(data);
        } catch (error) {
            toast.error('Failed to sync intel');
        } finally {
            setLoading(false);
        }
    }, [activeMetric, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(fetchThreads, 300);
        return () => clearTimeout(timer);
    }, [fetchThreads]);

    const handleThreadClick = async (threadId) => {
        try {
            const data = await resourceService.getThreadDetail(threadId, user?.token);
            setActiveThread(data.thread);
            setThreadPosts(data.posts);
            setActiveThreadId(threadId);
            // Increment views
            resourceService.incrementViews(threadId);
        } catch (error) {
            toast.error('Failed to load thread details');
        }
    };

    const handleVote = async (e, threadId, direction) => {
        e.stopPropagation();
        if (!user) return toast.info('Log in to vote');
        try {
            const res = await resourceService.voteThread(threadId, direction, user.token);
            setThreads(prev => prev.map(t => t._id === threadId ? {
                ...t,
                upvoteCount: res.upvotes,
                downvoteCount: res.downvotes,
                userVote: res.userVote
            } : t));
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const renderCard = (thread) => {
        const score = (thread.upvotes?.length || 0) - (thread.downvotes?.length || 0);
        const hasUpvoted = thread.upvotes?.includes(user?._id);
        const hasDownvoted = thread.downvotes?.includes(user?._id);

        return (
            <motion.div
                layout
                key={thread._id}
                onClick={() => handleThreadClick(thread._id)}
                className="bg-white rounded-3xl p-6 flex gap-6 hover:shadow-[0_20px_50px_rgba(0,30,128,0.08)] border border-gray-50 transition-all cursor-pointer group"
            >
                {/* Voter Panel */}
                <div className="flex flex-col items-center gap-2 bg-gray-50/50 rounded-2xl p-2 h-fit">
                    <button
                        onClick={(e) => handleVote(e, thread._id, 'up')}
                        className={`p-2 rounded-xl transition-all ${hasUpvoted ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-white'}`}
                    >
                        <FaArrowUp size={14} />
                    </button>
                    <span className="text-sm font-black text-gray-900">{score}</span>
                    <button
                        onClick={(e) => handleVote(e, thread._id, 'down')}
                        className={`p-2 rounded-xl transition-all ${hasDownvoted ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-600 hover:bg-white'}`}
                    >
                        <FaArrowDown size={14} />
                    </button>
                </div>

                {/* Content Panel */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        {thread.isPinned && <FaBookmark className="text-[#001E80] rotate-45" size={12} />}
                        <h3 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-[#001E80] transition-colors">
                            {thread.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100">
                                {thread.author?.avatar ? <img src={thread.author.avatar} alt="" /> : <div className="w-full h-full flex items-center justify-center text-[8px] bg-[#001E80] text-white">{thread.author?.name?.charAt(0)}</div>}
                            </div>
                            <span className="text-gray-900">{thread.author?.name}</span>
                        </div>
                        {thread.author?.role === 'mentor' && <FaCheckCircle className="text-blue-500" size={10} />}
                        <span>•</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{thread.type}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <FaRegComment size={14} />
                            <span className="text-xs font-black">{thread.postCount || 0} comments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <FaRegEye size={14} />
                            <span className="text-xs font-black">{thread.views?.toLocaleString() || 0} views</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {thread.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-gray-100/50 text-gray-500 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-gray-100/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFF]">
            {/* Premium Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
                    {/* Search & Brand */}
                    <div className="flex items-center flex-1 gap-12">
                        <div className="relative group flex-1 max-w-2xl">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#001E80] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search intel, guides, or discussions..."
                                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#001E80]/10 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <LiquidButton
                            text="CREATE THREAD"
                            onClick={() => setShowCreateModal(true)}
                            className="scale-90"
                        />
                        <button className="relative p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all">
                            <FaBell />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-gray-100 cursor-pointer">
                            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#001E80] text-white flex items-center justify-center font-black">?</div>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-10">
                <AnimatePresence mode="wait">
                    {!activeThreadId ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Filter Bar Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                                    {['Community', 'Guide'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setSearchParams({ metric: m })}
                                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMetric === m ? 'bg-white text-[#001E80] shadow-xl shadow-[#001E80]/5' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all ${isFilterExpanded ? 'bg-[#001E80] text-white border-[#001E80]' : 'bg-white text-gray-400 border-gray-100 hover:border-[#001E80]'}`}
                                >
                                    <FaFilter size={12} className={isFilterExpanded ? 'scale-110' : ''} />
                                    <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                                    <FaChevronRight size={10} className={`transition-transform duration-300 ${isFilterExpanded ? 'rotate-90' : ''}`} />
                                </button>
                            </div>

                            {/* Dynamic Filters Area */}
                            <AnimatePresence>
                                {isFilterExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-4 gap-4 p-2">
                                            {FILTER_TYPES.map(ft => (
                                                <div key={ft.id} className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{ft.id}</label>
                                                    <SearchableDropdown
                                                        options={SUGGESTION_LISTS[ft.id] || []}
                                                        placeholder={ft.placeholder}
                                                        onChange={(val) => setActiveFilters(prev => ({ ...prev, [ft.id]: val }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Thread Feed */}
                            <div className="grid grid-cols-1 gap-6 pb-20">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)
                                ) : threads.length > 0 ? (
                                    threads.map(renderCard)
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <FaSearch className="mx-auto text-gray-200 mb-4" size={40} />
                                        <h3 className="text-lg font-black text-gray-900">No Intel Found</h3>
                                        <p className="text-sm text-gray-400 font-bold">Try adjusting your logic parameters.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* In-place Header */}
                            <button
                                onClick={() => setActiveThreadId(null)}
                                className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#001E80] hover:gap-5 transition-all group"
                            >
                                <FaChevronLeft /> Back to Feed
                            </button>

                            <div className="bg-white rounded-[3rem] p-12 border border-gray-50 shadow-sm">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {activeThread.isCurated && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Guide</span>}
                                            <span className="text-blue-600 font-bold text-xs">#{activeThread.type}</span>
                                        </div>
                                        <h1 className="text-4xl font-black text-gray-900 leading-tight">
                                            {activeThread.title}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Intel Score</span>
                                        <span className="text-2xl font-black text-gray-900">{(activeThread.upvotes?.length || 0) - (activeThread.downvotes?.length || 0)}</span>
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-700 font-medium">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {activeThread.content}
                                    </ReactMarkdown>
                                </div>

                                <div className="mt-16 pt-10 border-t border-gray-50">
                                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                        <FaRegComment className="text-[#001E80]" /> Intelligence Logs ({threadPosts.length})
                                    </h3>

                                    <div className="space-y-6">
                                        {threadPosts.length > 0 ? (
                                            threadPosts.map(post => (
                                                <div key={post._id} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-[#001E80] text-white flex items-center justify-center text-[10px] font-black">
                                                            {post.author?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-gray-900">{post.author?.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(post.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="prose prose-sm font-medium text-gray-600">
                                                        <ReactMarkdown>{post.content}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center py-10 text-gray-400 font-bold italic">No log entries synchronized yet...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* AI Chatbot - Always handy */}
            <AIChatBot applyFilters={(f) => setActiveFilters(prev => ({ ...prev, ...f }))} />

            {/* Create Thread Modal Overlay */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-[#001E80] to-[#010D3E] px-10 py-8 flex items-center justify-between">
                            <h2 className="text-white text-xl font-black uppercase tracking-widest">Initialize Briefing</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest ml-2">Title</label>
                                <input
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="Briefing Title..."
                                    value={createData.title}
                                    onChange={e => setCreateData({ ...createData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest ml-2">Intelligence Content</label>
                                <textarea
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 min-h-[150px]"
                                    placeholder="Briefing details (Markdown supported)..."
                                    value={createData.content}
                                    onChange={e => setCreateData({ ...createData, content: e.target.value })}
                                />
                            </div>
                            <div className="pt-6">
                                <LiquidButton
                                    text="SYNC INTELLIGENCE"
                                    className="w-full"
                                    onClick={async () => {
                                        try {
                                            const formData = new FormData();
                                            formData.append('title', createData.title);
                                            formData.append('content', createData.content);
                                            formData.append('type', 'discussion');
                                            await resourceService.createThread(formData, user.token);
                                            toast.success('Briefing Published');
                                            setShowCreateModal(false);
                                            fetchThreads();
                                        } catch (error) {
                                            toast.error('Mission failed');
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResourceHub;
