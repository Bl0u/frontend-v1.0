import { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaBell, FaRegBell } from 'react-icons/fa';
import { LiquidButton } from '../components/LiquidButton';
import AuthContext from '../context/AuthContext';
import notificationService from '../features/notifications/notificationService';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        if (user?.token) {
            const fetchNotifs = async () => {
                try {
                    const data = await notificationService.getNotifications(user.token);
                    setNotifications(data);
                } catch (error) {
                    console.error('Failed to fetch notifications');
                }
            };
            fetchNotifs();
            const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    // Close notif dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markAsRead(id, user.token);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const navLinks = [
        { name: 'Products', path: '/products' },
        { name: 'Solutions', path: '/solutions' },
        { name: 'Ecosystem', path: '/ecosystem' },
        { name: 'Community', path: '/community' },
        { name: 'Resources', path: '/resources' },
        { name: 'Blog', path: '/blog' },
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
            >
                <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-3">
                    {/* Logo: El-Zatona with Sun Icon */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-orange-400 to-pink-500 p-1.5 rounded-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <FaSun className="text-white text-lg" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">El-Zatona</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-slate-700 hover:text-black transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button, Notifications & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2 text-slate-600 hover:text-black relative transition-colors"
                                >
                                    {unreadCount > 0 ? <FaBell className="text-indigo-600" /> : <FaRegBell />}
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-2 z-[60]"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                                <span className="text-xs font-black uppercase tracking-widest text-[#001E80]">Notifications</span>
                                                <button 
                                                    onClick={() => navigate('/home?tab=moderate')} // User requested dashboard refinements, likely check there
                                                    className="text-[10px] text-gray-400 hover:text-[#001E80]"
                                                >
                                                    View Dashboard
                                                </button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-center text-gray-400 text-xs italic">
                                                        No notifications yet
                                                    </div>
                                                ) : (
                                                    notifications.map((n) => (
                                                        <div 
                                                            key={n._id} 
                                                            className={`px-4 py-3 hover:bg-white/50 transition-colors border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-[#EAEEFE]/30' : ''}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <img 
                                                                    src={n.sender?.avatar || 'https://via.placeholder.com/150'} 
                                                                    alt="" 
                                                                    className="w-8 h-8 rounded-full border border-gray-100"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-slate-800 leading-tight">
                                                                        <span className="font-bold">@{n.sender?.username}</span> {n.message}
                                                                    </p>
                                                                    <div className="flex items-center justify-between mt-2">
                                                                        <span className="text-[9px] text-gray-400">
                                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                        <div className="flex gap-2">
                                                                            {!n.isRead && (
                                                                                <button 
                                                                                    onClick={() => handleMarkRead(n._id)}
                                                                                    className="text-[9px] font-bold text-[#001E80] hover:underline"
                                                                                >
                                                                                    Mark read
                                                                                </button>
                                                                            )}
                                                                            {n.thread && (
                                                                                <button 
                                                                                    onClick={() => {
                                                                                        handleMarkRead(n._id);
                                                                                        setIsNotifOpen(false);
                                                                                        // Critical: ensure no spaces or template literal oddities corrupt the URL
                                                                                        const cleanId = (n.thread?._id || n.thread || '').toString().trim();
                                                                                        if (cleanId) navigate(`/resources/thread/${cleanId}`);
                                                                                    }}
                                                                                    className="px-2 py-0.5 bg-[#001E80] text-white text-[9px] font-black uppercase tracking-widest rounded hover:bg-[#001E80]/80 transition-colors"
                                                                                >
                                                                                    View
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <LiquidButton
                            to={user ? "/home" : "/register"}
                            text={user ? "Dashboard" : "Join"}
                            className="hidden md:block"
                        />

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-slate-800 focus:outline-none"
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
                            className="md:hidden border-t border-white/20 overflow-hidden bg-white/40 backdrop-blur-xl rounded-b-2xl"
                        >
                            <div className="flex flex-col p-4 gap-4">
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
                                <div className="h-px bg-slate-200/50 my-2"></div>
                                <Link
                                    to={user ? "/home" : "/register"}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-black text-white text-center py-3 rounded-xl font-medium shadow-md"
                                >
                                    {user ? "Dashboard" : "Register"}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
};
