import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaRocket, FaHandHoldingHeart, FaUserGraduate, FaChevronDown, FaCheckCircle, FaPlus, FaUserFriends } from 'react-icons/fa';

const PitchHub = () => {
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

    const handleClaim = async (pitchId, role = 'teammate') => {
        if (!currentUser) {
            toast.error('Please login to claim a project pitch.');
            return;
        }

        try {
            const data = await requestService.claimPublicPitch(pitchId, currentUser.token, role);
            if (data.isPendingApproval) {
                toast.info('Join request sent to project owner for approval');
            } else {
                toast.success(`Successfully joined as ${role}! The sender has been notified.`);
            }
            fetchPitches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join mission');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEEFE] to-white border border-[#001E80]/5">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#001E80]/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#001E80]/3 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1
                            className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            Project Pitch Hub
                        </h1>
                        <p className="text-[#010D3E]/50 text-base font-medium mt-2 max-w-xl">
                            Where ambitious users pitch projects and collaborators pick their next monthly missions.
                        </p>
                    </div>
                    {currentUser && (
                        <Link
                            to="/pitch-form"
                            className="bg-[#001E80] hover:bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.97] flex-shrink-0"
                        >
                            <FaPlus /> Pitch Your Project
                        </Link>
                    )}
                </div>
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
                                    <div className="w-14 h-14 rounded-3xl bg-[#EAEEFE] border-2 border-white shadow-md flex items-center justify-center text-xl font-black text-[#001E80] shrink-0">
                                        {pitch.sender?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                {pitch.pitch?.Hook || pitch.pitch?.['The Hook (Short summary)'] || pitch.message}
                                            </h3>
                                            {pitch.isProBono && (
                                                <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-500 text-[9px] font-black uppercase tracking-wider border border-pink-100">Pro-Bono</span>
                                            )}
                                            {pitch.mentorNeeded && (
                                                <span className="px-2 py-0.5 rounded-md bg-[#EAEEFE] text-[#001E80] text-[9px] font-black uppercase tracking-wider border border-[#001E80]/10">Mentor Needed</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <FaUserGraduate className="text-[#001E80]/40" size={12} />
                                                {pitch.sender?.name} · {pitch.sender?.major || 'Member'}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#001E80]">
                                                <FaUserFriends size={10} className="opacity-50" />
                                                {pitch.contributors?.length || 0} / {pitch.teamSize} Teammates
                                                {pitch.mentorNeeded && (
                                                    <span className="opacity-50 ml-1">· {pitch.mentor ? '1/1 Mentor' : '0/1 Mentor'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setExpandedPitch(expandedPitch === pitch._id ? null : pitch._id)}
                                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#001E80] flex items-center gap-1 transition-colors"
                                    >
                                        View Detail <FaChevronDown className={`transition-transform duration-300 ${expandedPitch === pitch._id ? 'rotate-180' : ''}`} />
                                    </button>

                                    {currentUser && currentUser._id !== pitch.sender?._id && (
                                        <div className="flex gap-2">
                                            {/* Teammate Button */}
                                            {pitch.contributors?.length < pitch.teamSize && (
                                                <button
                                                    onClick={() => handleClaim(pitch._id, 'teammate')}
                                                    disabled={pitch.contributors?.some(c => c._id === currentUser._id)}
                                                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 text-[11px] uppercase tracking-wider ${pitch.contributors?.some(c => c._id === currentUser._id)
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                        : 'bg-green-500 hover:bg-green-600 text-white shadow-green-100'
                                                        }`}
                                                >
                                                    <FaHandHoldingHeart /> {pitch.contributors?.some(c => c._id === currentUser._id)
                                                        ? 'Joined'
                                                        : 'Request to Join'}
                                                </button>
                                            )}

                                            {/* Mentor Button */}
                                            {pitch.mentorNeeded && !pitch.mentor && (
                                                <button
                                                    onClick={() => handleClaim(pitch._id, 'mentor')}
                                                    className="bg-[#001E80] hover:bg-blue-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95 text-[11px] uppercase tracking-wider"
                                                >
                                                    🎓 Mentor Mission
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Staffing Progress Bar */}
                            <div className="px-6 pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {(pitch.contributors || []).slice(0, 5).map((contributor, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 shadow-sm overflow-hidden"
                                                    title={`Teammate: ${contributor.name}`}
                                                >
                                                    {contributor.avatar ? (
                                                        <img src={contributor.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white bg-[#001E80]">
                                                            {contributor.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {pitch.mentor && (
                                                <div
                                                    className="w-7 h-7 rounded-full border-2 border-[#001E80] bg-white shadow-md flex items-center justify-center text-xl overflow-hidden"
                                                    title="Mentor Joined"
                                                >
                                                    🎓
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black text-[#001E80]/40 uppercase tracking-widest">
                                            Staffing: {pitch.progress || 0}%
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {pitch.mentorNeeded && (
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight border ${pitch.mentor ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                {pitch.mentor ? 'Mentor Found' : 'Needs Mentor'}
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight border ${pitch.contributors?.length >= pitch.teamSize ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                            {pitch.contributors?.length >= pitch.teamSize ? 'Team Full' : `${pitch.teamSize - pitch.contributors.length} Teammates Needed`}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#001E80] to-indigo-400 transition-all duration-1000"
                                        style={{ width: `${pitch.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Card Detail (Expandable) */}
                            {expandedPitch === pitch._id && (
                                <div className="px-8 pb-8 pt-2 border-t border-gray-50 bg-gray-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                        {Object.entries(pitch.pitch || {}).map(([key, value]) => (
                                            key !== 'Hook' && (
                                                <div key={key} className="space-y-1.5">
                                                    <p className="text-xs font-black text-[#001E80] uppercase tracking-widest flex items-center gap-1">
                                                        <FaCheckCircle size={10} /> {key}
                                                    </p>
                                                    <p className="text-base text-gray-700 leading-relaxed font-medium">
                                                        {value}
                                                    </p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                                        <p className="text-sm text-gray-400 font-medium">Posted {new Date(pitch.createdAt).toLocaleDateString()}</p>
                                        <Link to={`/u/${pitch.sender?.username}`} className="text-sm font-bold text-[#001E80] hover:underline">
                                            View Profile →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EAEEFE] rounded-full mb-6">
                            <FaRocket size={32} className="text-[#001E80]/40" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">The hub is waiting for its next mission.</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">Be the first to pitch your project and attract a partner.</p>
                        {currentUser && (
                            <Link
                                to="/pitch-form"
                                className="mt-6 inline-flex bg-[#001E80] hover:bg-[#001E80]/85 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#001E80]/10"
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

export default PitchHub;
