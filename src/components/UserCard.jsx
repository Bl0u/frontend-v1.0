import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaExternalLinkAlt } from 'react-icons/fa';

const UserCard = ({ user }) => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRequest = async (type) => {
        if (!currentUser) {
            toast.error('Please login first');
            return;
        }
        if (currentUser._id === user._id) return;

        try {
            const message = `Hi, I'm interested in collaborating with you.`;
            await requestService.sendRequest(user._id, 'partner', message, currentUser.token);
            toast.success('Partnership request sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const isMe = currentUser?._id === user._id;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-[#001E80]/10 transition-all duration-300 relative group">
            <Link to={`/u/${user.username}`} className="absolute top-4 right-4 text-gray-300 group-hover:text-[#001E80] transition-colors" title="View Profile">
                <FaExternalLinkAlt size={13} />
            </Link>

            <div className="relative mb-4">
                <div className="w-20 h-20 rounded-3xl border-2 border-white shadow-md flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-[#001E80] to-[#010D3E]">
                    {user.avatar && user.avatar !== 'https://via.placeholder.com/150'
                        ? <img src={user.avatar} alt="" className="w-full h-full rounded-3xl object-cover" />
                        : user.name?.charAt(0)
                    }
                </div>
                {user.lookingForPartner && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-0.5">{user.name}</h3>

            <div className="w-full text-center space-y-2 mt-1">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                    Partner · <span className="text-gray-800">{user.major || 'General'}</span>{' '}
                    {user.academicLevel && (
                        <span className="text-gray-400">· {user.academicLevel}</span>
                    )}
                </p>

                {/* Goal */}
                {user.matchingGoal && (
                    <div className="pt-1">
                        <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-2">
                            🎯 {user.matchingGoal}
                        </p>
                    </div>
                )}

                {/* Collaboration Snapshot */}
                <div className="flex items-center justify-center gap-3 text-xs text-gray-600 font-medium">
                    <span className="flex items-center gap-1">
                        <span className="text-sm">💻</span>
                        {user.studyMode || 'Online'}
                    </span>
                    {user.pace && (
                        <span className="flex items-center gap-1">
                            <span className="text-sm">⚡</span>
                            {user.pace}
                        </span>
                    )}
                </div>

                {/* Availability Slot */}
                {(user.availability?.days?.length > 0 || user.availability?.timeRanges?.length > 0) && (
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 pt-0.5 font-bold uppercase">
                        ⏰ {user.availability.timeRanges?.[0] || 'Flexible'} · {user.availability.days?.length || 0} days/week
                    </p>
                )}
            </div>

            <div className="mt-auto w-full flex flex-col gap-3 pt-6">
                {!isMe && currentUser && (
                    <button
                        onClick={() => handleRequest('partner')}
                        disabled={!user.lookingForPartner}
                        className={`w-full py-2.5 rounded-xl transition font-bold text-sm shadow-md active:scale-[0.98] ${user.lookingForPartner
                            ? 'bg-[#001E80] text-white hover:bg-[#001E80]/85 shadow-[#001E80]/10'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {user.lookingForPartner ? 'Request Partnership' : 'Not Seeking Partners'}
                    </button>
                )}

                <div className="flex justify-center items-center gap-4 text-xs">
                    <a
                        href={`mailto:${user.email}`}
                        className="text-gray-400 hover:text-[#001E80] transition underline decoration-dotted font-medium"
                    >
                        Contact
                    </a>
                    <Link to={`/u/${user.username}`} className="text-gray-400 hover:text-[#001E80] transition underline decoration-dotted font-medium">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
