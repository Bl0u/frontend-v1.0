import { useState, useEffect, useContext, useRef } from 'react';
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

    // Filter Handlers
    const handleApplyFilter = (type, value) => {
        setActiveFilters(prev => ({ ...prev, [type]: value }));
        setActiveFilterType(null);
    };

    const removeFilter = (type) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[type];
            return newFilters;
        });
    };

    const getDropdownOptions = (type) => {
        if (!uniqueTags || uniqueTags.length === 0) return [];
        if (type === 'University') {
            const uniRawNames = ['Cairo University', 'Ain Shams University', 'Helwan University', 'Alexandria University', 'Mansoura University', 'Assiut University', 'Tanta University', 'Zagazig University'];
            return uniRawNames.filter(u => uniqueTags.includes(`#${u.replace(/\s+/g, '')}`));
        }
        if (type === 'Professor') {
            return uniqueTags.filter(t => t.startsWith('#Prof')).map(t => t.replace('#Prof', ''));
        }
        if (type === 'Subject') {
            return uniqueTags.filter(t => t.startsWith('#Subj')).map(t => t.replace('#Subj', ''));
        }
        if (type === 'Company') {
            return uniqueTags.filter(t => t.startsWith('#Comp')).map(t => t.replace('#Comp', ''));
        }
        return [];
    };

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

                        {/* LinkedIn-Style Filter Bar */}
                        <div className="flex flex-wrap items-center gap-3" ref={filterContainerRef}>
                            <div className="flex items-center gap-2 text-[#001E80]/40 font-black text-[10px] uppercase tracking-widest mr-2 shrink-0">
                                Filters:
                            </div>

                            {/* Available Filter Buttons */}
                            {['University', 'Professor', 'Subject', 'Company'].map(filterId => {
                                if (activeFilters[filterId]) return null;

                                return (
                                    <div key={filterId} className="relative shrink-0">
                                        <button
                                            onClick={() => setActiveFilterType(activeFilterType === filterId ? null : filterId)}
                                            className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilterType === filterId ? 'bg-[#EAEEFE] border-[#001E80]/20 text-[#001E80]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            + {filterId}
                                        </button>

                                        {/* Dropdown Options */}
                                        {activeFilterType === filterId && (
                                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl z-20 animate-in slide-in-from-top-2 duration-200">
                                                <div className="max-h-48 overflow-y-auto p-1 scrollbar-hide">
                                                    {getDropdownOptions(filterId).length > 0 ? (
                                                        getDropdownOptions(filterId).map(option => (
                                                            <button
                                                                key={option}
                                                                onClick={() => handleApplyFilter(filterId, option)}
                                                                className="w-full text-left px-3 py-2 text-[11px] text-gray-700 hover:bg-[#EAEEFE] hover:text-[#001E80] rounded-lg font-bold transition-colors"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] text-center py-3 text-gray-400 font-bold uppercase tracking-widest">No tags found</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Active Filters */}
                            {Object.entries(activeFilters).map(([type, value]) => (
                                <div key={type} className="flex items-center gap-2 bg-[#001E80] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm animate-in zoom-in duration-200">
                                    <span className="opacity-70">{type}:</span>
                                    <span>{value}</span>
                                    <button onClick={() => removeFilter(type)} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                                </div>
                            ))}
                        </div>
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
