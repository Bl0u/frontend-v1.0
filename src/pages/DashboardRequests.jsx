import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../features/requests/requestService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaInbox, FaHistory, FaCheck, FaTimes, FaTrash, FaHashtag, FaClock, FaCalendarAlt, FaStar, FaGlobe, FaUserCheck, FaChevronDown, FaChevronUp, FaInfoCircle, FaFileAlt, FaUserFriends, FaUser, FaEye, FaChalkboardTeacher, FaArrowLeft, FaRocket, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardRequests = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [inboxItems, setInboxItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPitchModal, setShowPitchModal] = useState(false);
    const [selectedPitch, setSelectedPitch] = useState(null);

    const fetchInbox = async () => {
        try {
            const data = await requestService.getReceivedRequests(user.token);
            setInboxItems(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch inbox');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchInbox();
    }, [user]);

    const getItemIcon = (type) => {
        switch (type) {
            case 'partner':
            case 'partnership':
                return <FaUserFriends className="text-green-600" />;
            case 'pitch_claim':
                return <FaRocket className="text-orange-600" />;
            case 'community_join':
                return <FaHashtag className="text-indigo-600" />;
            case 'notification':
                return <FaBell className="text-[#001E80]" />;
            default:
                return <FaBell className="text-gray-600" />;
        }
    };

    const getItemTitle = (item) => {
        switch (item.type) {
            case 'partner':
            case 'partnership':
                return '🤝 Partnership Request';
            case 'pitch_claim':
                return `🚀 Join Request - ${item.roleName || item.claimRole || 'Teammate'} `;
            case 'community_join':
                return `🏘️ Community Join Application - ${item.groupChat?.name || 'Group'} `;
            case 'notification':
                return '📬 Notification';
            default:
                return 'Message';
        }
    };

    const isActionable = (item) => {
        return ['partner', 'partnership', 'pitch_claim', 'community_join'].includes(item.type) && item.status === 'pending';
    };

    const handleAction = async (id, status) => {
        try {
            const item = inboxItems.find(i => i._id === id);

            if (item?.type === 'pitch_claim') {
                if (status === 'accepted') {
                    await requestService.approvePitchClaim(id, user.token);
                } else {
                    await requestService.rejectPitchClaim(id, user.token);
                }
            } else {
                await requestService.respondToRequest(id, status, user.token);
            }

            // After action, keep it in the list but mark it as resolved (status change)
            // Or just re-fetch for simplicity to show as "Mark as Read" style
            fetchInbox();
            toast.success(`Request ${status} successfully`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await requestService.markAsRead(id, user.token);
            setInboxItems(inboxItems.filter(item => item._id !== id));
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark as read');
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading inbox...</div>;

    return (
        <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#001E80]/60 hover:text-[#001E80] font-bold transition-colors">
                <FaArrowLeft /> Back to Dashboard
            </button>

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEEFE] to-white p-10 border border-[#001E80]/5">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[#001E80]/50 text-xs font-black uppercase tracking-widest mb-2">Notifications</p>
                        <h1
                            className="text-4xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            Mission Control
                        </h1>
                        <p className="text-[#010D3E]/60 font-medium text-sm mt-1">
                            Stay updated on your partnerships and activity.
                        </p>
                    </div>
                    {inboxItems.length > 0 && (
                        <div className="bg-[#001E80] text-white px-6 py-3 rounded-2xl font-black text-xl shadow-lg shadow-[#001E80]/20">
                            {inboxItems.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Unified Feed */}
            <div className="grid gap-4">
                {inboxItems.length > 0 ? (
                    inboxItems.map((item) => (
                        <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                    {getItemIcon(item.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">
                                            {getItemTitle(item)}
                                        </h4>
                                        {item.sender?.name && (
                                            <span className="text-xs text-gray-400">
                                                from {item.sender.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-base mt-2">
                                        {item.message?.includes('|||')
                                            ? item.message.split('|||')[0]
                                            : item.message}
                                    </p>
                                    {item.status === 'ongoing' && item.type === 'pitch_claim' && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                Mission Active
                                            </span>
                                        </div>
                                    )}
                                    {item.type === 'community_join' && item.answers && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2">Application Answers</div>
                                            {Object.entries(item.answers).map(([q, a]) => (
                                                <div key={q}>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase">{q}</div>
                                                    <div className="text-sm text-gray-700 font-medium">{a || <span className="italic text-gray-300">No answer provided</span>}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {item.createdAt && (
                                        <p className="text-gray-400 text-xs mt-2">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="shrink-0 flex flex-col gap-2">
                                    {/* View Profile/Pitch Buttons */}
                                    <div className="flex gap-2">
                                        {isActionable(item) && item.sender && (
                                            <button
                                                onClick={() => navigate(`/u/${item.sender.username}`)}
                                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaUser /> View Profile
                                            </button>
                                        )}
                                        {(isActionable(item) && item.type !== 'pitch_claim' && (item.pitch || (item.type === 'pitch_claim' && item.pitchRef?.pitch))) && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPitch(item.pitch || (item.type === 'pitch_claim' ? item.pitchRef?.pitch : null));
                                                    setShowPitchModal(true);
                                                }}
                                                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaEye /> View Pitch
                                            </button>
                                        )}
                                        {item.message?.includes('|||PLAN:') && (
                                            <button
                                                onClick={() => {
                                                    const planId = item.message.split('|||PLAN:')[1].trim();
                                                    navigate(`/plan/${planId}`);
                                                }}
                                                className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaFileAlt /> View Plan
                                            </button>
                                        )}
                                        {item.message?.includes('|||THREAD:') && (
                                            <button
                                                onClick={() => {
                                                    const threadId = item.message.split('|||THREAD:')[1].trim();
                                                    navigate(`/resources/thread/${threadId}`);
                                                }}
                                                className="flex items-center gap-2 bg-[#EAEEFE] hover:bg-[#EAEEFE]/80 text-[#001E80] px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaChalkboardTeacher /> View Thread
                                            </button>
                                        )}
                                        {item.message?.includes('|||PLAN:') && !item.message?.includes('MISSION START!') && (
                                            <button
                                                onClick={() => {
                                                    const planId = item.message.split('|||PLAN:')[1].trim();
                                                    navigate(`/plan/${planId}`);
                                                }}
                                                className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaFileAlt /> View Plan
                                            </button>
                                        )}
                                        {item.message?.includes('|||PROJECT_PLAN:') && (
                                            <button
                                                onClick={() => {
                                                    const projectId = item.message.split('|||PROJECT_PLAN:')[1].trim();
                                                    navigate(`/project-plan/${projectId}`);
                                                }}
                                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl transition-all font-bold text-xs shadow-md shadow-indigo-100"
                                            >
                                                <FaRocket /> Go to Mission Control
                                            </button>
                                        )}
                                    </div>

                                    {/* Main Action Buttons */}
                                    {isActionable(item) ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(item._id, 'accepted')}
                                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all font-bold text-sm"
                                            >
                                                <FaCheck /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleAction(item._id, 'rejected')}
                                                className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-bold text-sm"
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkAsRead(item._id)}
                                            className="flex items-center gap-2 bg-[#001E80] hover:bg-[#010D3E] text-white px-4 py-2 rounded-xl transition-all font-bold text-sm whitespace-nowrap"
                                        >
                                            <FaCheck /> Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 text-gray-300">
                            <FaBell />
                        </div>
                        <p className="text-gray-400 font-bold">Your inbox is currently clear.</p>
                        <p className="text-gray-300 text-xs mt-1">All mission updates and requests will appear here.</p>
                    </div>
                )}
            </div>

            {/* Pitch Modal */}
            {showPitchModal && selectedPitch && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPitchModal(false)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Project Pitch</h3>
                            <button onClick={() => setShowPitchModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(selectedPitch).map(([key, value]) => (
                                <div key={key} className="border-b border-gray-100 pb-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</p>
                                    <p className="text-gray-800">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardRequests;
