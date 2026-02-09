
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaStar, FaEnvelope, FaCommentDots, FaBullhorn } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/50 border-b border-black/5">
            <div className="py-5">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/assets/logosaas.png" alt="LearnCrew Logo" className="h-10 w-auto" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">LearnCrew</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-6 items-center">

                            {!user && (
                                <>
                                    <Link to="/mentors" className="text-black/60 hover:text-black transition-colors font-medium text-sm">Mentorships</Link>
                                    <Link to="/partners" className="text-black/60 hover:text-black transition-colors font-medium text-sm">Find Partners</Link>
                                    <div className="flex gap-4 items-center ml-4">
                                        <Link to="/login" className="text-black font-medium text-sm">Login</Link>
                                        <Link to="/register" className="bg-black text-white px-4 py-2 rounded-lg font-medium tracking-tight hover:bg-black/80 transition-colors">
                                            Join for free
                                        </Link>
                                    </div>
                                </>
                            )}

                            {user && (
                                <div className="flex gap-6 items-center">
                                    <Link to="/requests" className="flex items-center gap-1.5 text-black/60 hover:text-black transition-colors font-medium text-sm" title="Inbox">
                                        <FaEnvelope className="text-lg" />
                                        <span className="hidden lg:inline">Inbox</span>
                                    </Link>
                                    <Link to="/chat" className="flex items-center gap-1.5 text-black/60 hover:text-black transition-colors font-medium text-sm" title="Chat">
                                        <FaCommentDots className="text-lg" />
                                        <span className="hidden lg:inline">Chat</span>
                                    </Link>
                                    <Link to="/mentorship-request" className="flex items-center gap-1.5 text-black/60 hover:text-black transition-colors font-medium text-sm" title="Pitch Hub">
                                        <FaBullhorn className="text-lg" />
                                        <span className="hidden lg:inline">Pitch Hub</span>
                                    </Link>

                                    {/* Dashboard Link */}
                                    <Link to="/dashboard" className="text-black font-medium text-sm">Dashboard</Link>

                                    {/* Stars Balance Box */}
                                    <Link to="/top-up" className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 px-3 py-1.5 rounded-lg text-yellow-700 font-medium text-sm hover:shadow-sm transition-shadow">
                                        <FaStar className="text-yellow-500" />
                                        <span>{user.stars || 0}</span>
                                    </Link>

                                    {/* Logout Button */}
                                    <button onClick={handleLogout} className="text-black/60 hover:text-black font-medium text-sm transition-colors">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-black/60 hover:text-black transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-black/5 overflow-hidden shadow-xl"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">

                            {!user && (
                                <>
                                    <Link to="/mentors" onClick={() => setIsMenuOpen(false)} className="text-black/60 hover:text-black font-medium text-sm py-2">Mentorships</Link>
                                    <Link to="/partners" onClick={() => setIsMenuOpen(false)} className="text-black/60 hover:text-black font-medium text-sm py-2">Find Partners</Link>
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-black/60 hover:text-black font-medium text-sm py-2">Login</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-black text-white w-full py-3 rounded-lg font-medium tracking-tight hover:bg-black/80 transition-colors text-center">
                                        Join for free
                                    </Link>
                                </>
                            )}

                            {user && (
                                <>
                                    <Link to="/requests" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-black/60 hover:text-black font-medium text-sm py-2">
                                        <FaEnvelope /> Inbox
                                    </Link>
                                    <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-black/60 hover:text-black font-medium text-sm py-2">
                                        <FaCommentDots /> Chat
                                    </Link>
                                    <Link to="/mentorship-request" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-black/60 hover:text-black font-medium text-sm py-2">
                                        <FaBullhorn /> Pitch Hub
                                    </Link>

                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-black/60 hover:text-black font-medium text-sm py-2">Dashboard</Link>

                                    <Link to="/top-up" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-yellow-700 font-medium text-sm py-2 bg-yellow-50 px-3 rounded-lg">
                                        <FaStar className="text-yellow-500" />
                                        <span>Balance: {user.stars || 0} Stars</span>
                                    </Link>

                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-black text-white w-full py-3 rounded-lg font-medium tracking-tight hover:bg-black/80 transition-colors mt-2">
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
