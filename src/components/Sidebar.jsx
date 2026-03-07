import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import chatService from '../features/chat/chatService';
import { API_BASE_URL } from '../config';
import {
    FiHome, FiBookOpen, FiUsers, FiZap,
    FiUser, FiMessageCircle, FiInbox,
    FiCreditCard, FiLogOut, FiMenu, FiX,
    FiClipboard, FiUserCheck, FiActivity, FiChevronDown, FiHash,
    FiShield
} from 'react-icons/fi';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [resourcesExpanded, setResourcesExpanded] = useState(false);
    const [activityExpanded, setActivityExpanded] = useState(false);

    // Fetch badge counts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/requests/received`, config);
                const pendingCount = res.data.filter(r => r.status === 'pending').length;
                setUnreadCount(pendingCount);
            } catch (error) {
                console.error('Error fetching unread count', error);
            }
        };

        const fetchChatUnreadCount = async () => {
            if (!user?.token) return;
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

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        if (path === '/home') {
            return (location.pathname === '/home' || location.pathname === '/dashboard') && !location.search;
        }
        return location.pathname === path;
    };

    const isActiveDashboardTab = (tab) => {
        return location.pathname === '/home' && location.search.includes(`tab=${tab}`);
    };

    const isActiveResourceTab = (tab) => {
        if (!tab) return location.pathname === '/resources' && !location.search;
        return location.pathname === '/resources' && location.search.includes(`tab=${tab}`);
    };

    if (!user) return null;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="sidebar-mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''} overflow-y-auto h-screen pb-20 scrollbar-hide`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <Link to="/home">LearnCrew</Link>
                </div>

                {/* ── NAVIGATE ── */}
                <div className="sidebar-section-label">Navigate</div>
                <nav className="sidebar-nav">
                    <Link to="/home" className={`sidebar-link ${isActive('/home') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiHome /></span>
                        <span className="sidebar-link-text">Home</span>
                    </Link>

                    {/* Resources Accordion */}
                    <div className="sidebar-accordion">
                        <button
                            onClick={() => setResourcesExpanded(!resourcesExpanded)}
                            className={`sidebar-link w-full justify-between ${(location.pathname === '/resources' && !resourcesExpanded) ? 'text-indigo-600' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="sidebar-link-icon"><FiBookOpen /></span>
                                <span className="sidebar-link-text">Resources Hub</span>
                            </div>
                            <FiChevronDown className={`transition-transform duration-300 ${resourcesExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 bg-white/50 rounded-b-xl ${resourcesExpanded || location.pathname === '/resources' ? 'max-h-40 opacity-100 py-2 mb-2' : 'max-h-0 opacity-0'}`}>
                            <Link to="/resources?tab=curated" className={`sidebar-link pl-12 text-sm mx-2 mb-1 rounded-lg ${isActiveResourceTab('curated') ? 'active bg-white text-[#001E80] shadow-sm font-bold' : 'text-gray-600 hover:bg-white/80 hover:text-[#001E80]'}`}>
                                <span className="sidebar-link-icon"><FiBookOpen size={14} /></span>
                                <span className="sidebar-link-text">Guides</span>
                            </Link>
                            <Link to="/resources?tab=community" className={`sidebar-link pl-12 text-sm mx-2 rounded-lg ${isActiveResourceTab('community') ? 'active bg-white text-[#001E80] shadow-sm font-bold' : 'text-gray-600 hover:bg-white/80 hover:text-[#001E80]'}`}>
                                <span className="sidebar-link-icon"><FiHash size={14} /></span>
                                <span className="sidebar-link-text">Community</span>
                            </Link>
                        </div>
                    </div>

                    <Link to="/partners" className={`sidebar-link ${isActive('/partners') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiUsers /></span>
                        <span className="sidebar-link-text">Partners</span>
                    </Link>
                    <Link to="/pitch-hub" className={`sidebar-link ${isActive('/pitch-hub') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiZap /></span>
                        <span className="sidebar-link-text">Pitch Hub</span>
                    </Link>
                </nav>

                {/* ── DASHBOARD ── */}
                <div className="sidebar-section-label">Dashboard</div>
                <nav className="sidebar-nav">
                    <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiUser /></span>
                        <span className="sidebar-link-text">Profile</span>
                    </Link>
                    <Link to="/home?tab=partnership" className={`sidebar-link ${isActiveDashboardTab('partnership') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiUserCheck /></span>
                        <span className="sidebar-link-text">Partnerships</span>
                    </Link>
                    <Link to="/home?tab=contributions" className={`sidebar-link ${isActiveDashboardTab('contributions') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiActivity /></span>
                        <span className="sidebar-link-text">Contributions</span>
                    </Link>

                    {/* My Activity Accordion */}
                    <div className="sidebar-accordion">
                        <button
                            onClick={() => setActivityExpanded(!activityExpanded)}
                            className={`sidebar-link w-full justify-between ${(location.pathname === '/home' && ['moderate', 'paid', 'pinned'].some(t => location.search.includes(`tab=${t}`)) && !activityExpanded) ? 'text-indigo-600' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="sidebar-link-icon"><FiActivity /></span>
                                <span className="sidebar-link-text">My Activity</span>
                            </div>
                            <FiChevronDown className={`transition-transform duration-300 ${activityExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 bg-white/50 rounded-b-xl ${activityExpanded || ['moderate', 'paid', 'pinned'].some(t => location.search.includes(`tab=${t}`)) ? 'max-h-48 opacity-100 py-2 mb-2' : 'max-h-0 opacity-0'}`}>
                            <Link to="/home?tab=moderate" className={`sidebar-link pl-12 text-sm mx-2 mb-1 rounded-lg ${isActiveDashboardTab('moderate') ? 'active bg-white text-[#001E80] shadow-sm font-bold' : 'text-gray-600 hover:bg-white/80 hover:text-[#001E80]'}`}>
                                <span className="sidebar-link-text text-xs uppercase tracking-widest font-black">Moderate</span>
                            </Link>
                            <Link to="/home?tab=paid" className={`sidebar-link pl-12 text-sm mx-2 mb-1 rounded-lg ${isActiveDashboardTab('paid') ? 'active bg-white text-[#001E80] shadow-sm font-bold' : 'text-gray-600 hover:bg-white/80 hover:text-[#001E80]'}`}>
                                <span className="sidebar-link-text text-xs uppercase tracking-widest font-black">Paid Threads</span>
                            </Link>
                            <Link to="/home?tab=pinned" className={`sidebar-link pl-12 text-sm mx-2 rounded-lg ${isActiveDashboardTab('pinned') ? 'active bg-white text-[#001E80] shadow-sm font-bold' : 'text-gray-600 hover:bg-white/80 hover:text-[#001E80]'}`}>
                                <span className="sidebar-link-text text-xs uppercase tracking-widest font-black">Pinned</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* ── ADMIN (only for admins) ── */}
                {user.role === 'admin' && (
                    <>
                        <div className="sidebar-section-label">Admin</div>
                        <nav className="sidebar-nav">
                            <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}>
                                <span className="sidebar-link-icon"><FiShield /></span>
                                <span className="sidebar-link-text">Dashboard</span>
                            </Link>
                        </nav>
                    </>
                )}

                {/* ── ACCOUNT ── */}
                <div className="sidebar-section-label">Account</div>
                <nav className="sidebar-nav">
                    {/* Stars */}
                    <div className="sidebar-stars">
                        <span className="sidebar-stars-icon">⭐</span>
                        <span className="sidebar-stars-count">{user.stars || 0}</span>
                        <span className="sidebar-stars-label">Stars</span>
                    </div>

                    <Link to="/requests" className={`sidebar-link ${isActive('/requests') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiInbox /></span>
                        <span className="sidebar-link-text">Inbox</span>
                        {unreadCount > 0 && (
                            <span className="sidebar-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                    </Link>
                    <Link to="/chat" className={`sidebar-link ${isActive('/chat') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiMessageCircle /></span>
                        <span className="sidebar-link-text">Chat</span>
                        {chatUnreadCount > 0 && (
                            <span className="sidebar-badge">{chatUnreadCount > 9 ? '9+' : chatUnreadCount}</span>
                        )}
                    </Link>
                    <Link to="/top-up" className={`sidebar-link ${isActive('/top-up') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon"><FiCreditCard /></span>
                        <span className="sidebar-link-text">Top Up</span>
                    </Link>
                </nav>

                {/* Spacer */}
                <div className="sidebar-spacer" />

                {/* User Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-avatar">
                        {user.name?.charAt(0) || '?'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user.name || user.username}</div>
                        <div className="sidebar-user-role">Partner</div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
                        <FiLogOut size={16} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
