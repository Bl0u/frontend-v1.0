import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import { FaExternalLinkAlt, FaUserFriends, FaBook, FaChevronRight } from 'react-icons/fa';
import requestService from '../features/requests/requestService';
import planService from '../features/plans/planService';
import resourceService from '../features/resources/resourceService';
import PitchQuestionsManager from '../components/PitchQuestionsManager';

const Dashboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tab driven by URL: /home (default), /home?tab=partnership, /home?tab=pitch-questions
    const activeTab = searchParams.get('tab') || 'home';

    // History & Notes State
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [showPitchModal, setShowPitchModal] = useState(false);

    // Contributions State
    const [myThreads, setMyThreads] = useState([]);
    const [loadingThreads, setLoadingThreads] = useState(false);

    const fetchProfile = async () => {
        if (!currentUser) return;
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser._id}`, config);
            setProfile(res.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
            if (currentUser) toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPlan = async (targetUserId) => {
        if (!currentUser) return;
        try {
            const plan = await planService.getPlanByPair(targetUserId, currentUser.token);
            navigate(`/plan/${plan._id}`);
        } catch (error) {
            try {
                const newPlan = await planService.createPlan(
                    targetUserId,
                    {
                        title: 'Initial Collaboration Plan',
                        content: `# Welcome to our Collaboration!\n\nThis is our shared roadmap. We can update this regularly with goals, milestones, and resources.`
                    },
                    currentUser.token
                );
                toast.success('Plan created successfully');
                navigate(`/plan/${newPlan._id}`);
            } catch (createError) {
                toast.error('Failed to create plan');
                console.error(createError);
            }
        }
    };

    const handleEndRelationship = async (targetUserId, type) => {
        if (!window.confirm('Are you sure you want to end this partnership?')) return;
        try {
            await requestService.endRelationship(targetUserId, type, currentUser.token);
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} completed! Great work.`);
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to end ${type}`);
        }
    };

    useEffect(() => {
        if (currentUser) fetchProfile();
    }, [currentUser]);

    // Fetch threads if active tab is contributions
    useEffect(() => {
        if (activeTab === 'contributions' && currentUser) {
            const fetchMyThreads = async () => {
                setLoadingThreads(true);
                try {
                    const data = await resourceService.getThreads({ author: currentUser._id });
                    setMyThreads(data);
                } catch (error) {
                    toast.error('Failed to load contributions');
                } finally {
                    setLoadingThreads(false);
                }
            };
            fetchMyThreads();
        }
    }, [activeTab, currentUser]);

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );
    if (!profile) return <div className="text-center py-20 text-gray-400">Profile not found.</div>;

    const activePartners = profile.enrolledPartners?.filter(p => p.status === 'active') || [];
    const completedCount = profile.partnerHistory?.length || 0;

    // ─── HOME TAB (default) ────────────────────────────
    if (!searchParams.get('tab') || activeTab === 'home') {
        return (
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEEFE] to-white p-10 border border-[#001E80]/5">
                    <div className="relative z-10">
                        <p className="text-[#001E80]/50 text-sm font-semibold tracking-wide uppercase mb-2">Dashboard</p>
                        <h1
                            className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            Welcome back, {profile.name}
                        </h1>
                        <p className="text-[#010D3E]/60 mt-2 font-medium">
                            {profile.major || profile.currentField || 'Student'}
                        </p>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-[#001E80]/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#001E80]/3 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-[#001E80] to-[#010D3E] rounded-2xl p-6 text-white shadow-lg shadow-[#001E80]/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Active Partnerships</p>
                        <p className="text-4xl font-black">{activePartners.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#001E80] to-[#010D3E] rounded-2xl p-6 text-white shadow-lg shadow-[#001E80]/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Completed</p>
                        <p className="text-4xl font-black">{completedCount}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#001E80] to-[#010D3E] rounded-2xl p-6 text-white shadow-lg shadow-[#001E80]/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Impact Score</p>
                        <p className="text-4xl font-black">{activePartners.length + completedCount}</p>
                    </div>
                </div>

                {/* Active Partnerships */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <FaUserFriends className="text-[#001E80]" /> Active Partnerships
                        </h3>
                        <span className="bg-[#EAEEFE] px-3 py-1 rounded-full text-xs font-bold text-[#001E80]">
                            {activePartners.length}
                        </span>
                    </div>
                    <div className="p-6">
                        {activePartners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activePartners.map((enrollment, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#001E80]/10 hover:bg-[#EAEEFE]/30 transition-all">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#001E80] to-[#010D3E] rounded-xl flex items-center justify-center text-base font-black text-white overflow-hidden">
                                            {enrollment.user?.avatar ? <img src={enrollment.user.avatar} alt="" className="w-full h-full object-cover" /> : enrollment.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/u/${enrollment.user?.username}`} className="font-bold text-gray-900 leading-tight hover:text-[#001E80] transition-colors">
                                                {enrollment.user?.name || 'Unknown User'}
                                            </Link>
                                            <p className="text-xs text-gray-400">Collaborator</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleOpenPlan(enrollment.user?._id)}
                                                className="text-[10px] font-bold text-[#001E80] hover:text-[#001E80]/70 uppercase tracking-tight flex items-center gap-1 transition-colors"
                                            >
                                                <FaBook /> Plan
                                            </button>
                                            {enrollment.user?.username && (
                                                <Link to={`/u/${enrollment.user.username}`} className="text-[#001E80]/40 hover:text-[#001E80] transition-colors">
                                                    <FaExternalLinkAlt size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">No active partnerships yet.</p>
                                <Link to="/partners" className="inline-block mt-4 text-sm font-bold text-[#001E80] hover:underline">
                                    Find Partners →
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    // ─── PARTNERSHIP TAB ────────────────────────────────
    if (activeTab === 'partnership') {
        return (
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Partnerships
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Manage your active and past collaborations</p>
                </div>

                {/* Active Partnerships */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <FaUserFriends className="text-[#001E80]" /> Active
                        </h3>
                        <span className="bg-[#EAEEFE] px-3 py-1 rounded-full text-xs font-bold text-[#001E80]">
                            {activePartners.length}
                        </span>
                    </div>
                    <div className="p-6">
                        {activePartners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activePartners.map((enrollment, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#001E80]/10 hover:bg-[#EAEEFE]/30 transition-all">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#001E80] to-[#010D3E] rounded-xl flex items-center justify-center text-base font-black text-white overflow-hidden">
                                            {enrollment.user?.avatar ? <img src={enrollment.user.avatar} alt="" className="w-full h-full object-cover" /> : enrollment.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/u/${enrollment.user?.username}`} className="font-bold text-gray-900 leading-tight hover:text-[#001E80] transition-colors">
                                                {enrollment.user?.name || 'Unknown User'}
                                            </Link>
                                            <p className="text-xs text-gray-400">Collaborator</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => handleOpenPlan(enrollment.user?._id)}
                                                className="text-[10px] font-bold text-[#001E80] hover:text-[#001E80]/70 uppercase tracking-tight flex items-center gap-1 transition-colors"
                                            >
                                                <FaBook /> Manage Plan
                                            </button>
                                            {enrollment.user?.username && (
                                                <Link to={`/u/${enrollment.user.username}`} className="text-[#001E80]/40 hover:text-[#001E80] transition-colors">
                                                    <FaExternalLinkAlt size={12} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleEndRelationship(enrollment.user?._id, 'partner')}
                                                className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tight transition-colors"
                                            >
                                                End Session
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">No active partnerships.</p>
                                <Link to="/partners" className="inline-block mt-4 text-sm font-bold text-[#001E80] hover:underline">
                                    Find Partners →
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    // ─── CONTRIBUTIONS TAB ──────────────────────────────
    if (activeTab === 'contributions') {
        const guidesCount = myThreads.filter(t => t.isCurated).length;
        const communityCount = myThreads.filter(t => !t.isCurated).length;

        return (
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        My Contributions
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Manage the guides and threads you've published to the community.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-center shadow-sm hover:border-[#001E80]/20 transition-all">
                        <p className="text-[#001E80]/40 text-[10px] font-black uppercase tracking-widest mb-1">Guides Created</p>
                        <p className="text-4xl font-black text-[#001E80]">{guidesCount}</p>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-center shadow-sm hover:border-[#001E80]/20 transition-all">
                        <p className="text-[#001E80]/40 text-[10px] font-black uppercase tracking-widest mb-1">Community Threads</p>
                        <p className="text-4xl font-black text-[#001E80]">{communityCount}</p>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <FaBook className="text-[#001E80]" /> Published Threads
                        </h3>
                    </div>

                    {loadingThreads ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                        </div>
                    ) : myThreads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-[#001E80]/40">
                                        <th className="py-4 px-6 md:w-1/2">Thread Title</th>
                                        <th className="py-4 px-6">Tags</th>
                                        <th className="py-4 px-6 text-center">Stats</th>
                                        <th className="py-4 px-6 text-right">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myThreads.map((thread) => (
                                        <tr
                                            key={thread._id}
                                            onClick={() => navigate(`/resources/thread/${thread._id}`)}
                                            className="border-b border-gray-50 hover:bg-[#EAEEFE]/20 cursor-pointer transition-colors group"
                                        >
                                            {/* Thread Title & Type */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {thread.isCurated ? (
                                                        <span className="px-2 py-0.5 bg-green-100 border border-green-200 text-green-700 rounded-md text-[9px] font-black uppercase tracking-widest">Guide</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-md text-[9px] font-black uppercase tracking-widest">Community</span>
                                                    )}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                        {new Date(thread.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-[#001E80] transition-colors">{thread.title}</h3>
                                            </td>

                                            {/* Tags Col */}
                                            <td className="py-5 px-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {thread.tags?.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-white border border-gray-200 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {thread.tags?.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                                            +{thread.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stats Col */}
                                            <td className="py-5 px-6 text-center">
                                                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <span className="flex flex-col"><span className="text-gray-900 text-xs mt-0.5">{thread.upvoteCount || 0}</span>Votes</span>
                                                    <span className="flex flex-col"><span className="text-gray-900 text-xs mt-0.5">{thread.postCount || 0}</span>Posts</span>
                                                </div>
                                            </td>

                                            {/* Action Col */}
                                            <td className="py-5 px-6 text-right">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center ml-auto group-hover:bg-[#001E80] group-hover:text-white transition-all shadow-sm">
                                                    <FaChevronRight size={12} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <p className="text-sm text-gray-500 mb-4">You haven't published any threads yet.</p>
                            <button
                                onClick={() => navigate('/resources')}
                                className="bg-[#001E80] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                            >
                                Browse Hub
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── PITCH QUESTIONS TAB ────────────────────────────
    if (activeTab === 'pitch-questions') {
        return (
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Pitch Questions
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Customize what partners answer when pitching to you</p>
                </div>

                <PitchQuestionsManager
                    user={currentUser}
                    initialQuestions={profile.pitchQuestions}
                    onUpdate={(newQs) => setProfile({ ...profile, pitchQuestions: newQs })}
                />
            </div>
        );
    }

    return null;
};

export default Dashboard;
