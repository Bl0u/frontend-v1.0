import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import { FaExternalLinkAlt, FaUserFriends, FaBook, FaChevronRight } from 'react-icons/fa';
import { FiZap } from 'react-icons/fi';
import requestService from '../features/requests/requestService';
import planService from '../features/plans/planService';
import resourceService from '../features/resources/resourceService';
import communityService from '../features/communities/communityService';
import { FilterBar } from '../components/FilterBar';

const SUGGESTION_LISTS = {
    University: [
        'Cairo University', 'Alexandria University', 'Ain Shams University', 'Assiut University', 'Mansoura University',
        'Zagazig University', 'Helwan University', 'Suez Canal University', '6th of October University',
        'Misr University for Science and Technology', 'German University in Cairo (GUC)', 'American University in Cairo (AUC)',
        'Al Alamein International University', 'Delta University for Science and Technology', 'British University in Egypt (BUE)'
    ]
};

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
    const [activityThreads, setActivityThreads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loadingThreads, setLoadingThreads] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);

    // Communities State
    const [myCommunities, setMyCommunities] = useState({ communities: [], groups: [] });
    const [moderatedContent, setModeratedContent] = useState({ communities: [], groups: [] });
    const [loadingCommunities, setLoadingCommunities] = useState(false);

    // Contributions Filters
    const [activeFilters, setActiveFilters] = useState({});
    const [activeFilterType, setActiveFilterType] = useState(null);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const filterContainerRef = useRef(null);

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

    const handleCompleteProject = async (projectId) => {
        if (!window.confirm('Mark this project as completed? This will move it to history for all members.')) return;
        try {
            await requestService.completeProject(projectId, currentUser.token);
            toast.success('Mission accomplished! Project marked as completed.');
            // Refresh projects
            const data = await requestService.getMyProjects(currentUser.token);
            setProjects(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to complete project');
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
                    let tagsParam = '';
                    const tagValues = Object.entries(activeFilters).map(([type, val]) => {
                        const cleanVal = val.replace(/\s+/g, '').replace(/ \(.*?\)/g, '');
                        if (type === 'Professor') return `Prof${cleanVal}`;
                        if (type === 'Subject') return `Subj${cleanVal}`;
                        if (type === 'Company') return `Comp${cleanVal}`;
                        return cleanVal;
                    });
                    if (tagValues.length > 0) {
                        tagsParam = tagValues.join(',');
                    }

                    const data = await resourceService.getThreads({
                        author: currentUser._id,
                        search: searchTerm,
                        tags: tagsParam
                    });
                    setMyThreads(data);
                } catch (error) {
                    toast.error('Failed to load contributions');
                } finally {
                    setLoadingThreads(false);
                }
            };

            // Debounce search
            const delayDebounceFn = setTimeout(() => {
                fetchMyThreads();
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [activeTab, currentUser, searchTerm, activeFilters]);

    // Fetch Activity Threads (Moderate, Paid, Pinned)
    useEffect(() => {
        const activityTabs = ['moderate', 'paid', 'pinned'];
        if (activityTabs.includes(activeTab) && currentUser) {
            const fetchActivity = async () => {
                setLoadingThreads(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                    const res = await axios.get(`${API_BASE_URL}/api/resources/activity?type=${activeTab}`, config);
                    setActivityThreads(res.data);
                } catch (error) {
                    toast.error(`Failed to load ${activeTab} threads`);
                } finally {
                    setLoadingThreads(false);
                }
            };
            fetchActivity();
        }
    }, [activeTab, currentUser]);

    // Fetch Projects
    useEffect(() => {
        if ((activeTab === 'home' || activeTab === 'projects') && currentUser) {
            const fetchProjects = async () => {
                setLoadingProjects(true);
                try {
                    const data = await requestService.getMyProjects(currentUser.token);
                    setProjects(data);
                } catch (error) {
                    toast.error('Failed to load projects');
                } finally {
                    setLoadingProjects(false);
                }
            };
            fetchProjects();
        }
    }, [activeTab, currentUser]);

    // Fetch Communities
    useEffect(() => {
        if (activeTab === 'communities' && currentUser) {
            const fetchCommunitiesData = async () => {
                setLoadingCommunities(true);
                try {
                    const [joined, moderated] = await Promise.all([
                        communityService.getJoinedContent(currentUser.token),
                        communityService.getModeratedContent(currentUser.token)
                    ]);
                    setMyCommunities(joined);
                    setModeratedContent(moderated);
                } catch (error) {
                    toast.error('Failed to load communities');
                } finally {
                    setLoadingCommunities(false);
                }
            };
            fetchCommunitiesData();
        }
    }, [activeTab, currentUser]);

    // Fetch Unique Tags for Filters
    useEffect(() => {
        if (activeTab === 'contributions') {
            const fetchTags = async () => {
                try {
                    const tags = await resourceService.getUniqueTags();
                    setUniqueTags(tags);
                } catch (error) {
                    console.error("Failed to load unique tags", error);
                }
            };
            fetchTags();
        }
    }, [activeTab]);

    const dynamicSuggestions = {
        University: (SUGGESTION_LISTS.University || []).filter(u => uniqueTags.includes(`#${u.replace(/\s+/g, '')}`)),
        Professor: uniqueTags.filter(t => t.startsWith('#Prof')).map(t => t.replace('#Prof', '')),
        Subject: uniqueTags.filter(t => t.startsWith('#Subj')).map(t => t.replace('#Subj', '')),
        Company: uniqueTags.filter(t => t.startsWith('#Comp')).map(t => t.replace('#Comp', '')),
        Position: uniqueTags.filter(t => !t.startsWith('#Subj') && !t.startsWith('#Comp') && !t.startsWith('#Prof') && t.startsWith('#') && t !== '#Interview').map(t => t.replace('#', ''))
    };

    // Filter Handlers

    // Close Dropdown Outside Click
    useEffect(() => {
        if (activeTab === 'contributions') {
            const handleClickOutside = (event) => {
                if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                    setActiveFilterType(null);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeTab]);

    const handleDeleteThread = async (e, threadId) => {
        e.stopPropagation();
        if (!window.confirm('Delete this published thread permanently?')) return;
        try {
            await resourceService.deleteThread(threadId, currentUser.token);
            toast.success('Thread Deleted');
            setMyThreads(myThreads.filter(t => t._id !== threadId));
        } catch (error) {
            toast.error('Failed to delete thread');
        }
    };

    const handleLeaveGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to leave this circle?')) return;
        try {
            await communityService.leaveGroup(groupId, currentUser.token);
            toast.success('You have left the circle');
            // Refresh joined data
            const joined = await communityService.getJoinedContent(currentUser.token);
            setMyCommunities(joined);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to leave circle');
        }
    };

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

                {/* Stats Row 1: Partnerships */}
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

                {/* Stats Row 2: Contributions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Threads Created</p>
                        <p className="text-4xl font-black text-[#001E80]">{profile.stats?.threadsCreated || 0}</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            <span className="text-indigo-600 font-bold">{profile.stats?.guidesCreated || 0}</span> Guides · <span className="text-indigo-600 font-bold">{profile.stats?.communityThreads || 0}</span> Posts
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Total Comments</p>
                        <p className="text-4xl font-black text-[#001E80]">{profile.stats?.commentsMade || 0}</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Interaction across all missions</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Level Rank</p>
                            <p className="text-2xl font-black text-[#001E80]">Contributor</p>
                        </div>
                        <div className="w-12 h-12 bg-[#EAEEFE] rounded-xl flex items-center justify-center text-[#001E80]">
                            <FaBook className="text-xl" />
                        </div>
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

                {/* Active Projects (Home Tab) */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <FiZap className="text-[#001E80]" /> Active Missions
                        </h3>
                        <span className="bg-[#EAEEFE] px-3 py-1 rounded-full text-xs font-bold text-[#001E80]">
                            {projects.filter(p => p.status !== 'completed').length}
                        </span>
                    </div>
                    <div className="p-6">
                        {loadingProjects ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-5 h-5 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                            </div>
                        ) : projects.filter(p => p.status !== 'completed').length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.filter(p => p.status !== 'completed').map((project, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#001E80]/10 hover:bg-[#EAEEFE]/30 transition-all">
                                        <div className="w-12 h-12 bg-[#EAEEFE] rounded-xl flex items-center justify-center overflow-hidden">
                                            <FiZap size={20} className="text-[#001E80]/40" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 leading-tight truncate">
                                                {project.pitch?.Hook || project.pitch?.['The Hook (Short summary)'] || "Untitled Mission"}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                {project.sender?._id === currentUser._id ? 'Mission Lead' : 'Teammate'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/project-plan/${project._id}`)}
                                                className="p-2 text-[#001E80]/40 hover:text-[#001E80] transition-colors"
                                                title="View Roadmap"
                                            >
                                                <FaBook size={14} />
                                            </button>
                                            {project.sender?._id === currentUser._id && (
                                                <button
                                                    onClick={() => handleCompleteProject(project._id)}
                                                    className="p-2 text-green-400 hover:text-green-600 transition-colors"
                                                    title="Mark Completed"
                                                >
                                                    <FiZap size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">No active missions running.</p>
                                <Link to="/pitch-hub" className="inline-block mt-4 text-sm font-bold text-[#001E80] hover:underline">
                                    Browse Hub →
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

                {/* Completed Partnerships */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h3 className="text-lg font-bold text-gray-400 flex items-center gap-3">
                            <FaUserFriends /> Completed
                        </h3>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-400">
                            {profile.partnerHistory?.length || 0}
                        </span>
                    </div>
                    <div className="p-6">
                        {profile.partnerHistory?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {profile.partnerHistory.map((history, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                                            {history.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-600 text-xs truncate">{history.user?.name}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(history.endedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-300 text-xs italic">No partnership history yet.</p>
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

                {/* Filter and Table View */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="px-8 py-6 border-b border-gray-50 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                                <FaBook className="text-[#001E80]" /> Published Threads
                            </h3>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search your threads..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#001E80]/10 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <FilterBar
                            activeFilters={activeFilters}
                            onFilterChange={setActiveFilters}
                            suggestionLists={dynamicSuggestions}
                        />
                    </div>

                    {loadingThreads ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                        </div>
                    ) : myThreads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-[#001E80]/40">
                                        <th className="py-3 px-6 w-1/3">Thread</th>
                                        <th className="py-3 px-6">Required Skills & Tags</th>
                                        <th className="py-3 px-6 text-center w-24">Stats</th>
                                        <th className="py-3 px-6 text-right w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {myThreads.map((thread) => (
                                        <tr
                                            key={thread._id}
                                            onClick={() => navigate(`/resources/thread/${thread._id}`)}
                                            className="border-b border-gray-50 hover:bg-[#EAEEFE]/20 cursor-pointer transition-colors group"
                                        >
                                            <td className="py-4 px-6 relative">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-[#001E80] transition-colors pr-4">{thread.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(thread.createdAt).toLocaleDateString()}</span>
                                                            {thread.isCurated && (
                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase tracking-widest leading-none">Verified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 relative">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {thread.tags?.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-white border border-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                            {tag.replace(/^#(Subj|Comp|Prof)/, '#')}
                                                        </span>
                                                    ))}
                                                    {thread.tags?.length > 3 && (
                                                        <div className="relative group/tags">
                                                            <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider cursor-help">
                                                                +{thread.tags.length - 3}
                                                            </span>
                                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tags:flex flex-wrap gap-1 bg-gray-900 border border-gray-800 p-2 rounded-lg w-48 shadow-xl z-10">
                                                                {thread.tags.slice(3).map((tag, idx) => (
                                                                    <span key={idx} className="px-2 py-1 bg-white/10 text-white rounded text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                                        {tag.replace(/^#(Subj|Comp|Prof)/, '#')}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <span className="flex items-center gap-1 font-bold text-xs" title="Upvotes">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                        {thread.upvoteCount || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-bold text-xs" title="Posts">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                        {thread.postCount || 0}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => handleDeleteThread(e, thread._id)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-300 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete Thread"
                                                    >
                                                        ✕
                                                    </button>
                                                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-[#001E80] group-hover:bg-[#001E80] transition-colors">
                                                        <FaChevronRight size={10} className="text-gray-300 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 bg-gray-50/30">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">No published threads found.</p>
                            <button
                                onClick={() => navigate('/resources')}
                                className="bg-[#001E80] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md hover:bg-[#010D3E]"
                            >
                                Browse Hub
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }



    // ─── PROJECTS TAB ───────────────────────────────────
    if (activeTab === 'projects') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        My Projects
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Track your active missions and graduation milestones.</p>
                </div>

                {loadingProjects ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Current Missions */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Current Missions</h2>
                                <span className="bg-[#EAEEFE] px-3 py-1 rounded-full text-[10px] font-black text-[#001E80] uppercase tracking-widest">
                                    Active: {projects.filter(p => p.status !== 'completed').length}
                                </span>
                            </div>

                            {projects.filter(p => p.status !== 'completed').length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.filter(p => p.status !== 'completed').map((project) => (
                                        <div key={project._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
                                            <div className="p-6 flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                                            In Recruitment
                                                        </span>
                                                        {project.isProBono && (
                                                            <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-500 text-[8px] font-black uppercase tracking-wider border border-pink-100">Pro-Bono</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] font-black text-[#001E80]/40 uppercase tracking-widest">
                                                        Role: {project.sender?._id === currentUser._id ? 'Mission Lead' : (project.mentor?._id === currentUser._id ? 'Mentor' : 'Teammate')}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                                    {project.pitch?.Hook || project.pitch?.['The Hook (Short summary)'] || "Untitled Mission"}
                                                </h3>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="text-[9px] font-black text-[#001E80]/40 uppercase tracking-widest">Staffing Progress</span>
                                                            <span className="text-[10px] font-black text-[#001E80]">{project.progress || 0}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#001E80] to-indigo-400 transition-all duration-1000"
                                                                style={{ width: `${project.progress || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-2">
                                                            {[project.sender, ...(project.contributors || [])].slice(0, 5).map((member, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 shadow-sm overflow-hidden"
                                                                    title={member?.name}
                                                                >
                                                                    {member?.avatar ? (
                                                                        <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white bg-[#001E80]">
                                                                            {member?.name?.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            {1 + (project.contributors?.length || 0)} Members
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => navigate(`/project-plan/${project._id}`)}
                                                        className="text-[10px] font-black text-[#001E80] uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all"
                                                    >
                                                        <FaBook size={12} /> Access Roadmap →
                                                    </button>
                                                    {project.sender?._id === currentUser._id && (
                                                        <button
                                                            onClick={() => handleCompleteProject(project._id)}
                                                            className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-green-700 transition-all"
                                                        >
                                                            <FiZap size={12} /> Mark Completed
                                                        </button>
                                                    )}
                                                </div>
                                                <Link
                                                    to="/chat"
                                                    className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#001E80] transition-colors"
                                                >
                                                    Team Chat
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                                    <p className="text-gray-400 text-sm font-medium">No active missions found.</p>
                                </div>
                            )}
                        </section>

                        {/* Completed Missions */}
                        {projects.filter(p => p.status === 'completed').length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-400">Completed Missions</h2>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Finished: {projects.filter(p => p.status === 'completed').length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.filter(p => p.status === 'completed').map((project) => (
                                        <div key={project._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden opacity-70 hover:opacity-100 transition-opacity flex flex-col">
                                            <div className="p-6 flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                                                        Completed
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400">
                                                        {new Date(project.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-700 mb-2 leading-tight">
                                                    {project.pitch?.Hook || project.pitch?.['The Hook (Short summary)'] || "Untitled Mission"}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium">Fully staffed and transitioned to active project.</p>
                                            </div>
                                            <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100">
                                                <button
                                                    onClick={() => navigate(`/project-plan/${project._id}`)}
                                                    className="text-[9px] font-black text-[#001E80]/60 uppercase tracking-widest hover:text-[#001E80]"
                                                >
                                                    View Final Roadmap
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── COMMUNITIES TAB ──────────────────────────────
    if (activeTab === 'communities') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1" style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}>My Communities</h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Hubs you have joined across the platform.</p>
                </div>
                
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
                    {loadingCommunities ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div></div>
                    ) : myCommunities.communities?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myCommunities.communities.map((comm) => (
                                <Link key={comm._id} to={`/community-hub?comm=${comm._id}`} className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-[#EAEEFE]/30 hover:border-[#001E80]/10 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#001E80]">
                                            <FaUserFriends size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 group-hover:text-[#001E80] transition-colors">{comm.name}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Hub</p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-300 group-hover:text-[#001E80]" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">You haven't joined any communities yet.</p>
                            <Link to="/community-hub" className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-[#001E80] hover:underline">Explore Hubs →</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── GROUPS TAB ────────────────────────────────────
    if (activeTab === 'groups') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1" style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}>My Circles</h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Specialized circles and group chats you are enrolled in.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {loadingCommunities ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div></div>
                    ) : myCommunities.groups?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="py-4 px-6">Circle Name</th>
                                    <th className="py-4 px-6">Type</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myCommunities.groups.map((group) => (
                                    <tr key={group._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="font-bold text-gray-800">{group.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{group.privacyType}</div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                                {group.groupType || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => navigate(`/chat?u=${group._id}&type=group`)}
                                                    className="bg-[#001E80] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#010D3E] transition-all"
                                                >
                                                    Enter Chat
                                                </button>
                                                <button 
                                                    onClick={() => handleLeaveGroup(group._id)}
                                                    className="bg-red-50 text-red-500 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Leave
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-sm">No circles joined yet.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── MODERATE TAB ──────────────────────────────────
    if (activeTab === 'comm-moderate') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1" style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}>Moderate Content</h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Communities and Circles where you hold moderator privileges.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
                    {loadingCommunities ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div></div>
                    ) : (moderatedContent.communities?.length > 0 || moderatedContent.groups?.length > 0) ? (
                        <div className="space-y-8">
                            {moderatedContent.communities?.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-4">Communities</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {moderatedContent.communities.map(comm => (
                                            <Link key={comm._id} to={`/admin?tab=communities`} className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-indigo-50/50 flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400">
                                                        <FaUserFriends />
                                                    </div>
                                                    <span className="font-bold text-gray-800">{comm.name}</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-indigo-500">Manage Hub</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {moderatedContent.groups?.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-4">Circles</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {moderatedContent.groups.map(group => (
                                            <div key={group._id} className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400">
                                                        <FaUserFriends size={16} />
                                                    </div>
                                                    <span className="font-bold text-gray-800">{group.name}</span>
                                                </div>
                                                <button 
                                                    onClick={() => navigate(`/admin?tab=communities`)}
                                                    className="text-[9px] font-black uppercase text-indigo-500 hover:underline"
                                                >
                                                    Manage in Dashboard
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">You are not a moderator in any community yet.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── ACTIVITY TABS (Moderate, Paid, Pinned) ───
    if (['moderate', 'paid', 'pinned'].includes(activeTab)) {
        const titleMap = {
            'moderate': 'Moderate Threads',
            'paid': 'Paid Threads',
            'pinned': 'Pinned Threads'
        };
        const descriptionMap = {
            'moderate': 'Threads you have been assigned to moderate.',
            'paid': 'Premium threads you have purchased access to.',
            'pinned': 'Threads you have bookmarked for quick access.'
        };

        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 cursor-default"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        {titleMap[activeTab]}
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1 cursor-default">
                        {descriptionMap[activeTab]}
                    </p>
                </div>

                {/* Filter and Table View */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="px-8 py-6 border-b border-gray-50 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                                <FaBook className="text-[#001E80]" /> Activity Threads
                            </h3>
                        </div>
                    </div>

                    {loadingThreads ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                        </div>
                    ) : activityThreads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-[#001E80]/40">
                                        <th className="py-3 px-6 w-1/3">Thread</th>
                                        <th className="py-3 px-6">Author & Tags</th>
                                        <th className="py-3 px-6 text-center w-24">Stats</th>
                                        <th className="py-3 px-6 text-right w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {activityThreads.map((thread) => (
                                        <tr
                                            key={thread._id}
                                            onClick={() => navigate(`/resources/thread/${thread._id}`)}
                                            className="border-b border-gray-50 hover:bg-[#EAEEFE]/20 cursor-pointer transition-colors group"
                                        >
                                            <td className="py-4 px-6 relative">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-[#001E80] transition-colors pr-4">{thread.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(thread.createdAt).toLocaleDateString()}</span>
                                                            {thread.isCurated && (
                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase tracking-widest leading-none">Verified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 relative">
                                                <div className="block text-xs font-bold text-gray-700 mb-1">
                                                    @{(thread.author && thread.author.username) ? thread.author.username : 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {thread.tags?.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-white border border-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                            {tag.replace(/^#(Subj|Comp|Prof)/, '#')}
                                                        </span>
                                                    ))}
                                                    {thread.tags?.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider">
                                                            +{thread.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                                    <span className="flex items-center gap-1 font-bold text-xs" title="Upvotes">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                        {thread.upvoteCount || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-bold text-xs" title="Posts">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                        {thread.postCount || 0}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-[#001E80] group-hover:bg-[#001E80] transition-colors">
                                                        <FaChevronRight size={10} className="text-gray-300 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 bg-gray-50/30">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">No threads found for {titleMap[activeTab]}.</p>
                            <button
                                onClick={() => navigate('/resources')}
                                className="bg-[#001E80] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md hover:bg-[#010D3E]"
                            >
                                Browse Hub
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default Dashboard;
