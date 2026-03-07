import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaUserPlus, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const UserCard = ({ user }) => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRequest = async (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    // Content Focus: What is needed from a partner
    const neededText = user.neededFromPartner || "No specific requirements listed. View my full profile to see if we're a match!";

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-xl hover:border-[#001E80]/10 transition-all duration-500 relative group overflow-hidden transition-all">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAEEFE]/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-[#001E80]/5 transition-colors duration-500"></div>

            {/* Avatar Section */}
            <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br from-[#001E80] to-[#010D3E] overflow-hidden">
                    {user.avatar && user.avatar !== 'https://via.placeholder.com/150'
                        ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        : user.name?.charAt(0)
                    }
                </div>
                {user.lookingForPartner && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white bg-green-500 shadow-sm" title="Actively Seeking Partner"></div>
                )}
            </div>

            {/* Identity */}
            <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight tracking-tight">{user.name}</h3>
            <p className="text-[#010D3E]/40 text-[10px] font-black uppercase tracking-[0.1em] mb-4">
                {user.university || 'University'} <span className="text-[#001E80]/20 mx-1">·</span> {user.major || 'General'}
            </p>

            {/* The Focus - Needed from Partner */}
            <div className="w-full mb-5">
                <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl relative text-left whitespace-normal">
                    <FaQuoteLeft className="absolute -top-2 left-4 text-[#001E80]/10" size={14} />
                    <p className="text-xs font-black text-[#001E80]/40 uppercase tracking-widest mb-2 px-1">Looking for:</p>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
                        {neededText}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3 pt-4 border-t border-gray-50">
                <Link
                    to={`/u/${user.username}`}
                    className="w-full py-4 rounded-2xl bg-[#001E80] text-white flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#001E80]/10 hover:bg-[#001E80]/90 transition-all active:scale-[0.98]"
                >
                    View Full Profile <FaChevronRight size={10} className="mt-0.5" />
                </Link>

                {!isMe && currentUser && user.lookingForPartner && (
                    <button
                        onClick={handleRequest}
                        className="w-full py-3 rounded-2xl bg-white border border-[#001E80]/10 text-[#001E80]/60 hover:text-[#001E80] hover:bg-[#EAEEFE]/30 hover:border-[#001E80]/20 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        <FaUserPlus size={12} /> Send Request
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;
