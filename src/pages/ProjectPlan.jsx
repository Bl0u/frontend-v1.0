import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaPlus, FaChevronDown, FaChevronUp, FaClock, FaComment, FaSave, FaArrowLeft, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import planService from '../features/plans/planService';

const ProjectPlan = () => {
    const { projectId } = useParams();
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
        if (user && projectId) {
            fetchProjectPlan();
        }
    }, [projectId, user]);

    const fetchProjectPlan = async () => {
        if (!user) return;
        try {
            const data = await planService.getProjectPlan(projectId, user.token);
            setPlan(data);
            if (data.versions.length > 0) {
                setExpandedVersion(data.versions.length - 1);
            }
        } catch (error) {
            if (user) {
                toast.error('Failed to load project plan');
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
            const updated = await planService.addVersion(plan._id, newVersion, user.token);
            setPlan(updated);
            setNewVersion({ title: '', content: '', isMajor: false });
            setShowNewVersionForm(false);
            setExpandedVersion(updated.versions.length - 1);
            toast.success('New version published to the team');
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
            const updated = await planService.addComment(plan._id, versionIdx, { text }, user.token);
            setPlan(updated);
            setCommentTexts({ ...commentTexts, [versionIdx]: '' });
            toast.success('Comment posted');
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
            const updated = await planService.editVersion(plan._id, idx, editContent, user.token);
            setPlan(updated);
            setEditingVersion(null);
            toast.success('Version updated');
        } catch (error) {
            toast.error('Failed to update version');
            console.error(error);
        }
    };

    const handleDeleteVersion = async (idx) => {
        if (!window.confirm('Delete this version? members will no longer see it.')) {
            return;
        }

        try {
            const updated = await planService.deleteVersion(plan._id, idx, user.token);
            setPlan(updated);
            setEditingVersion(null);
            setExpandedVersion(null);
            toast.success('Version deleted');
        } catch (error) {
            toast.error('Failed to delete version');
            console.error(error);
        }
    };

    const getVersionLabel = (version) => {
        return `v${version.versionMajor}.${version.versionMinor}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    if (!plan) return <div className="max-w-5xl mx-auto my-10 px-4 text-center">Project plan workspace not found</div>;

    const project = plan.projectRef;
    const projectTitle = project?.pitch?.Hook || project?.pitch?.["The Hook (Short summary)"] || "Shared Project Plan";

    return (
        <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#001E80]/60 hover:text-[#001E80] font-bold transition-colors">
                <FaArrowLeft /> Back to Dashboard
            </button>

            {/* Project Hub Header */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-900 to-[#001E80] p-10 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
                            <FaUsers /> Team Workspace
                        </span>
                        {project?.status === 'completed' && (
                            <span className="bg-green-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/30 text-green-400">
                                Completed Mission
                            </span>
                        )}
                    </div>

                    <h1
                        className="text-5xl font-black mb-4 leading-tight"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '1px' }}
                    >
                        {projectTitle}
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center text-white font-bold text-xs">
                                L
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center text-white font-bold text-xs">
                                +{project?.contributors?.length || 0}
                            </div>
                        </div>
                        <p className="text-white/60 text-sm font-medium">Collaborative roadmap for all team members</p>
                    </div>
                </div>

                {/* Visual Flair */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Action Bar */}
            {!showNewVersionForm && (
                <button
                    onClick={() => setShowNewVersionForm(true)}
                    className="w-full bg-white border border-[#001E80]/10 hover:border-[#001E80]/30 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-[#001E80] shadow-sm transition-all flex items-center justify-center gap-3 group"
                >
                    <div className="w-8 h-8 rounded-full bg-[#EAEEFE] flex items-center justify-center group-hover:bg-[#001E80] group-hover:text-white transition-colors">
                        <FaPlus />
                    </div>
                    Publish Update to Team
                </button>
            )}

            {/* New Version Form */}
            {showNewVersionForm && (
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-[#001E80] rounded-full inline-block"></span>
                        Update Workspace
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-3">Milestone Importance</label>
                            <div className="flex gap-4">
                                {[{ val: false, l: 'Progress Update' }, { val: true, l: 'Major Milestone' }].map(t => (
                                    <button
                                        key={t.l}
                                        type="button"
                                        onClick={() => setNewVersion({ ...newVersion, isMajor: t.val })}
                                        className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border transition-all ${newVersion.isMajor === t.val ? 'bg-[#001E80] text-white border-[#001E80] shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}
                                    >
                                        {t.l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-3">Milestone Title</label>
                            <input
                                type="text"
                                value={newVersion.title}
                                onChange={(e) => setNewVersion({ ...newVersion, title: e.target.value })}
                                placeholder="e.g., Q1 Delivery: MVP Core Architecture"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#001E80]/20 focus:ring-4 focus:ring-[#001E80]/5 outline-none text-sm font-bold transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-3">Documentation (Markdown)</label>
                            <textarea
                                value={newVersion.content}
                                onChange={(e) => setNewVersion({ ...newVersion, content: e.target.value })}
                                placeholder="Use markdown to structure your update..."
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-[#001E80]/20 focus:ring-4 focus:ring-[#001E80]/5 outline-none text-sm font-medium min-h-[250px] transition-all"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddVersion}
                                className="flex-grow bg-[#001E80] hover:bg-[#010D3E] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#001E80]/20"
                            >
                                Publish Version
                            </button>
                            <button
                                onClick={() => setShowNewVersionForm(false)}
                                className="px-10 bg-gray-100 hover:bg-gray-200 text-gray-500 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                {/* Vert line for timeline */}
                <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent"></div>

                <div className="space-y-8">
                    {plan.versions.slice().reverse().map((version, displayIdx) => {
                        const actualIdx = plan.versions.length - 1 - displayIdx;
                        const isExpanded = expandedVersion === actualIdx;

                        return (
                            <div key={actualIdx} className="relative pl-16">
                                {/* Dot on timeline */}
                                <div className={`absolute left-[18px] top-8 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-500 z-10 ${isExpanded ? 'bg-[#001E80] scale-125' : 'bg-gray-300'}`}></div>

                                <div className={`bg-white rounded-[32px] border transition-all duration-300 ${isExpanded ? 'border-[#001E80]/30 shadow-2xl' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}>
                                    <div
                                        onClick={() => editingVersion !== actualIdx && setExpandedVersion(isExpanded ? null : actualIdx)}
                                        className="p-8 cursor-pointer flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-[#001E80] uppercase tracking-tighter mb-1 opacity-50">Version</p>
                                                <p className="text-xl font-black text-[#001E80] tracking-tight">{getVersionLabel(version)}</p>
                                            </div>
                                            <div className="w-px h-10 bg-gray-100"></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#001E80] transition-colors">{version.title}</h3>
                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <span className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md uppercase tracking-widest">
                                                        <FaClock /> {new Date(version.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50/50 rounded-md uppercase tracking-widest">
                                                        <FaComment /> {version.comments.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {isExpanded && !editingVersion === actualIdx && (
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); handleEditVersion(actualIdx, version); }} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><FaEdit /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteVersion(actualIdx); }} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><FaTrash /></button>
                                                </div>
                                            )}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-[#001E80] text-white rotate-180' : 'bg-gray-50 text-gray-300'}`}>
                                                <FaChevronDown size={12} />
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-8 pt-0 animate-in fade-in duration-300">
                                            <div className="h-px bg-gray-100 mb-8"></div>

                                            {editingVersion === actualIdx ? (
                                                <div className="space-y-6 bg-gray-50 p-6 rounded-3xl mb-8">
                                                    <input
                                                        type="text"
                                                        value={editContent.title}
                                                        onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white border border-transparent rounded-2xl focus:border-[#001E80]/20 outline-none text-sm font-bold"
                                                    />
                                                    <textarea
                                                        value={editContent.content}
                                                        onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white border border-transparent rounded-2xl focus:border-[#001E80]/20 outline-none text-sm font-medium min-h-[200px]"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button onClick={() => handleSaveEdit(actualIdx)} className="flex-grow bg-green-600 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"><FaSave /> Save</button>
                                                        <button onClick={() => setEditingVersion(null)} className="px-8 bg-white text-gray-400 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border border-gray-100">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="prose prose-sm max-w-none bg-gray-50/50 p-8 rounded-3xl border border-gray-100 mb-8">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{version.content}</ReactMarkdown>
                                                </div>
                                            )}

                                            {/* Team Discussion */}
                                            <div className="bg-white rounded-3xl border border-gray-50 p-6">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Team Feedback</p>
                                                <div className="space-y-4 mb-6">
                                                    {version.comments.map((comment, cIdx) => (
                                                        <div key={cIdx} className="flex gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                                                                {comment.authorName?.charAt(0)}
                                                            </div>
                                                            <div className="flex-grow bg-gray-50 px-5 py-4 rounded-[20px] rounded-tl-none relative">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-xs font-black text-gray-900">{comment.authorName}</span>
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3 mt-2">
                                                    <input
                                                        type="text"
                                                        value={commentTexts[actualIdx] || ''}
                                                        onChange={(e) => setCommentTexts({ ...commentTexts, [actualIdx]: e.target.value })}
                                                        placeholder="Write to your team..."
                                                        className="flex-grow px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#001E80]/10 outline-none text-sm transition-all"
                                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(actualIdx)}
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(actualIdx)}
                                                        className="px-8 bg-[#001E80]/5 hover:bg-[#001E80] text-[#001E80] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectPlan;
