import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaCommentDots } from 'react-icons/fa';
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
        <header className="bg-white shadow-md mb-8">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-blue-600">
                    <Link to="/">GradProject</Link>
                </div>

                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
                        </li>
                        <li>
                            <Link to="/resources" className="text-gray-600 hover:text-blue-500">Resources</Link>
                        </li>
                        <li>
                            <Link to="/partners" className="text-gray-600 hover:text-blue-500">Partners</Link>
                        </li>
                        <li>
                            <Link to="/mentors" className="text-gray-600 hover:text-indigo-500 transition-colors">Mentors</Link>
                        </li>
                        <li>
                            <Link to="/mentorship-request" className="flex items-center gap-1 text-gray-600 hover:text-indigo-500 transition-colors font-medium">
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Hub</span>
                                Pitch Hub
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    <Link to="/requests" className="flex items-center text-gray-600 hover:text-blue-500 relative">
                                        <span className="mr-1">Inbox</span>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/chat" className="text-gray-600 hover:text-blue-500 flex items-center gap-1 font-medium relative">
                                        Chat
                                        {chatUnreadCount > 0 && (
                                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                                +{chatUnreadCount > 9 ? '9' : chatUnreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-500 font-bold">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={onLogout} className="flex items-center text-red-500 hover:text-red-700">
                                        <FaSignOutAlt className="mr-1" /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header >
    );
};

export default Header;

