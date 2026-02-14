import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import { FaUserEdit, FaShareAlt, FaGraduationCap, FaChalkboardTeacher, FaHistory, FaCheckCircle, FaProjectDiagram, FaExternalLinkAlt, FaUserFriends, FaClipboardList, FaFileAlt, FaBook } from 'react-icons/fa';
import requestService from '../features/requests/requestService';
import planService from '../features/plans/planService';
import PitchQuestionsManager from '../components/PitchQuestionsManager';

const Dashboard = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mentorship'); // 'mentorship' or 'partnership'

    // History & Notes State
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [showPitchModal, setShowPitchModal] = useState(false);
    const [editingHistoryId, setEditingHistoryId] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [planTemplate, setPlanTemplate] = useState('');

    const fetchProfile = async () => {
        if (!currentUser) return; // Prevent fetch if logged out

        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser._id}`, config);
            setProfile(res.data);
            setPlanTemplate(res.data.planTemplate || '');
        } catch (error) {
            console.error('Error fetching dashboard data', error);
            // Only show error if user is still logged in
            if (currentUser) {
                toast.error('Failed to load dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPlan = async (targetUserId, userType) => {
        if (!currentUser) return;

        try {
            // Determine partnerId based on who we clicked and our role in that relationship
            // Actually getPlanByPair is smart, it takes the OTHER person's ID
            const plan = await planService.getPlanByPair(targetUserId, currentUser.token);
            navigate(`/plan/${plan._id}`);
        } catch (error) {
            console.log('Plan fetch error:', error.response?.data?.message || error.message);

            // If mentor clicking on mentee and no plan exists, offer to create one
            if (userType !== 'student' && isMentor) {
                try {
                    const newPlan = await planService.createPlan(
                        targetUserId,
                        {
                            title: 'Initial Mentorship Plan',
                            content: profile.planTemplate || `# Welcome!

