import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserGraduate, FaChalkboardTeacher, FaEnvelope, FaLinkedin, FaGithub, FaGlobe, FaStar, FaTwitter } from 'react-icons/fa';
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

    // Current User (from localStorage for basic checks, ideally use Context)
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch Profile
                const res = await axios.get(`${API_BASE_URL}/api/users/u/${username}`);
                setProfile(res.data);
                const userId = res.data._id;

                // 2. Fetch Reviews
                const reviewsRes = await axios.get(`${API_BASE_URL}/api/reviews/${userId}`);
                setReviews(reviewsRes.data);

                // 3. Check Connection (if logged in and not self)
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

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading Profile...</div>;
    if (error || !profile) return <div className="text-center mt-20 text-red-500 font-bold">User not found</div>;

    const isMentor = profile.role === 'mentor'; // Deprecated but kept for conditional safety

    return (
        <div className="max-w-4xl mx-auto my-10 px-4 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-indigo-50 flex items-center justify-center text-5xl font-black text-indigo-300">
                            {profile.name?.charAt(0)}
                        </div>
                        <div className="flex-grow ml-6 mb-2">
                            <h1 className="text-3xl font-bold text-gray-800">{profile?.name || 'User Profile'}</h1>
                            <p className="text-gray-500 font-medium">@{profile?.username}</p>
                        </div>
                        <div className="mb-2 flex gap-2">
                            <span className="px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-indigo-100 text-indigo-700">
                                Partner
                            </span>
                            {profile.lookingForPartner && (
                                <span className="px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200">
                                    Open for Collaboration
                                </span>
                            )}
                            {/* Message Button */}
                            {currentUser && currentUser._id !== profile._id && (
                                <button
                                    onClick={() => navigate(`/chat?u=${profile._id}`)}
                                    className="ml-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                                >
                                    <FaEnvelope size={12} /> Message
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Stats & Contact */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3">
                                    <FaEnvelope className="mr-2 text-blue-500" /> Contact
                                </h3>
                                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline break-all">{profile.email}</a>
                            </div>

                            {/* Socials - Now dynamic */}
                            {profile.socialLinks && profile.socialLinks.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-700 mb-3">Professional Profiles</h3>
                                    <div className="flex flex-col space-y-2">
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
                                                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                                >
                                                    <span className="mr-2 text-indigo-400">{icon}</span> {link.platform}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Skills */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold border">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No skills listed.</p>
                                    )}
                                </div>
                            </div>


                            {/* Partnership Details */}
                            <div className="space-y-6">
                                {/* Academic Context */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h3 className="text-lg font-bold text-blue-800 mb-3">Academic Context</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {profile.major && <p><span className="font-semibold text-gray-600">Major:</span> {profile.major}</p>}
                                        {profile.academicLevel && <p><span className="font-semibold text-gray-600">Level:</span> {profile.academicLevel}</p>}
                                        {profile.university && <p className="col-span-2"><span className="font-semibold text-gray-600">University:</span> {profile.university}</p>}
                                    </div>
                                </div>

                                {/* Current Courses */}
                                {profile.currentCourses && profile.currentCourses.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Current Courses</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.currentCourses.map((course, i) => (
                                                <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">{course}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Collaboration Goals */}
                                {(profile.primaryStudyGoal || profile.secondaryStudyGoal) && (
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <h3 className="text-lg font-bold text-green-800 mb-2">Collaboration Goals</h3>
                                        {profile.primaryStudyGoal && <p className="text-gray-700"><span className="font-semibold">Primary Goal:</span> {profile.primaryStudyGoal}</p>}
                                        {profile.secondaryStudyGoal && <p className="text-gray-600 text-sm"><span className="font-semibold">Secondary:</span> {profile.secondaryStudyGoal}</p>}
                                        {profile.fieldSpecificDetails && (
                                            <div className="mt-2 p-2 bg-white rounded border border-green-200 text-sm">
                                                <span className="font-semibold text-green-700">Focus Field:</span> {profile.fieldSpecificDetails}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Style & Pace */}
                                {(profile.preferredStudyStyle || profile.studyPacePreference) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {profile.preferredStudyStyle && (
                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-center">
                                                <p className="text-xs font-bold text-yellow-700 uppercase">Collaboration Style</p>
                                                <p className="font-semibold text-gray-800">{profile.preferredStudyStyle}</p>
                                            </div>
                                        )}
                                        {profile.studyPacePreference && (
                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-center">
                                                <p className="text-xs font-bold text-yellow-700 uppercase">Pace</p>
                                                <p className="font-semibold text-gray-800">{profile.studyPacePreference}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Logistics */}
                                {(profile.availability || profile.studyMode) && (
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                        <h3 className="text-lg font-bold text-orange-800 mb-2">Logistics</h3>
                                        <div className="space-y-2 text-sm">
                                            {profile.studyMode && <p><span className="font-semibold text-gray-600">Mode:</span> {profile.studyMode}</p>}
                                            {profile.availability?.days?.length > 0 && (
                                                <p><span className="font-semibold text-gray-600">Days:</span> {profile.availability.days.join(', ')}</p>
                                            )}
                                            {profile.availability?.timeRanges?.length > 0 && (
                                                <p><span className="font-semibold text-gray-600">Times:</span> {profile.availability.timeRanges.join(', ')}</p>
                                            )}
                                            {profile.preferredTools?.length > 0 && (
                                                <p><span className="font-semibold text-gray-600">Tools:</span> {profile.preferredTools.join(', ')}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Communication & Commitment */}
                                {(profile.communicationStyle || profile.commitmentLevel) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {profile.communicationStyle && (
                                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
                                                <p className="text-xs font-bold text-purple-700 uppercase">Communication</p>
                                                <p className="font-semibold text-gray-800">{profile.communicationStyle}</p>
                                            </div>
                                        )}
                                        {profile.commitmentLevel && (
                                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
                                                <p className="text-xs font-bold text-purple-700 uppercase">Commitment</p>
                                                <p className="font-semibold text-gray-800">{profile.commitmentLevel}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Languages */}
                                {profile.languages && profile.languages.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.languages.map((lang, i) => (
                                                <span key={i} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">{lang}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Partner History */}
                                {profile.partnerHistory && profile.partnerHistory.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Partnership Track Record</h3>
                                        <ul className="list-none space-y-2">
                                            {profile.partnerHistory.map((item, i) => (
                                                <li key={i} className="bg-blue-50 p-2 rounded-lg text-blue-800 flex items-center">
                                                    <span className="mr-1">Partnered with</span>
                                                    <Link to={`/u/${item.partnerUsername}`} className="font-bold underline hover:text-blue-600">
                                                        {item.partnerName}
                                                    </Link>
                                                    {item.endDate && <span className="text-gray-600 text-xs ml-auto italic">Completed</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Study Note */}
                                {profile.studyNote && (
                                    <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-400 italic text-gray-700">
                                        "{profile.studyNote}"
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Reviews ({reviews.length})</h3>
                    {currentUser && currentUser._id !== profile._id && isConnected && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 border">
                        <h4 className="font-bold text-gray-700 mb-2">Write your review</h4>
                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm mb-1">Rating</label>
                            <select
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                                className="border rounded px-3 py-2 w-full max-w-xs"
                            >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm mb-1">Comment</label>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                rows="3"
                                placeholder="Share your experience working with this user..."
                                required
                            />
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Review</button>
                    </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center mb-2">
                                    <div className="font-bold text-gray-800 mr-2">{review.reviewer?.name || 'Unknown User'}</div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} size={14} />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-xs ml-auto">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
