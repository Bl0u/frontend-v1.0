import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt, FaInbox, FaCommentDots, FaStar } from 'react-icons/fa';
import axios from 'axios';
import chatService from '../features/chat/chatService';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatUnreadCount, setChatUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('http://localhost:5000/api/requests/received', config);
                const pendingCount = res.data.filter(r => r.status === 'pending').length;
                setUnreadCount(pendingCount);
            } catch (error) {
                console.error('Error fetching unread count', error);
            }
        };

        const fetchChatUnreadCount = async () => {
            if (!user || !user.token) return;
            try {
                const data = await chatService.getUnreadCount(user.token);
                setChatUnreadCount(data.unreadCount);
            } catch (error) {
                console.error('Error fetching chat unread count', error);
            }
        };

        fetchUnreadCount();
        fetchChatUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
            fetchChatUnreadCount();
        }, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-4 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-gradient-to-r from-[#590d22] via-[#800f2f] to-[#590d22] text-white shadow-2xl rounded-3xl backdrop-blur-md transition-all duration-300 hover:shadow-[#590d22]/50 px-12 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="text-3xl font-bold hover:scale-105 transition-transform duration-300">
                            <span className="bg-gradient-to-r from-[#ff4d6d] via-[#ff758f] to-[#ffb3c1] bg-clip-text text-transparent">
                                LearnCrew
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav>
                            <ul className="flex space-x-8 items-center">
                                <li>
                                    <Link to="/" className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/resources" className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300">
                                        Resources
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/partners" className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300">
                                        Partners
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mentors" className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300">
                                        Mentors
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/mentorship-request"
                                        className="flex items-center gap-2 text-[#ffccd5] hover:text-white font-medium transition-colors duration-300"
                                    >
                                        <span className="bg-[#ff4d6d] text-white px-2 py-1 rounded-md text-xs font-bold uppercase">New</span>
                                        Pitch Hub
                                    </Link>
                                </li>

                                {user ? (
                                    <>
                                        {/* Inbox */}
                                        <li>
                                            <Link to="/requests" className="flex items-center text-[#ffccd5] hover:text-white relative transition-colors duration-300">
                                                <FaInbox className="text-lg" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-[#ff4d6d] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>

                                        {/* Chat */}
                                        <li>
                                            <Link to="/chat" className="flex items-center text-[#ffccd5] hover:text-white relative transition-colors duration-300">
                                                <FaCommentDots className="text-lg" />
                                                {chatUnreadCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-[#ff4d6d] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                                        {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>

                                        {/* Stars Display */}
                                        <li className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-[#ffccd5]/30 hover:bg-white/20 transition-all duration-300">
                                            <span className="text-xl">⭐</span>
                                            <span className="font-black text-[#ffccd5]">{user.stars || 0}</span>
                                        </li>

                                        {/* Top Up */}
                                        <li>
                                            <Link
                                                to="/top-up"
                                                className="px-4 py-2 bg-[#ff4d6d] text-white font-bold rounded-lg hover:bg-[#c9184a] transition-all duration-300 shadow-lg hover:shadow-[#ff4d6d]/50"
                                            >
                                                Top Up
                                            </Link>
                                        </li>

                                        {/* Dashboard */}
                                        <li>
                                            <Link
                                                to="/dashboard"
                                                className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>

                                        {/* Logout */}
                                        <li>
                                            <button
                                                onClick={onLogout}
                                                className="flex items-center gap-2 text-[#ffccd5] hover:text-[#ff4d6d] transition-colors duration-300"
                                            >
                                                <FaSignOutAlt />
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                to="/login"
                                                className="text-[#ffccd5] hover:text-white font-medium transition-colors duration-300"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <div className="mask-container-nature">
                                                <span className="mas">JOIN</span>
                                                <Link
                                                    to="/register"
                                                    className="mask-btn-nature"
                                                >
                                                    JOIN
                                                </Link>
                                            </div>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