This is your personalized mentorship roadmap. I will update this regularly with goals, milestones, and resources.`
                        },
                        currentUser.token
                    );
                    toast.success('Plan created successfully');
                    navigate(`/plan/${newPlan._id}`);
                } catch (createError) {
                    toast.error('Failed to create plan');
                    console.error(createError);
                }
            } else {
                // Better error messaging for students
                const errorMsg = error.response?.data?.message || error.message;
                if (error.response?.status === 404) {
                    toast.warning('Your mentor hasn\'t created a plan yet. They will set one up soon!');
                } else if (error.response?.status === 403) {
                    toast.error('Access denied to this plan');
                } else {
                    toast.error(`Failed to load plan: ${errorMsg}`);
                }
                console.error('Plan access error:', errorMsg);
            }
        }
    };

    const handleEndRelationship = async (targetUserId, type) => {
        const confirmMsg = type === 'mentorship'
            ? 'Are you sure you want to end this mentorship session?'
            : 'Are you sure you want to end this partnership?';

        if (!window.confirm(confirmMsg)) return;
        try {
            await requestService.endRelationship(targetUserId, type, currentUser.token);
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} completed! Great work.`);
            fetchProfile(); // Refresh data
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to end ${type}`);
        }
    };

    const handleSaveNote = async (historyId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.put(`${API_BASE_URL}/api/requests/history/note`, { historyId, notes: noteText }, config);
            toast.success('Note updated!');
            setEditingHistoryId(null);
            fetchProfile();
        } catch (error) {
            toast.error('Failed to save note');
        }
    };

    const handleSaveTemplate = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.put(`${API_BASE_URL}/api/users/profile`, { planTemplate }, config);
            toast.success('Mentorship Plan Template updated!');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to update plan template');
        }
    };

    const startEditingNote = (item) => {
        setEditingHistoryId(item._id);
        setNoteText(item.notes || '');
    };

    useEffect(() => {
        if (currentUser) fetchProfile();
    }, [currentUser]);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading your mission control...</div>;
    if (!profile) return <div className="text-center py-20">Profile not found.</div>;

    const isMentor = profile.role === 'mentor';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Pitch Modal */}
            {showPitchModal && selectedHistory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight">Project Pitch Answers</h2>
                                <p className="text-sm text-gray-500 font-medium">Mentorship with {selectedHistory.menteeName}</p>
                            </div>
                            <button onClick={() => setShowPitchModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-2 bg-white rounded-xl shadow-sm border border-gray-100 transition-all">✕</button>
                        </div>
                        <div className="p-8 space-y-6">
                            {selectedHistory.pitchAnswers ? Object.entries(selectedHistory.pitchAnswers).map(([key, val]) => (
                                <div key={key} className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{key.startsWith('q_') ? 'Question' : key}</h4>
                                    <div className="text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 text-sm leading-relaxed font-medium">
                                        {Array.isArray(val) ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {val.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        ) : val}
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-400 italic py-10">No pitch data available for this record.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Hero */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-4 border-white flex items-center justify-center text-4xl font-black text-indigo-300 shadow-sm">
                            {profile.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Welcome back, {profile.name}</h1>
                            <p className="text-gray-400 font-medium flex items-center gap-2">
                                {isMentor ? <FaChalkboardTeacher className="text-indigo-500" /> : <FaGraduationCap className="text-indigo-500" />}
                                {profile.role?.toUpperCase()} · {profile.major || profile.currentField}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/profile"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <FaUserEdit size={16} /> Mission Profile
                        </Link>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            </div>

            {/* Mini Navbar */}
            <div className="flex gap-4 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('mentorship')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'mentorship' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Mentorships
                </button>
                <button
                    onClick={() => setActiveTab('partnership')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'partnership' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Partnerships
                </button>
                {isMentor && (
                    <>
                        <button
                            onClick={() => setActiveTab('pitch-questions')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'pitch-questions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Pitch Questions
                        </button>
                        <button
                            onClick={() => setActiveTab('plan-template')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'plan-template' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Plan Template
                        </button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Track Record / History Section */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'mentorship' ? (
                        <>
                            {/* ENROLLMENT SECTION (Active Mentorships) */}
                            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
                                        {isMentor ? <FaChalkboardTeacher className="text-indigo-500" /> : <FaGraduationCap className="text-indigo-500" />}
                                        {isMentor ? 'Active Mentees' : 'My Mentors'}
                                    </h3>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                                        {(isMentor ? profile.enrolledMentees : profile.enrolledMentors)?.filter(m => m.status === 'active').length || 0} Current
                                    </span>
                                </div>
                                <div className="p-6">
                                    {(isMentor ? profile.enrolledMentees : profile.enrolledMentors)?.filter(m => m.status === 'active').length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(isMentor ? profile.enrolledMentees : profile.enrolledMentors).filter(m => m.status === 'active').map((enrollment, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                                                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg font-black text-gray-200">
                                                        {enrollment.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to={`/u/${enrollment.user?.username}`}
                                                            className="font-bold text-gray-900 leading-tight hover:text-indigo-600 transition-colors"
                                                        >
                                                            {enrollment.user?.name || 'Unknown User'}
                                                        </Link>
                                                        <p className="text-xs text-gray-400">{enrollment.user?.major || enrollment.user?.currentField || 'Member'}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 ml-auto">
                                                        {isMentor ? (
                                                            <button
                                                                onClick={() => handleOpenPlan(enrollment.user?._id)}
                                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter flex items-center gap-1"
                                                            >
                                                                <FaBook /> Plans & Progress
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenPlan(enrollment.user?._id, 'student')}
                                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter flex items-center gap-1"
                                                            >
                                                                <FaBook /> View Plan
                                                            </button>
                                                        )}
                                                        {enrollment.user?.username && (
                                                            <Link to={`/u/${enrollment.user.username}`} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                                                                <FaExternalLinkAlt size={14} />
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleEndRelationship(enrollment.user?._id, 'mentorship')}
                                                            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tighter"
                                                        >
                                                            End Session
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400 text-sm italic">No active mentorships found.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* MENTORSHIP TRACK RECORD / ARCHIVE */}
                            {isMentor ? (
                                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
                                            <FaHistory className="text-purple-500" /> Mentorship Track Record
                                        </h3>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                                            {profile.mentorshipHistory?.length || 0} Total
                                        </span>
                                    </div>
                                    <div className="p-8">
                                        <div className="space-y-6">
                                            {profile.mentorshipHistory?.length > 0 ? (
                                                profile.mentorshipHistory.slice().reverse().map((history, idx) => (
                                                    <div key={idx} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all group">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                                                    <FaProjectDiagram size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 leading-tight">{history.projectName || 'General Mentorship'}</p>
                                                                    <p className="text-xs text-gray-400 font-medium">
                                                                        Mentee: <Link to={`/u/${history.menteeUsername}`} className="text-indigo-600 hover:text-indigo-700 font-bold">{history.menteeName}</Link>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => { setSelectedHistory(history); setShowPitchModal(true); }}
                                                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-indigo-500 hover:border-indigo-500 transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    VIEW PITCH
                                                                </button>
                                                                <FaCheckCircle className="text-green-500" />
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mentor Guidance Notes</h5>
                                                                {editingHistoryId === history._id ? (
                                                                    <button onClick={() => handleSaveNote(history._id)} className="text-[10px] font-bold text-indigo-600">SAVE</button>
                                                                ) : (
                                                                    <button onClick={() => startEditingNote(history)} className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors">EDIT NOTES</button>
                                                                )}
                                                            </div>
                                                            {editingHistoryId === history._id ? (
                                                                <textarea
                                                                    className="w-full bg-white border border-indigo-100 rounded-2xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all min-h-[80px]"
                                                                    value={noteText}
                                                                    onChange={(e) => setNoteText(e.target.value)}
                                                                />
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic bg-gray-50/50 p-4 rounded-2xl border border-transparent">
                                                                    {history.notes || "No notes added yet."}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-400 py-6 font-medium italic">Track record is empty.</p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
                                            <FaHistory className="text-orange-500" /> My Learning Archive
                                        </h3>
                                    </div>
                                    <div className="p-8">
                                        <div className="space-y-4">
                                            {profile.enrolledMentors?.filter(m => m.status === 'completed').length > 0 ? (
                                                profile.enrolledMentors.filter(m => m.status === 'completed').map((enrollment, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-white transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg font-black text-gray-200">
                                                                {enrollment.user?.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <Link to={`/u/${enrollment.user?.username}`} className="font-bold text-gray-900 leading-tight hover:text-indigo-600 transition-colors">
                                                                    {enrollment.user?.name}
                                                                </Link>
                                                                <p className="text-xs text-gray-400 font-medium">{enrollment.user?.currentField || 'Mentor'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleOpenPlan(enrollment.user?._id, 'student')}
                                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter flex items-center gap-1"
                                                            >
                                                                <FaBook /> View Plan
                                                            </button>
                                                            <FaCheckCircle className="text-green-500" />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-400 py-10 italic font-medium">Archive is empty.</p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </>
                    ) : activeTab === 'partnership' ? (
                        <>
                            {/* PARTNERSHIP SECTION (Active) */}
                            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
                                        <FaUserFriends className="text-blue-500" /> Active Partnerships
                                    </h3>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                                        {profile.enrolledPartners?.filter(p => p.status === 'active').length || 0} Current
                                    </span>
                                </div>
                                <div className="p-6">
                                    {profile.enrolledPartners?.filter(p => p.status === 'active').length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profile.enrolledPartners.filter(p => p.status === 'active').map((enrollment, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                                                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg font-black text-gray-200 overflow-hidden">
                                                        {enrollment.user?.avatar ? <img src={enrollment.user.avatar} alt="" className="w-full h-full object-cover" /> : enrollment.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <Link to={`/u/${enrollment.user?.username}`} className="font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                                                            {enrollment.user?.name || 'Unknown User'}
                                                        </Link>
                                                        <p className="text-xs text-gray-400">Collaborator</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 ml-auto">
                                                        {enrollment.user?.username && (
                                                            <Link to={`/u/${enrollment.user.username}`} className="text-blue-400 hover:text-blue-600 transition-colors">
                                                                <FaExternalLinkAlt size={14} />
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleEndRelationship(enrollment.user?._id, 'partner')}
                                                            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tighter"
                                                        >
                                                            End Session
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400 text-sm italic">No active partnerships.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* PARTNERSHIP ARCHIVE */}
                            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
                                        <FaHistory className="text-blue-400" /> Partnership Archive
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-4">
                                        {profile.partnerHistory?.length > 0 ? (
                                            profile.partnerHistory.slice().reverse().map((history, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-white transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg font-black text-gray-200">
                                                            {history.partnerName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <Link to={`/u/${history.partnerUsername}`} className="font-bold text-gray-900 leading-tight hover:text-indigo-600 transition-colors">
                                                                {history.partnerName}
                                                            </Link>
                                                            <p className="text-xs text-gray-400 font-medium">@{history.partnerUsername}</p>
                                                        </div>
                                                    </div>
                                                    <FaCheckCircle className="text-green-500" />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-400 py-10 italic font-medium">No completed partnerships yet.</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : activeTab === 'pitch-questions' ? (
                        <PitchQuestionsManager
                            user={currentUser}
                            initialQuestions={profile.pitchQuestions}
                            onUpdate={(newQs) => setProfile({ ...profile, pitchQuestions: newQs })}
                        />
                    ) : activeTab === 'plan-template' ? (
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-extrabold text-gray-800 mb-2">Default Plan Template</h3>
                                <p className="text-sm text-gray-500">This template will be used when creating new mentorship plans. Supports Markdown formatting.</p>
                            </div>
                            <textarea
                                className="w-full h-96 p-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none font-mono text-sm resize-none"
                                placeholder="# Welcome!\n\nThis is your personalized mentorship roadmap..."
                                value={planTemplate}
                                onChange={(e) => setPlanTemplate(e.target.value)}
                            />
                            <button
                                onClick={handleSaveTemplate}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                            >
                                Save Template
                            </button>
                        </section>
                    ) : null}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-700 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
                        <h4 className="text-lg font-bold mb-6 opacity-80 uppercase tracking-widest text-[10px]">Impact Summary</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-4xl font-black">
                                    {isMentor
                                        ? profile.enrolledMentees?.filter(m => m.status === 'completed').length || 0
                                        : profile.enrolledMentors?.filter(m => m.status === 'completed').length || 0}
                                </p>
                                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mt-1">Missions Completed</p>
                            </div>
                            <div className="pt-6 border-t border-indigo-500/30">
                                <p className="text-4xl font-black">
                                    {(isMentor ? profile.enrolledMentees : profile.enrolledMentors)?.filter(m => m.status === 'active').length + (profile.enrolledPartners?.filter(p => p.status === 'active').length || 0)}
                                </p>
                                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mt-1">Active Engagements</p>
                            </div>
                        </div>
                    </div>

                    {/* Role Info Snippet */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-extrabold mb-4 text-gray-400 uppercase tracking-widest">Operation Status</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                <span className="text-xs font-bold text-gray-500 uppercase">Current Role</span>
                                <span className="text-xs font-black text-indigo-600 uppercase">{profile.role}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                <span className="text-xs font-bold text-gray-500 uppercase">Availability</span>
                                <span className="text-xs font-black text-green-500 uppercase">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
