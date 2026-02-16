import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt, FaInbox, FaCommentDots, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import chatService from '../features/chat/chatService';
import { API_BASE_URL } from '../config';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [introDone, setIntroDone] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);

    useEffect(() => {
        const handleRelease = () => setIntroDone(true);
        window.addEventListener('navbar-release', handleRelease);
        return () => window.removeEventListener('navbar-release', handleRelease);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const isLandingRoute = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/landing-page';

            // Re-sync skipped state on change
            const skipButton = document.querySelector('button[class*="fixed bottom-8"]');
            const skipText = skipButton?.innerText?.toLowerCase();
            const currentSkipped = skipText?.includes('enable');
            setIsSkipped(currentSkipped);

            if (!isLandingRoute) {
                setIsVisible(true);
                return;
            }

            // Gated by intro
            if (!introDone && !currentSkipped) {
                setIsVisible(false);
                return;
            }

            const scrollY = window.scrollY;
            const threshold = window.innerHeight * 0.8;
            setIsVisible(scrollY <= threshold);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, introDone]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user || !user.token) return;
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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Resources', path: '/resources' },
        { name: 'Partners', path: '/partners' },
        { name: 'Mentors', path: '/mentors' },
    ];

    const isLandingRoute = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/landing-page';
    const isSticky = isLandingRoute && isSkipped;

    return (
        <header
            className={`${isSticky ? 'sticky' : 'fixed'} top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out`}
            style={{
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 md:px-12 md:py-4">
                    {/* Logo - Styled like Hero Hook */}
                    <Link to="/" className="text-3xl font-black hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'Zuume-Bold' }}>
                        <span className="inline-block bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-0 leading-tight" style={{ letterSpacing: '1px' }}>
                            LearnCrew
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-slate-700 hover:text-black transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4d6d] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                        <Link
                            to="/mentorship-request"
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-black transition-colors relative group"
                        >
                            <span className="bg-[#ff4d6d] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">New</span>
                            Pitch Hub
                        </Link>
                    </div>

                    {/* Actions & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Inbox */}
                                <Link to="/requests" className="flex items-center text-slate-700 hover:text-black relative transition-colors duration-300">
                                    <FaInbox className="text-lg" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#ff4d6d] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Chat */}
                                <Link to="/chat" className="flex items-center text-slate-700 hover:text-black relative transition-colors duration-300">
                                    <FaCommentDots className="text-lg" />
                                    {chatUnreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#ff4d6d] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                            {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Stars */}
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-black/5 rounded-full border border-black/5">
                                    <span className="text-base">⭐</span>
                                    <span className="font-bold text-slate-700 text-sm">{user.stars || 0}</span>
                                </div>

                                {/* Top Up */}
                                <Link
                                    to="/top-up"
                                    className="hidden md:block px-4 py-2 bg-[#ff4d6d] text-white text-sm font-bold rounded-lg hover:bg-[#c9184a] transition-all duration-300 shadow-sm"
                                >
                                    Top Up
                                </Link>

                                {/* Dashboard */}
                                <Link
                                    to="/dashboard"
                                    className="hidden sm:block text-sm font-medium text-slate-700 hover:text-black"
                                >
                                    Dashboard
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 text-slate-700 hover:text-[#ff4d6d] transition-colors duration-300"
                                >
                                    <FaSignOutAlt />
                                    <span className="hidden sm:inline font-medium text-sm">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
                                >
                                    Login
                                </Link>
                                <div className="mask-container-nature">
                                    <span className="mas">REGISTER</span>
                                    <Link
                                        to="/register"
                                        className="mask-btn-nature"
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-slate-800 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-black/5 overflow-hidden bg-white/20 backdrop-blur-xl"
                        >
                            <div className="flex flex-col p-6 gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-800 font-medium text-sm hover:translate-x-1 transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/mentorship-request"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-slate-800 font-medium text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                                >
                                    Pitch Hub <span className="bg-[#ff4d6d] text-white px-2 py-0.5 rounded text-[10px]">NEW</span>
                                </Link>

                                {user && (
                                    <>
                                        <hr className="border-black/5 my-2" />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 rounded-full border border-black/5">
                                                <span className="text-base">⭐</span>
                                                <span className="font-bold text-slate-800 text-sm">{user.stars || 0}</span>
                                            </div>
                                            <Link
                                                to="/top-up"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="px-4 py-2 bg-[#ff4d6d] text-white text-xs font-bold rounded-lg"
                                            >
                                                Top Up
                                            </Link>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-slate-800 font-medium text-sm hover:translate-x-1 transition-transform"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => { onLogout(); setIsMenuOpen(false); }}
                                            className="text-left text-[#ff4d6d] font-medium text-sm"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
};

export default Header;
