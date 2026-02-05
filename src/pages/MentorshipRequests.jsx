import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaChevronDown, FaCheckCircle, FaProjectDiagram, FaCalendarAlt } from 'react-icons/fa';

const MentorshipRequests = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRequest, setExpandedRequest] = useState(null);

    const fetchRequests = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await requestService.getReceivedRequests(currentUser.token);
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests', error);
            toast.error('Failed to load mentorship requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentUser]);

    const handleRespond = async (requestId, status) => {
        try {
            await requestService.respondToRequest(requestId, status, currentUser.token);
            toast.success(`Request ${status} successfully`);
            fetchRequests(); // Refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update request');
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading your mentorship missions...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Mentorship Inbox</h1>
                    <p className="text-gray-500">Manage incoming project pitches and growth missions.</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                    <span className="text-indigo-600 font-bold text-sm">{requests.length} Requests</span>
                </div>
            </div>

            {requests.length > 0 ? (
                <div className="space-y-6">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className={`bg-white rounded-3xl border transition-all ${req.status === 'pending' ? 'border-indigo-100 shadow-xl shadow-indigo-50/50' : 'border-gray-100 shadow-sm opacity-80'}`}
                        >
                            {/* Header */}
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 border-2 border-white shadow-md flex items-center justify-center text-2xl font-black text-indigo-300">
                                        {req.sender?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {req.status}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {req.pitch?.Hook || req.message}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                                            <span className="text-indigo-600 font-bold">{req.sender?.name}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{req.sender?.major} ({req.sender?.academicLevel})</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpandedRequest(expandedRequest === req._id ? null : req._id)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                        title="Toggle Details"
                                    >
                                        <FaChevronDown className={`transition-transform duration-300 ${expandedRequest === req._id ? 'rotate-180' : ''}`} />
                                    </button>
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleRespond(req._id, 'rejected')}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleRespond(req._id, 'accepted')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                            >
                                                Accept Mission
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Pitch Details (Structured) */}
                            {expandedRequest === req._id && (
                                <div className="px-8 pb-8 pt-2 border-t border-gray-50 bg-gray-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-4">
                                        {req.pitch && Object.entries(req.pitch).map(([key, value]) => (
                                            key !== 'Hook' && (
                                                <div key={key} className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                                        <FaCheckCircle size={10} /> {key}
                                                    </p>
                                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                        {value}
                                                    </p>
                                                </div>
                                            )
                                        ))}
                                        {!req.pitch && req.message && (
                                            <div className="col-span-2 space-y-1.5">
                                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Message</p>
                                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{req.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-gray-200/50 flex flex-wrap gap-6 text-xs text-gray-400 font-bold">
                                        <div className="flex items-center gap-1.5">
                                            <FaCalendarAlt /> Submitted {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaProjectDiagram /> Mentorship Track
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border shadow-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
                        <FaProjectDiagram size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">Your mentorship inbox is empty.</h3>
                    <p className="text-gray-400 text-sm">New project pitches will appear here when students request your guidance.</p>
                </div>
            )}
        </div>
    );
};

export default MentorshipRequests;
