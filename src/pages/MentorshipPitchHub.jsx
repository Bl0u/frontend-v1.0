import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaRocket, FaHandHoldingHeart, FaUserGraduate, FaChevronDown, FaCheckCircle, FaPlus } from 'react-icons/fa';

const MentorshipPitchHub = () => {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useContext(AuthContext);
    const [expandedPitch, setExpandedPitch] = useState(null);

    const fetchPitches = async () => {
        setLoading(true);
        try {
            const data = await requestService.getPublicPitches();
            setPitches(data);
        } catch (error) {
            console.error('Error fetching pitches', error);
            toast.error('Failed to load pitch feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPitches();
    }, []);

    const handleClaim = async (pitchId) => {
        if (!currentUser || currentUser.role !== 'mentor') {
            toast.error('Only mentors can claim project pitches for pro-bono help.');
            return;
        }

        try {
            await requestService.claimPublicPitch(pitchId, currentUser.token);
            toast.success('Successfully claimed! The student has been notified.');
            fetchPitches(); // Refresh feed
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to claim pitch');
        }
    };

    if (loading) return <div className="text-center py-20">Scanning project signals...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold mb-3">Mentorship Pitch Hub</h1>
                        <p className="text-indigo-100 text-lg max-w-xl">
                            Where ambitious students pitch projects and experts pick pro-bono monthly missions.
                        </p>
                    </div>
                    {currentUser?.role === 'student' && (
                        <Link
                            to="/request-mentorship"
                            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 active:scale-95"
                        >
                            <FaPlus /> Pitch Your Project
                        </Link>
                    )}
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            </div>

            {/* Pitch Feed */}
            <div className="space-y-6">
                {pitches.length > 0 ? (
                    pitches.map((pitch) => (
                        <div
                            key={pitch._id}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-3xl bg-indigo-50 border-2 border-white shadow-md flex items-center justify-center text-xl font-black text-indigo-300 shrink-0">
                                        {pitch.sender?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                            {pitch.pitch?.Hook || pitch.message}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <FaUserGraduate className="text-indigo-400" size={12} />
                                            {pitch.sender?.name} · {pitch.sender?.major}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setExpandedPitch(expandedPitch === pitch._id ? null : pitch._id)}
                                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                    >
                                        View Detail <FaChevronDown className={`transition-transform duration-300 ${expandedPitch === pitch._id ? 'rotate-180' : ''}`} />
                                    </button>
                                    {currentUser?.role === 'mentor' && (
                                        <button
                                            onClick={() => handleClaim(pitch._id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95 text-sm"
                                        >
                                            <FaHandHoldingHeart /> Claim Pro-Bono
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Detail (Expandable) */}
                            {expandedPitch === pitch._id && (
                                <div className="px-8 pb-8 pt-2 border-t border-gray-50 bg-gray-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                        {Object.entries(pitch.pitch || {}).map(([key, value]) => (
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
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                                        <p className="text-xs text-gray-400 font-medium">Posted {new Date(pitch.createdAt).toLocaleDateString()}</p>
                                        <Link to={`/u/${pitch.sender?.username}`} className="text-xs font-bold text-indigo-600 hover:underline">
                                            View Student Profile →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                            <FaRocket size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">The hub is waiting for its next mission.</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">Be the first student to pitch your project and attract an expert mentor.</p>
                        {currentUser?.role === 'student' && (
                            <Link
                                to="/request-mentorship"
                                className="mt-6 inline-flex bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg hover:bg-indigo-700"
                            >
                                Start Pitching
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorshipPitchHub;
