import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import { FaHistory, FaCheckCircle, FaExternalLinkAlt, FaUserFriends, FaBook } from 'react-icons/fa';
import requestService from '../features/requests/requestService';
import planService from '../features/plans/planService';
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

                {/* Partnership Archive */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <FaHistory className="text-[#001E80]/50" /> Archive
                        </h3>
                        <span className="bg-gray-50 px-3 py-1 rounded-full text-xs font-bold text-gray-400">
                            {completedCount}
                        </span>
                    </div>
                    <div className="p-6">
                        {completedCount > 0 ? (
                            <div className="space-y-3">
                                {profile.partnerHistory.slice().reverse().map((history, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-[#EAEEFE]/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#EAEEFE] rounded-xl flex items-center justify-center text-sm font-black text-[#001E80]">
                                                {history.partnerName?.charAt(0)}
                                            </div>
                                            <div>
                                                <Link to={`/u/${history.partnerUsername}`} className="font-bold text-gray-900 text-sm leading-tight hover:text-[#001E80] transition-colors">
                                                    {history.partnerName}
                                                </Link>
                                                <p className="text-xs text-gray-400 font-medium">@{history.partnerUsername}</p>
                                            </div>
                                        </div>
                                        <FaCheckCircle className="text-green-500" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-12 text-sm">No completed partnerships yet.</p>
                        )}
                    </div>
                </section>
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
