import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import resourceService from '../features/resources/resourceService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaArrowUp, FaComment, FaClock, FaPaperclip, FaChevronLeft, FaPaperPlane, FaInfoCircle, FaTags, FaUser, FaCheckCircle } from 'react-icons/fa';

const ThreadDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleAcknowledge = async () => {
        try {
            await resourceService.acknowledgeInstructions(id, user.token);
            setShowInstructions(false);
            toast.success('Terms acknowledged. You can now post.');
            fetchDetail(); // Refresh to update acknowledgedUsers array
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to acknowledge instructions');
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', tags: '' });
    const [modUsername, setModUsername] = useState('');
    const [replyTo, setReplyTo] = useState(null); // Track which post we're replying to
    const [reviewNotes, setReviewNotes] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false); // postId
    const [alertTargets, setAlertTargets] = useState(['owner', 'moderators']); // default
    const [specificReviewUser, setSpecificReviewUser] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const [isEditingInstructions, setIsEditingInstructions] = useState(false);
    const [tempInstructions, setTempInstructions] = useState('');

    // V2.0: Price management
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceData, setPriceData] = useState({ isPaid: false, price: 0 });

    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(true); // V2.0: Track if user has access to paid content
    const [purchasing, setPurchasing] = useState(false); // V2.0: Track purchase in progress

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await resourceService.getThreadDetail(id, user?.token);
            setThread(data.thread);
            setPosts(data.posts);
            setHasAccess(data.hasAccess !== false); // V2.0: Backend returns hasAccess flag
            setEditData({ title: data.thread.title, tags: data.thread.tags?.join(', ') || '' });
            setLoading(false);
        } catch (error) {
            console.error('Thread fetch error:', error);
            setError(error.response?.data?.message || 'Failed to load thread');
            setLoading(false);
        }
    }, [id, user?.token]); // Only re-create when id or token changes

    // V2.0: Purchase Thread
    const handlePurchaseThread = async () => {
        if (!user) {
            toast.error('Please login to purchase');
            return;
        }

        if (window.confirm(`Unlock this intelligence for ${thread.price} stars?`)) {
            setPurchasing(true);
            try {
                const response = await resourceService.purchaseThread(id, user.token);
                toast.success('🎉 Thread unlocked!');

                // Update user stars in localStorage and context
                const updatedUser = { ...user, stars: response.stars };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Trigger re-render by updating context (if setUser exists)
                // Force context refresh by reloading user from localStorage
                window.dispatchEvent(new Event('storage'));

                // Refresh thread detail to update access
                await fetchDetail();
            } catch (error) {
                console.error('Purchase error:', error);
                toast.error(error.response?.data?.message || 'Purchase failed');
            } finally {
                setPurchasing(false);
            }
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]); // Use memoized function in dependency

    const handleUpdateThread = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = editData.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(t => t !== '#');
            await resourceService.updateThread(id, { title: editData.title, tags: tagsArray }, user.token);
            toast.success('Mission Updated');
            setIsEditing(false);
            fetchDetail();
        } catch (error) {
            toast.error('Failed to update mission');
        }
    };

    const handleDeleteThread = async () => {
        if (!window.confirm('Terminate this mission briefing permanently?')) return;
        try {
            await resourceService.deleteThread(id, user.token);
            toast.success('Mission Terminated');
            window.location.href = '/resources';
        } catch (error) {
            toast.error('Failed to terminate mission');
        }
    };

    const handleAddMod = async (e) => {
        e.preventDefault();
        try {
            await resourceService.addModerator(id, modUsername, user.token);
            toast.success(`${modUsername} granted moderator privileges`);
            setModUsername('');
            fetchDetail();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to grant privileges');
        }
    };

    const handleRemoveMod = async (userId) => {
        if (!window.confirm('Revoke moderator privileges from this user?')) return;
        try {
            await resourceService.removeModerator(id, userId, user.token);
            toast.success('Moderator privileges revoked');
            fetchDetail();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to revoke privileges');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Remove this log entry?')) return;
        try {
            await resourceService.deletePost(postId, user.token);
            toast.success('Log entry removed');
            fetchDetail();
        } catch (error) {
            toast.error('Failed to remove log');
        }
    };

    const handleUpvote = async (postId) => {
        if (!user) return toast.info('Log in to upvote');
        try {
            await resourceService.toggleUpvote(postId, user.token);
            fetchDetail();
        } catch (error) {
            toast.error('Failed to sync upvote');
        }
    };

    const handleToggleGuide = async () => {
        if (!user) return toast.info('Log in to vote');
        try {
            await resourceService.toggleGuideVote(id, user.token);
            toast.success('Mission validation synced');
            fetchDetail();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sync validation');
        }
    };

    const handleRequestReview = async (postId) => {
        try {
            await resourceService.requestReview(postId, reviewNotes, alertTargets, specificReviewUser, user.token);
            toast.success('Review request broadcasted to selected targets');
            setShowReviewModal(null);
            setReviewNotes('');
            setAlertTargets(['owner', 'moderators']);
            setSpecificReviewUser('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to initiate review');
        }
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        if (!user) return toast.info('Log in to post');

        // Participation Guard (exempt owners and mods)
        if (needsAcknowledgment) {
            setShowInstructions(true);
            return toast.warning('Please acknowledge the mission instructions before posting.');
        }

        const formData = new FormData();
        formData.append('content', reply);
        formData.append('contentType', 'text');
        if (replyTo) {
            formData.append('parentPost', replyTo._id);
        }
        if (file) {
            formData.append('file', file);
        }

        try {
            await resourceService.addPost(id, formData, user.token);
            toast.success(replyTo ? 'Reply synced to branch' : 'Log synced to stream');
            setReply('');
            setReplyTo(null);
            setFile(null);
            fetchDetail();
        } catch (error) {
            toast.error('Failed to sync log');
        }
    };

    const handleUpdateInstructions = async () => {
        try {
            await resourceService.updateInstructions(id, tempInstructions, user.token);
            toast.success('Operational guidelines published and broadcasted.');
            setIsEditingInstructions(false);
            fetchDetail(); // This will refresh the thread state including instructions
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update instructions');
        }
    };

    // V2.0: Update thread price
    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        try {
            await resourceService.updateThreadPrice(id, priceData, user.token);
            toast.success('Thread pricing updated successfully!');
            setShowPriceModal(false);
            fetchDetail(); // Refresh thread data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update pricing');
        }
    };

    // Loading and error states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest animate-pulse">Loading thread...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-4">{error}</p>
                    <Link to="/resources" className="text-indigo-600 font-bold hover:underline">← Back to Resources</Link>
                </div>
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 font-bold mb-4">Thread not found</p>
                    <Link to="/resources" className="text-indigo-600 font-bold hover:underline">← Back to Resources</Link>
                </div>
            </div>
        );
    }

    // Calculate dynamic states based on current thread data
    const isOwner = user?._id === thread.author?._id;
    const isMod = thread.moderators?.some(mod => mod._id === user?._id) || isOwner;
    const needsAcknowledgment = thread.instructions && !isMod && user && !thread.acknowledgedUsers?.includes(user._id);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 relative pb-40">
            <Link to="/resources" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-10 hover:gap-4 transition-all group">
                <FaChevronLeft /> Back to Hub
            </Link>

            {/* V2.0: Paywall Overlay for Locked Threads */}
            {thread?.isPaid && !hasAccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl border-4 border-amber-300">
                        <div className="text-6xl mb-6">🔒</div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Premium Intelligence</h2>
                        <p className="text-gray-600 font-medium mb-8">
                            Unlock this exclusive content to access detailed information and community discussions.
                        </p>

                        <div className="flex items-center justify-center gap-3 mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6">
                            <span className="text-amber-500 text-4xl">⭐</span>
                            <span className="text-5xl font-black text-amber-700">{thread.price}</span>
                            <span className="text-lg text-amber-600 font-bold">Stars</span>
                        </div>

                        {user ? (
                            <>
                                <p className="text-sm text-gray-500 font-bold mb-6">
                                    Your Balance: <span className="text-amber-600">⭐ {user.stars || 0}</span>
                                </p>
                                <button
                                    onClick={handlePurchaseThread}
                                    disabled={purchasing || (user.stars || 0) < thread.price}
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${(user.stars || 0) >= thread.price
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl shadow-amber-200 hover:shadow-2xl'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {purchasing ? 'Unlocking...' : (user.stars || 0) < thread.price ? 'Insufficient Stars - Top Up' : `Unlock for ${thread.price} Stars`}
                                </button>
                                {(user.stars || 0) < thread.price && (
                                    <Link to="/top-up" className="block mt-4 text-blue-600 hover:text-blue-700 font-bold underline text-sm">
                                        Top Up Stars →
                                    </Link>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700">
                                Login to Unlock
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content (Left) */}
                <div className={`flex-1 space-y-12 ${thread?.isPaid && !hasAccess ? 'blur-lg pointer-events-none' : ''}`}>
                    <div className="bg-white rounded-[2rem] p-10 md:p-12 border border-gray-100 shadow-sm">
                        {isEditing ? (
                            <form onSubmit={handleUpdateThread} className="space-y-6">
                                <input
                                    className="w-full text-3xl font-black text-gray-900 leading-tight outline-none focus:ring-2 focus:ring-indigo-100 rounded-xl p-2"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                                <input
                                    className="w-full text-sm font-bold text-indigo-400 outline-none focus:ring-2 focus:ring-indigo-100 rounded-xl p-2"
                                    value={editData.tags}
                                    placeholder="Tags (comma separated)..."
                                    onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                                />
                                <div className="flex gap-4">
                                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase">Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs uppercase">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-8">
                                    {thread.title}
                                </h1>

                                <div className="prose prose-indigo max-w-none text-gray-700 font-medium">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {thread.content}
                                    </ReactMarkdown>
                                </div>
                            </>
                        )}

                        {thread.attachments?.length > 0 && (
                            <div className="mt-10 pt-10 border-t border-gray-50">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Attached Intelligence</p>
                                <div className="flex flex-wrap gap-4">
                                    {thread.attachments.map((att, idx) => (
                                        <a
                                            key={idx}
                                            href={`http://localhost:5000${att}`}
                                            target="_blank"
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                                        >
                                            <FaPaperclip /> View Attachment {idx + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mission Log (Posts) */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <FaComment className="text-indigo-600" /> Mission Log ({posts.length})
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {posts.filter(p => !p.parentPost).map((post) => (
                                <div key={post._id} className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center gap-2 shrink-0 pt-2">
                                            <button
                                                onClick={() => handleUpvote(post._id)}
                                                className={`p-2 rounded-lg border-2 transition-all ${post.upvotes?.includes(user?._id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-300 hover:text-indigo-400'}`}
                                            >
                                                <FaArrowUp size={12} />
                                            </button>
                                            <span className="text-[10px] font-black text-gray-900">{post.upvoteCount}</span>
                                        </div>

                                        <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative group/post">
                                            <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/u/${post.author?.username}`} className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[8px] font-black text-gray-400 hover:opacity-70">
                                                        {post.author?.name?.charAt(0)}
                                                    </Link>
                                                    <Link to={`/u/${post.author?.username}`} className="text-[10px] font-black text-gray-500 uppercase tracking-tighter hover:opacity-70">{post.author?.name}</Link>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => setReplyTo(post)} className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-600">Reply</button>
                                                    <span className="text-[9px] text-gray-300 font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    {isMod && (
                                                        <button
                                                            onClick={() => setShowReviewModal(post._id)}
                                                            className="text-amber-400 hover:text-amber-600 text-[10px]"
                                                            title="Request Review"
                                                        >
                                                            🚩
                                                        </button>
                                                    )}
                                                    {(isMod || user?._id === post.author?._id) && (
                                                        <button
                                                            onClick={() => handleDeletePost(post._id)}
                                                            className="text-red-300 hover:text-red-500 opacity-0 group-hover/post:opacity-100 transition-all"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="prose prose-sm prose-indigo max-w-none text-gray-700 font-medium">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {post.content}
                                                </ReactMarkdown>
                                            </div>
                                            {post.attachments?.map((att, idx) => (
                                                <a key={idx} href={`http://localhost:5000${att}`} target="_blank" className="mt-3 inline-flex items-center gap-2 text-indigo-400 text-[9px] font-black uppercase hover:underline">
                                                    <FaPaperclip /> Attachment
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nested Replies */}
                                    {posts.filter(reply => reply.parentPost === post._id).map(replyPost => (
                                        <div key={replyPost._id} className="flex gap-4 ml-12">
                                            <div className="flex flex-col items-center gap-2 shrink-0 pt-2">
                                                <button
                                                    onClick={() => handleUpvote(replyPost._id)}
                                                    className={`p-1.5 rounded-lg border-2 transition-all ${replyPost.upvotes?.includes(user?._id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-300 hover:text-indigo-400'}`}
                                                >
                                                    <FaArrowUp size={10} />
                                                </button>
                                                <span className="text-[9px] font-black text-gray-900">{replyPost.upvoteCount}</span>
                                            </div>
                                            <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shadow-sm relative group/reply">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Link to={`/u/${replyPost.author?.username}`} className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{replyPost.author?.name}</Link>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[8px] text-gray-300 font-bold">{new Date(replyPost.createdAt).toLocaleDateString()}</span>
                                                        {(isMod || user?._id === replyPost.author?._id) && (
                                                            <button
                                                                onClick={() => handleDeletePost(replyPost._id)}
                                                                className="text-red-300 hover:text-red-500 opacity-0 group-hover/reply:opacity-100 transition-all text-xs"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="prose prose-sm prose-indigo max-w-none text-gray-600 text-xs font-medium">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {replyPost.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel (Right) */}
                <div className="lg:w-80 shrink-0">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <FaInfoCircle /> About Mission
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Author</p>
                                    <Link to={`/u/${thread.author?.username}`} className="text-sm font-black text-gray-900 hover:text-indigo-600">{thread.author?.name}</Link>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${thread.isCurated ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                        {thread.isCurated ? 'Verified' : 'Community'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Topic Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {thread.tags?.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-50 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-lg border border-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-gray-400">
                                    <div className="text-center flex-1">
                                        <p className="text-gray-900 font-black text-lg leading-none mb-1">{posts.length}</p>
                                        <p className="text-[8px] font-bold uppercase tracking-widest">Logs</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-50"></div>
                                    <div className="text-center flex-1">
                                        <p className="text-gray-900 font-black text-lg leading-none mb-1">
                                            {posts.reduce((acc, curr) => acc + (curr.upvoteCount || 0), 0)}
                                        </p>
                                        <p className="text-[8px] font-bold uppercase tracking-widest">Votes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Command Team */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <FaUser /> Command Team
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg font-black text-indigo-200 overflow-hidden ring-2 ring-indigo-50">
                                        {thread.author?.avatar ? <img src={thread.author.avatar} alt="" className="w-full h-full object-cover" /> : thread.author?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <Link to={`/u/${thread.author?.username}`} className="text-sm font-black text-gray-900 hover:text-indigo-600 block leading-tight">{thread.author?.name}</Link>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mission Lead</p>
                                    </div>
                                </div>
                                {thread.moderators?.length > 0 && (
                                    <div className="pt-4 border-t border-gray-50 space-y-4">
                                        {thread.moderators.map(mod => (
                                            <div key={mod._id} className="flex items-center gap-4 group/mod">
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-black text-gray-200 overflow-hidden ring-1 ring-gray-100">
                                                    {mod.avatar ? <img src={mod.avatar} alt="" className="w-full h-full object-cover" /> : mod.name?.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <Link to={`/u/${mod.username}`} className="text-xs font-bold text-gray-800 hover:text-indigo-600 block leading-tight">{mod.name}</Link>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Tactical Moderator</p>
                                                </div>
                                                {isOwner && mod._id !== thread.author._id && (
                                                    <button
                                                        onClick={() => handleRemoveMod(mod._id)}
                                                        className="opacity-0 group-hover/mod:opacity-100 transition-all p-2 text-red-300 hover:text-red-500"
                                                        title="Revoke Privileges"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions Trigger */}
                        <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                                <FaInfoCircle /> Operational Guide
                            </h4>
                            {thread.instructions && (
                                <div className="text-[10px] text-amber-900/60 font-medium leading-relaxed mb-6 line-clamp-6 opacity-80">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {thread.instructions}
                                    </ReactMarkdown>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setTempInstructions(thread.instructions || '');
                                    setShowInstructions(true);
                                }}
                                className="w-full py-4 rounded-2xl bg-white border-2 border-amber-200 text-amber-600 font-extrabold text-xs uppercase tracking-widest shadow-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-3"
                            >
                                <FaInfoCircle /> {thread.instructions ? 'View Full Instructions' : 'Instructions'}
                            </button>
                        </div>

                        {/* Owner/Mod Panel */}
                        {isMod && (
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 font-bold">Manage Mission</h4>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all"
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Briefing'}
                                    </button>
                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={handleDeleteThread}
                                                className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                                            >
                                                Terminate Briefing
                                            </button>
                                            {/* V2.0: Pricing Management */}
                                            <button
                                                onClick={() => {
                                                    setPriceData({ isPaid: thread.isPaid || false, price: thread.price || 0 });
                                                    setShowPriceModal(true);
                                                }}
                                                className="w-full py-3 rounded-xl bg-amber-50 text-amber-600 font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-all border-2 border-amber-200"
                                            >
                                                ⭐ Manage Pricing
                                            </button>
                                            <div className="pt-4 border-t border-gray-50">
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Grant Privileges</p>
                                                <form onSubmit={handleAddMod} className="flex gap-2">
                                                    <input
                                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:bg-white"
                                                        placeholder="Username..."
                                                        value={modUsername}
                                                        onChange={(e) => setModUsername(e.target.value)}
                                                        required
                                                    />
                                                    <button type="submit" className="bg-gray-900 text-white p-2 rounded-lg">+</button>
                                                </form>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Community Validation</h4>
                            <p className="text-xs font-bold leading-relaxed mb-6">
                                If this mission brief is a valid GUIDE, validate it below. Missions with 3+ validations are auto-promoted.
                            </p>
                            <button
                                onClick={handleToggleGuide}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${thread.guideVotes?.includes(user?._id) ? 'bg-amber-400 text-gray-900 shadow-amber-200' : 'bg-white text-indigo-600 shadow-indigo-400/20 hover:scale-[1.02]'}`}
                            >
                                <span>{thread.guideVotes?.includes(user?._id) ? 'VALIDATED' : 'GUIDE'}</span>
                                <span className="bg-black/10 px-2 py-0.5 rounded-lg">{thread.guideVotes?.length || 0} / 3</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Reply Box */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none">
                <div className="max-w-6xl mx-auto flex">
                    <div className="flex-1 max-w-[calc(100%-20rem-2.5rem)] pointer-events-auto">
                        <form onSubmit={handleAddPost} className="bg-gray-900 rounded-[2rem] p-4 pr-6 pl-8 shadow-2xl flex items-center gap-4 border border-white/5 relative">
                            {replyTo && (
                                <div className="absolute -top-12 left-8 right-8 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-t-xl flex justify-between items-center shadow-lg animate-in slide-in-from-bottom-4">
                                    <span>Replying to {replyTo.author?.name}</span>
                                    <button onClick={() => setReplyTo(null)} className="hover:text-amber-300">Cancel</button>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="shrink-0 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-95 group relative"
                            >
                                <FaPaperclip size={18} />
                                {file && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-gray-900"></span>}
                            </button>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <textarea
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/40 min-h-[60px] max-h-[200px] resize-none"
                                placeholder={needsAcknowledgment ? "Acknowledge instructions to start posting..." : (replyTo ? "Type your branch reply..." : "Contribute to mission stream... (Markdown allowed)")}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                required
                                disabled={needsAcknowledgment}
                            />
                            <button
                                type="submit"
                                className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-900 transition-all active:scale-95 disabled:opacity-50"
                                disabled={needsAcknowledgment}
                            >
                                <FaPaperPlane size={18} />
                            </button>
                        </form>
                        {needsAcknowledgment && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center">
                                <button
                                    onClick={() => setShowInstructions(true)}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900 transition-all hover:scale-105 active:scale-95"
                                >
                                    Unlock Posting Entry
                                </button>
                            </div>
                        )}
                        {file && (
                            <div className="mt-2 ml-4 flex items-center gap-2">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-gray-900/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-indigo-400/20">
                                    Ready to upload: {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
                                </span>
                                <button onClick={() => setFile(null)} className="text-red-400 text-[10px] font-black hover:underline px-2">✕</button>
                            </div>
                        )}
                    </div>
                    {/* Placeholder for sidebar-aligned-area - keep floating box in left column */}
                    <div className="w-80 shrink-0 ml-10"></div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-widest flex items-center gap-2">
                            🚩 Initiate Post Review
                        </h3>
                        <p className="text-[10px] text-gray-500 mb-6 font-bold uppercase tracking-widest">Provide context & select alert targets</p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">Moderation Context</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
                                    placeholder="Add notes for the review session..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <label className="text-[10px] font-black text-indigo-400 uppercase mb-3 block tracking-widest">Alert Targets</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={alertTargets.includes('owner')}
                                            onChange={(e) => e.target.checked ? setAlertTargets([...alertTargets, 'owner']) : setAlertTargets(alertTargets.filter(t => t !== 'owner'))}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">Thread Owner</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={alertTargets.includes('moderators')}
                                            onChange={(e) => e.target.checked ? setAlertTargets([...alertTargets, 'moderators']) : setAlertTargets(alertTargets.filter(t => t !== 'moderators'))}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">All Moderators</span>
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={alertTargets.includes('specific')}
                                                onChange={(e) => e.target.checked ? setAlertTargets([...alertTargets, 'specific']) : setAlertTargets(alertTargets.filter(t => t !== 'specific'))}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">Specific Username</span>
                                        </label>
                                        {alertTargets.includes('specific') && (
                                            <input
                                                className="w-full bg-gray-50 border border-indigo-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:bg-white animate-in slide-in-from-top-2"
                                                placeholder="Enter username..."
                                                value={specificReviewUser}
                                                onChange={(e) => setSpecificReviewUser(e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowReviewModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                            <button onClick={() => handleRequestReview(showReviewModal)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Broadcast Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions Overlay */}
            {showInstructions && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-8 border-b border-gray-100 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mission Instructions</h2>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Operational Guidelines & Procedure</p>
                            </div>
                            <div className="flex gap-3">
                                {isMod && !isEditingInstructions && (
                                    <button
                                        onClick={() => setIsEditingInstructions(true)}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                                    >
                                        Edit Instructions
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowInstructions(false);
                                        setIsEditingInstructions(false);
                                    }}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl font-bold transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-10">
                            {isEditingInstructions ? (
                                <div className="space-y-6">
                                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Markdown Editor</p>
                                        <textarea
                                            className="w-full bg-white border border-indigo-100 rounded-xl p-6 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-indigo-50 min-h-[400px] shadow-inner"
                                            value={tempInstructions}
                                            onChange={(e) => setTempInstructions(e.target.value)}
                                            placeholder="Enter operational guide in Markdown..."
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleUpdateInstructions}
                                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
                                        >
                                            Publish Instructions
                                        </button>
                                        <button
                                            onClick={() => setIsEditingInstructions(false)}
                                            className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                                        >
                                            Discard Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-indigo max-w-none text-gray-700 font-medium leading-relaxed">
                                    {thread.instructions ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {thread.instructions}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No detailed instructions provided for this mission.</p>
                                            {isMod && (
                                                <button
                                                    onClick={() => setIsEditingInstructions(true)}
                                                    className="mt-6 px-6 py-3 bg-white border border-gray-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
                                                >
                                                    Add Instructions Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {needsAcknowledgment && (
                                <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col items-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Participation Protocol Acknowledgment Required</p>
                                    <button
                                        onClick={handleAcknowledge}
                                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        <FaCheckCircle /> I Understand & Agree to Guidelines
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* V2.0: Pricing Management Modal */}
            {showPriceModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-800 mb-6">⭐ Thread Pricing</h3>
                        <form onSubmit={handleUpdatePrice} className="space-y-6">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={priceData.isPaid}
                                        onChange={(e) => setPriceData({ ...priceData, isPaid: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700">Require stars to access this thread</span>
                                </label>
                            </div>

                            {priceData.isPaid && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Price (stars)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={priceData.price}
                                        onChange={(e) => setPriceData({ ...priceData, price: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none font-bold text-lg"
                                        placeholder="Enter star amount"
                                        required={priceData.isPaid}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Users will need to pay this amount to access the thread</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPriceModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
                                >
                                    Save Pricing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreadDetail;
