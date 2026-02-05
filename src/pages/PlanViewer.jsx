import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaChevronDown, FaChevronUp, FaClock, FaComment, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import planService from '../features/plans/planService';

const PlanViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedVersion, setExpandedVersion] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});

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
                <h1 className="text-3xl font-black text-gray-900 mb-2">Your Mentorship Plan</h1>
                <p className="text-gray-600 font-medium">
                    <span className="font-bold">Mentor:</span> {plan.mentor.name} ({plan.mentor.username ? `@${plan.mentor.username}` : 'No username'})
                </p>
                <p className="text-sm text-gray-500 mt-4 italic">
                    Your mentor has created {plan.versions.length} version{plan.versions.length !== 1 ? 's' : ''} of your personalized roadmap. Feel free to ask questions in the discussion section!
                </p>
            </div>

            {/* Version Timeline */}
            <div className="space-y-6">
                {plan.versions.slice().reverse().map((version, displayIdx) => {
                    const actualIdx = plan.versions.length - 1 - displayIdx;
                    return (
                        <div key={actualIdx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                onClick={() => setExpandedVersion(expandedVersion === actualIdx ? null : actualIdx)}
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
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaComment /> {version.comments.length}
                                    </span>
                                    {expandedVersion === actualIdx ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                </div>
                            </div>

                            {expandedVersion === actualIdx && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                                    {/* Rendered Content */}
                                    <div className="prose prose-lg prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal max-w-none mb-6 bg-white p-6 rounded-2xl border border-gray-100">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{version.content}</ReactMarkdown>
                                    </div>

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
                                                placeholder="Ask a question or share progress..."
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

export default PlanViewer;
