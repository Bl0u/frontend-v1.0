import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaPlus, FaChevronDown, FaChevronUp, FaClock, FaComment, FaSave, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import planService from '../features/plans/planService';

const PlanManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedVersion, setExpandedVersion] = useState(null);
    const [newVersion, setNewVersion] = useState({ title: '', content: '', isMajor: false });
    const [showNewVersionForm, setShowNewVersionForm] = useState(false);
    const [commentTexts, setCommentTexts] = useState({});
    const [editingVersion, setEditingVersion] = useState(null);
    const [editContent, setEditContent] = useState({ title: '', content: '' });

    useEffect(() => {
        if (user && id) {
            fetchPlan();
        }
    }, [id, user]);

    const fetchPlan = async () => {
        if (!user) return; // Prevent fetch if logged out

        try {
            const data = await planService.getPlan(id, user.token);
            setPlan(data);
            // Auto-expand latest version
            if (data.versions.length > 0) {
                setExpandedVersion(data.versions.length - 1);
            }
        } catch (error) {
            // Only show error toast if user is still logged in
            if (user) {
                toast.error('Failed to load plan');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVersion = async () => {
        if (!newVersion.title.trim() || !newVersion.content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const updated = await planService.addVersion(id, newVersion, user.token);
            setPlan(updated);
            setNewVersion({ title: '', content: '', isMajor: false });
            setShowNewVersionForm(false);
            setExpandedVersion(updated.versions.length - 1);
            toast.success('New version added successfully');
        } catch (error) {
            toast.error('Failed to add version');
            console.error(error);
        }
    };

    const handleAddComment = async (versionIdx) => {
        const text = commentTexts[versionIdx]?.trim();
        if (!text) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            const updated = await planService.addComment(id, versionIdx, { text }, user.token);
            setPlan(updated);
            setCommentTexts({ ...commentTexts, [versionIdx]: '' });
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
            console.error(error);
        }
    };

    const handleEditVersion = (idx, version) => {
        setEditingVersion(idx);
        setEditContent({ title: version.title, content: version.content });
    };

    const handleSaveEdit = async (idx) => {
        if (!editContent.title.trim() || !editContent.content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const updated = await planService.editVersion(id, idx, editContent, user.token);
            setPlan(updated);
            setEditingVersion(null);
            toast.success('Version updated successfully');
        } catch (error) {
            toast.error('Failed to update version');
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setEditingVersion(null);
        setEditContent({ title: '', content: '' });
    };

    const handleDeleteVersion = async (idx) => {
        if (!window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
            return;
        }

        try {
            const updated = await planService.deleteVersion(id, idx, user.token);
            setPlan(updated);
            setEditingVersion(null);
            setExpandedVersion(null);
            toast.success('Version deleted successfully');
        } catch (error) {
            toast.error('Failed to delete version');
            console.error(error);
        }
    };

    const getVersionLabel = (version) => {
        return `v${version.versionMajor}.${version.versionMinor}`;
    };

    if (loading) {
        return <div className="max-w-5xl mx-auto my-10 px-4 text-center">Loading plan...</div>;
    }

    if (!plan) {
        return <div className="max-w-5xl mx-auto my-10 px-4 text-center">Plan not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Mentorship Plan</h1>
                <p className="text-gray-600 font-medium">
                    <span className="font-bold">Mentee:</span> {plan.mentee.name} (@{plan.mentee.username})
                </p>
            </div>

            {/* New Version Button */}
            {(() => {
                // Defensive check: ensure plan.mentor exists
                if (!plan.mentor || !plan.mentor._id) {
                    console.warn('Plan mentor not populated:', plan.mentor);
                    return null;
                }

                const isMentor = plan.mentor._id.toString() === user._id;
                console.log('Add Version Button Debug:', {
                    showNewVersionForm,
                    planMentorId: plan.mentor._id.toString(),
                    userId: user._id,
                    isMentor,
                    willShow: !showNewVersionForm && isMentor
                });
                return !showNewVersionForm && isMentor && (
                    <button
                        onClick={() => setShowNewVersionForm(true)}
                        className="mb-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                    >
                        <FaPlus /> Create New Version
                    </button>
                );
            })()}

            {/* New Version Form */}
            {showNewVersionForm && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Create New Version</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Version Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!newVersion.isMajor}
                                        onChange={() => setNewVersion({ ...newVersion, isMajor: false })}
                                        className="w-4 h-4 accent-indigo-600"
                                    />
                                    <span className="text-sm font-medium">Minor Update (0.x)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={newVersion.isMajor}
                                        onChange={() => setNewVersion({ ...newVersion, isMajor: true })}
                                        className="w-4 h-4 accent-indigo-600"
                                    />
                                    <span className="text-sm font-medium">Major Update (x.0)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Title</label>
                            <input
                                type="text"
                                value={newVersion.title}
                                onChange={(e) => setNewVersion({ ...newVersion, title: e.target.value })}
                                placeholder="e.g., Week 1 Goals & Milestones"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Content (Markdown Supported)</label>
                            <textarea
                                value={newVersion.content}
                                onChange={(e) => setNewVersion({ ...newVersion, content: e.target.value })}
                                placeholder="Use markdown: **bold**, *italic*, # Heading, - List item"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium min-h-[200px]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddVersion}
                                className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <FaSave /> Publish Version
                            </button>
                            <button
                                onClick={() => setShowNewVersionForm(false)}
                                className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Version Timeline */}
            <div className="space-y-6">
                {plan.versions.slice().reverse().map((version, displayIdx) => {
                    const actualIdx = plan.versions.length - 1 - displayIdx; // Get actual index
                    return (
                        <div key={actualIdx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                onClick={() => editingVersion !== actualIdx && setExpandedVersion(expandedVersion === actualIdx ? null : actualIdx)}
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-all flex justify-between items-center"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                        <span className="text-indigo-600 font-black text-sm">{getVersionLabel(version)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{version.title}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            <FaClock /> {new Date(version.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {editingVersion !== actualIdx && plan.mentor._id === user.id && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditVersion(actualIdx, version); }}
                                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteVersion(actualIdx); }}
                                                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </>
                                    )}
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaComment /> {version.comments.length}
                                    </span>
                                    {expandedVersion === actualIdx ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                </div>
                            </div>

                            {expandedVersion === actualIdx && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                                    {editingVersion === actualIdx ? (
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={editContent.title}
                                                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Content (Markdown)</label>
                                                <textarea
                                                    value={editContent.content}
                                                    onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium min-h-[200px]"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleSaveEdit(actualIdx)}
                                                    className="flex-grow bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                                >
                                                    <FaSave /> Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose prose-lg prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal max-w-none mb-6 bg-white p-6 rounded-2xl border border-gray-100">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{version.content}</ReactMarkdown>
                                        </div>
                                    )}

                                    {/* Comments */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-600">Discussion</h4>

                                        {version.comments.map((comment, cIdx) => (
                                            <div key={cIdx} className="bg-white p-4 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-sm text-indigo-600">{comment.authorName}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.text}</p>
                                            </div>
                                        ))}

                                        {/* Add Comment */}
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={commentTexts[actualIdx] || ''}
                                                onChange={(e) => setCommentTexts({ ...commentTexts, [actualIdx]: e.target.value })}
                                                placeholder="Add a comment or question..."
                                                className="flex-grow px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(actualIdx)}
                                            />
                                            <button
                                                onClick={() => handleAddComment(actualIdx)}
                                                className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default PlanManager;
