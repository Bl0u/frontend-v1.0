import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLinkedin, FaGithub, FaGlobe, FaStar, FaTwitter, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/users/u/${username}`);
                setProfile(res.data);
                const userId = res.data._id;

                const reviewsRes = await axios.get(`${API_BASE_URL}/api/reviews/${userId}`);
                setReviews(reviewsRes.data);

                if (currentUser && currentUser._id !== userId) {
                    const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                    const connRes = await axios.get(`${API_BASE_URL}/api/requests/check/${userId}`, config);
                    setIsConnected(connRes.data.isConnected);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(true);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [username]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            const payload = {
                recipientId: profile._id,
                type: 'partner',
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment
            };
            const res = await axios.post(`${API_BASE_URL}/api/reviews`, payload, config);
            setReviews([res.data, ...reviews]);
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
            toast.success('Review submitted!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );
    if (error || !profile) return (
        <div className="text-center py-32">
            <p className="text-gray-400 text-lg font-medium">User not found</p>
        </div>
    );

    // ─── Helper: Info pill ────────────────────────────
    const InfoPill = ({ label, value }) => value ? (
        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="text-base font-medium text-gray-800 break-words leading-relaxed">{value}</span>
        </div>
    ) : null;

    // ─── Helper: Tag list ─────────────────────────────
    const TagList = ({ items, color = 'bg-[#EAEEFE] text-[#001E80]' }) => (
        <div className="flex flex-wrap gap-2">
            {items?.map((item, i) => (
                <span key={i} className={`${color} px-3 py-1.5 rounded-xl text-sm font-bold`}>{item}</span>
            ))}
        </div>
    );

    const completedPartnerships = profile.partnerHistory?.length || 0;
    const activePartnerships = profile.enrolledPartners?.filter(p => p.status === 'active').length || 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* ─── Hero Banner ──────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEEFE] to-white border border-[#001E80]/5">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#001E80]/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#001E80]/3 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                <div className="relative z-10 p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#001E80] to-[#010D3E] flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-[#001E80]/15 flex-shrink-0">
                            {profile.avatar && profile.avatar !== 'https://via.placeholder.com/150'
                                ? <img src={profile.avatar} alt="" className="w-full h-full rounded-3xl object-cover" />
                                : profile.name?.charAt(0)
                            }
                        </div>

                        {/* Name + Meta */}
                        <div className="flex-1 min-w-0">
                            <h1
                                className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                                style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                            >
                                {profile.name}
                            </h1>
                            <p className="text-[#010D3E]/40 font-medium text-base mt-0.5">@{profile.username}</p>
                            {profile.bio && (
                                <p className="text-[#010D3E]/70 text-base mt-2 max-w-lg leading-relaxed">{profile.bio}</p>
                            )}
                        </div>

                        {/* Badges + Actions */}
                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                            <span className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#001E80]/10 text-[#001E80]">
                                Partner
                            </span>
                            {profile.lookingForPartner && (
                                <span className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                                    Open for Collaboration
                                </span>
                            )}
                            {currentUser && currentUser._id !== profile._id && (
                                <button
                                    onClick={() => navigate(`/chat?u=${profile._id}`)}
                                    className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#001E80] text-white hover:bg-[#001E80]/85 shadow-lg shadow-[#001E80]/10 transition-all active:scale-[0.97] flex items-center gap-2"
                                >
                                    <FaEnvelope size={11} /> Message
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#001E80]/5">
                        {profile.university && (
                            <div className="flex items-center gap-2 text-base text-[#010D3E]/60">
                                <FaMapMarkerAlt className="text-[#001E80]/40" size={13} />
                                <span className="font-medium">{profile.university}</span>
                            </div>
                        )}
                        {profile.major && (
                            <div className="flex items-center gap-2 text-sm text-[#010D3E]/60">
                                <span className="font-medium">{profile.major}</span>
                                {profile.academicLevel && <span className="text-[#010D3E]/30">· {profile.academicLevel}</span>}
                            </div>
                        )}
                        {profile.timezone && (
                            <div className="flex items-center gap-2 text-base text-[#010D3E]/40">
                                🕐 {profile.timezone}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Social Links Bar ─────────────────────── */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {profile.socialLinks.map((link, idx) => {
                        const icon = link.platform === 'LinkedIn' ? <FaLinkedin /> :
                            link.platform === 'GitHub' ? <FaGithub /> :
                                link.platform === 'Twitter' ? <FaTwitter /> : <FaGlobe />;
                        return (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 text-base font-bold text-[#001E80] hover:bg-[#EAEEFE]/50 hover:border-[#001E80]/10 transition-all"
                            >
                                {icon} {link.platform}
                                <FaExternalLinkAlt size={10} className="text-[#001E80]/30" />
                            </a>
                        );
                    })}
                </div>
            )}

            {/* ─── Info Grid ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Partner Needs */}
                {(profile.matchingGoal || profile.partnerType || profile.topics?.length > 0 || profile.neededFromPartner) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80]">Partner Needs</h3>
                        <InfoPill label="Goal" value={profile.matchingGoal} />
                        <InfoPill label="Type" value={profile.partnerType === 'peer' ? 'Peer Study' : profile.partnerType === 'project teammate' ? 'Project Teammate' : profile.partnerType} />
                        {profile.topics?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Topics</span>
                                <TagList items={profile.topics} color="bg-white text-[#001E80] shadow-sm border border-gray-100" />
                            </div>
                        )}
                        {profile.neededFromPartner && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Looking For</span>
                                <span className="text-base font-medium text-gray-800 break-words leading-relaxed">{profile.neededFromPartner}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Logistics */}
                {(profile.studyMode || profile.languages?.length > 0 || profile.preferredTools?.length > 0) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80]">Logistics</h3>
                        <InfoPill label="Mode" value={profile.studyMode} />
                        {profile.languages?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Languages</span>
                                <TagList items={profile.languages} color="bg-white text-gray-700 shadow-sm border border-gray-100" />
                            </div>
                        )}
                        {profile.preferredTools?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Communication Tools</span>
                                <TagList items={profile.preferredTools} color="bg-white text-gray-700 shadow-sm border border-gray-100" />
                            </div>
                        )}
                    </div>
                )}

                {/* Availability & Commitment */}
                {(profile.availability?.days?.length > 0 || profile.availability?.timeRanges?.length > 0 || profile.commitmentLevel) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80]">Availability</h3>
                        {profile.availability?.days?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Days</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {profile.availability.days.map((day, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-[#001E80] text-white">
                                            {day.slice(0, 3)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {profile.availability?.timeRanges?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Ranges</span>
                                <TagList items={profile.availability.timeRanges} color="bg-white text-[#001E80] shadow-sm border border-gray-100" />
                            </div>
                        )}
                        <InfoPill label="Commitment" value={profile.commitmentLevel} />
                    </div>
                )}

                {/* Style & Sessions */}
                {(profile.sessionsPerWeek || profile.sessionLength || profile.pace || profile.canOffer) && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80]">Style</h3>
                        <InfoPill label="Sessions / Week" value={profile.sessionsPerWeek} />
                        <InfoPill label="Session Length" value={profile.sessionLength} />
                        <InfoPill label="Pace" value={profile.pace} />
                        {profile.canOffer && (
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Can Offer</span>
                                <span className="text-base font-medium text-gray-800 break-words leading-relaxed">{profile.canOffer}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Skills & Interests ──────────────────── */}
            {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                    {profile.skills?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-3">Skills</h3>
                            <TagList items={profile.skills} />
                        </div>
                    )}
                    {profile.interests?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-3">Interests</h3>
                            <TagList items={profile.interests} color="bg-gray-50 text-gray-700" />
                        </div>
                    )}
                </div>
            )}

            {/* ─── Partnership Track Record ─────────────── */}
            {(completedPartnerships > 0 || activePartnerships > 0) && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#001E80]">Track Record</h3>
                        <div className="flex gap-3">
                            <span className="text-sm font-bold text-[#001E80]">{activePartnerships} active</span>
                            <span className="text-sm font-bold text-gray-400">{completedPartnerships} completed</span>
                        </div>
                    </div>
                    {profile.partnerHistory?.length > 0 && (
                        <div className="space-y-2">
                            {profile.partnerHistory.slice().reverse().slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#EAEEFE] flex items-center justify-center text-xs font-black text-[#001E80]">
                                            {item.partnerName?.charAt(0)}
                                        </div>
                                        <Link to={`/u/${item.partnerUsername}`} className="text-base font-bold text-gray-800 hover:text-[#001E80] transition-colors">
                                            {item.partnerName}
                                        </Link>
                                    </div>
                                    <span className="text-xs font-bold text-green-500 uppercase">Completed</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Reviews ─────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#001E80]">
                        Reviews ({reviews.length})
                    </h3>
                    {currentUser && currentUser._id !== profile._id && isConnected && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#001E80] text-white hover:bg-[#001E80]/85 transition-all"
                        >
                            {showReviewForm ? 'Cancel' : 'Leave a Review'}
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl mb-6 border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2">Rating</label>
                            <select
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                className="w-full max-w-xs px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#001E80]/20 outline-none text-sm font-bold"
                            >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2">Comment</label>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#001E80]/20 outline-none text-sm resize-none"
                                rows="3"
                                placeholder="Share your experience working with this user..."
                                required
                            />
                        </div>
                        <button type="submit" className="bg-[#001E80] hover:bg-[#001E80]/85 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                            Submit Review
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#001E80] text-white flex items-center justify-center text-xs font-black">
                                            {review.reviewer?.name?.charAt(0) || '?'}
                                        </div>
                                        <span className="font-bold text-gray-800 text-base">{review.reviewer?.name || 'Unknown'}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} size={12} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-[10px] font-bold">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-base leading-relaxed pl-11">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-base text-center py-8">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
