import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import resourceService from '../features/resources/resourceService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaSearch, FaChevronLeft, FaFilter, FaArrowUp, FaArrowDown,
    FaRegComment, FaRegEye, FaPlus, FaBell, FaChevronRight, FaCheckCircle,
    FaBookmark, FaHome, FaFire, FaChartLine, FaHashtag
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SearchableDropdown from '../components/SearchableDropdown';
import HubHeader from '../components/HubHeader';
import AIChatBot from '../components/AIChatBot';

const CATEGORIES = [
    { name: 'Tutorials', color: '#6366F1' },
    { name: 'Discussion', color: '#10B981' },
    { name: 'Database', color: '#F59E0B' },
    { name: 'Security', color: '#EF4444' },
    { name: 'News', color: '#3B82F6' },
    { name: 'Architecture', color: '#8B5CF6' }
];

const ResourceHub = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Core State
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [activeThread, setActiveThread] = useState(null);
    const [threadPosts, setThreadPosts] = useState([]);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const activeNav = searchParams.get('tab') || 'Home Feed';

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createData, setCreateData] = useState({
        title: '', content: '', category: 'college', tags: ''
    });

    const fetchThreads = useCallback(async () => {
        setLoading(true);
        try {
            const data = await resourceService.getThreads({
                search: searchTerm,
                tab: activeNav
            });
            setThreads(data);
        } catch (error) {
            toast.error('Failed to sync intel');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, activeNav]);

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
            resourceService.incrementViews(threadId);
        } catch (error) {
            toast.error('Failed to load thread details');
        }
    };

    const handleVote = async (e, threadId, direction) => {
        e.stopPropagation();
        if (!user) return toast.info('Log in to vote');
        try {
            await resourceService.voteThread(threadId, direction, user.token);
            fetchThreads(); // Refresh list to get accurate counts
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
                className="bg-white rounded-2xl p-6 flex gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/50 transition-all cursor-pointer group items-start"
            >
                {/* Column 1: Voter Panel */}
                <div className="flex flex-col items-center gap-2 h-fit">
                    <button
                        onClick={(e) => handleVote(e, thread._id, 'up')}
                        className={`p-1.5 rounded-lg transition-all ${hasUpvoted ? 'text-[#F59E0B]' : 'text-gray-300 hover:text-[#F59E0B]'}`}
                    >
                        <FaArrowUp size={16} />
                    </button>
                    <span className={`text-lg font-black ${score > 0 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>{score}</span>
                    <button
                        onClick={(e) => handleVote(e, thread._id, 'down')}
                        className={`p-1.5 rounded-lg transition-all ${hasDownvoted ? 'text-[#F59E0B]' : 'text-gray-300 hover:text-[#F59E0B]'}`}
                    >
                        <FaArrowDown size={16} />
                    </button>
                </div>

                {/* Column 2: Publisher */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
                    {thread.author?.avatar ? (
                        <img src={thread.author.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs bg-[#001E80] text-white font-black uppercase">
                            {thread.author?.name?.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Column 3: Intelligence */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Row 1: Title & Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {thread.isPinned && <FaBookmark className="text-[#001E80] rotate-45" size={12} />}
                            <h3 className="text-[1.1rem] font-black text-gray-900 line-clamp-1 group-hover:text-[#001E80] transition-colors leading-tight tracking-tight">
                                {thread.title}
                            </h3>
                        </div>
                        <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100">
                            {thread.type || 'Discussion'}
                        </span>
                    </div>

                    {/* Row 2: Metadata */}
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <span className="text-gray-900 group-hover:text-[#001E80] transition-colors">{thread.author?.name}</span>
                        <span className="bg-[#F0EBFF] text-[#6366F1] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Elite</span>
                        <span>•</span>
                        <span>4 days ago</span>
                    </div>

                    {/* Row 3: Engagement Stats */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <FaRegComment size={14} />
                            <span className="text-xs font-black tracking-tight">{thread.postCount || 0} comments</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FaRegEye size={14} />
                            <span className="text-xs font-black tracking-tight">{thread.views?.toLocaleString() || 0} views</span>
                        </div>
                    </div>

                    {/* Row 4: Tech Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {thread.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-white text-gray-600 text-[10px] font-bold px-3 py-1 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <HubHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreateClick={() => setShowCreateModal(true)}
                user={user}
            />

            <main className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
                {/* Column 1: Left Sidebar - Navigation & Categories */}
                <aside className="w-[240px] flex-shrink-0 space-y-8">
                    <nav className="space-y-1">
                        {[
                            { name: 'Home Feed', icon: FaHome },
                            { name: 'Hot Threads', icon: FaFire },
                            { name: 'Trending', icon: FaChartLine }
                        ].map(item => (
                            <button
                                key={item.name}
                                onClick={() => setSearchParams({ tab: item.name })}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeNav === item.name ? 'bg-white text-[#001E80] shadow-sm shadow-[#001E80]/5' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                            >
                                <item.icon size={18} className={activeNav === item.name ? 'text-[#001E80]' : 'text-gray-400'} />
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <div className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categories</h4>
                        <div className="space-y-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.name}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-50"
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Column 2: Central Feed */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {!activeThreadId ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-6">
                                    {loading ? (
                                        Array(3).fill(0).map((_, i) => <div key={i} className="h-44 bg-white rounded-3xl animate-pulse" />)
                                    ) : (
                                        threads.map(renderCard)
                                    )}

                                    <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                                        Load More Threads
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 space-y-8"
                            >
                                <button
                                    onClick={() => setActiveThreadId(null)}
                                    className="flex items-center gap-2 text-xs font-black uppercase text-[#001E80] hover:gap-4 transition-all"
                                >
                                    <FaChevronLeft /> Back to Dashboard
                                </button>

                                {/* High Fidelity Detail Content */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                            {activeThread.title}
                                        </h1>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100">
                                                    {activeThread.author?.avatar && <img src={activeThread.author.avatar} className="w-full h-full rounded-full" />}
                                                </div>
                                                <span className="text-sm font-bold">{activeThread.author?.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">• {new Date(activeThread.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-blue max-w-none font-medium text-gray-700">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeThread.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Column 3: Right Sidebar - Stats & Social */}
                <aside className="w-[300px] flex-shrink-0 space-y-6">
                    {/* Forum Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
                        <h4 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-4">Forum Stats</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Total Threads', value: '24,532', color: 'text-gray-500' },
                                { label: 'Total Members', value: '145,892', color: 'text-gray-500' },
                                { label: 'Active Today', value: '12,453', color: 'text-green-500' }
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-gray-400">{stat.label}</span>
                                    <span className={stat.color}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
                        <h4 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-4">Top Contributors</h4>
                        <div className="space-y-5">
                            {[
                                { name: 'TechGuru', rep: '24,500' },
                                { name: 'CyberNinja', rep: '15,240' },
                                { name: 'CodeWizard', rep: '12,100' }
                            ].map(user => (
                                <div key={user.name} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 ring-2 ring-gray-50 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{user.rep} rep</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            <AIChatBot applyFilters={(f) => { }} />

            {/* Create Modal - Kept for functionality */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-xl bg-white rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900">Create Thread</h2>
                                    <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                <input
                                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#001E80]/10"
                                    placeholder="Discussion Title..."
                                    value={createData.title}
                                    onChange={e => setCreateData({ ...createData, title: e.target.value })}
                                />
                                <textarea
                                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#001E80]/10 min-h-[150px]"
                                    placeholder="Write your intelligence briefing..."
                                    value={createData.content}
                                    onChange={e => setCreateData({ ...createData, content: e.target.value })}
                                />
                                <button
                                    onClick={async () => {
                                        try {
                                            const fd = new FormData();
                                            fd.append('title', createData.title);
                                            fd.append('content', createData.content);
                                            await resourceService.createThread(fd, user.token);
                                            toast.success('Thread Broadcasted');
                                            setShowCreateModal(false);
                                            fetchThreads();
                                        } catch (e) { toast.error('Broadcast failed'); }
                                    }}
                                    className="w-full bg-[#001E80] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#001660] transition-all shadow-lg shadow-blue-900/20"
                                >
                                    Publish Thread
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourceHub;
