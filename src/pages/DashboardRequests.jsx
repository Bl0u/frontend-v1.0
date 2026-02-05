import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../features/requests/requestService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBell, FaCheck, FaTimes, FaGraduationCap, FaUserFriends, FaFileAlt, FaUser, FaEye, FaChalkboardTeacher } from 'react-icons/fa';

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
            // Show ALL items: mentorship, partnership, and notification types
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
            case 'mentorship':
                return <FaGraduationCap className="text-indigo-600" />;
            case 'partner':
            case 'partnership':
                return <FaUserFriends className="text-green-600" />;
            case 'notification':
                return <FaBell className="text-blue-600" />;
            default:
                return <FaBell className="text-gray-600" />;
        }
    };

    const getItemTitle = (item) => {
        switch (item.type) {
            case 'mentorship':
                return '🔔 Mentorship Request';
            case 'partner':
            case 'partnership':
                return '🤝 Partnership Request';
            case 'notification':
                return '📬 Notification';
            default:
                return 'Message';
        }
    };

    const isActionable = (item) => {
        return ['mentorship', 'partner', 'partnership'].includes(item.type) && item.status === 'pending';
    };

    const handleAction = async (id, status) => {
        try {
            await requestService.respondToRequest(id, status, user.token);
            setInboxItems(inboxItems.filter(item => item._id !== id));
            toast.success(`Request ${status} successfully`);
        } catch (error) {
            console.error(error);
            toast.error('Action failed');
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
        <div className="max-w-5xl mx-auto my-10 px-4">
            <div className="flex items-center gap-3 mb-8">
                <FaBell className="text-3xl text-indigo-600" />
                <h2 className="text-3xl font-black text-gray-900">Inbox</h2>
                {inboxItems.length > 0 && (
                    <span className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                        {inboxItems.length}
                    </span>
                )}
            </div>

            {inboxItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                    <FaBell className="text-6xl text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Your inbox is empty</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {inboxItems.map((item) => (
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
                                        {isActionable(item) && item.type === 'mentorship' && item.pitch && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPitch(item.pitch);
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
                                                    const threadId = item.message.split('|||THREAD:')[1];
                                                    navigate(`/resources/thread/${threadId}`);
                                                }}
                                                className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl transition-all font-medium text-xs"
                                            >
                                                <FaChalkboardTeacher /> View Thread
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
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-bold text-sm whitespace-nowrap"
                                        >
                                            <FaCheck /> Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
