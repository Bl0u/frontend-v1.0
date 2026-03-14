import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaCheck, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AccountSwitcher = () => {
    const { user, sessions, switchSession, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Hide Account Switcher on specific pages if desired (like login, register, onboarding)
    const hideOnRoutes = ['/login', '/register', '/onboarding'];
    const shouldHide = hideOnRoutes.includes(location.pathname) || sessions.length === 0;

    if (shouldHide) return null;

    const activeIndex = parseInt(localStorage.getItem('activeSessionIndex')) || 0;

    return (
        <div className="fixed bottom-8 left-8 z-[9999]">
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white border border-[#001E80]/10 text-[#001E80] rounded-2xl flex items-center justify-center shadow-xl shadow-[#001E80]/10 hover:shadow-[#001E80]/20 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
            >
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                    <FaUserCircle size={24} className="group-hover:text-[#001E80]/80 transition-colors" />
                )}
                {sessions.length > 1 && (
                    <div className="absolute bottom-1 right-1 bg-[#001E80] text-white rounded-full p-0.5 shadow-sm border border-white">
                        <FaChevronDown size={8} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                )}
            </motion.button>

            {/* Menu Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, x: -20 }}
                        className="absolute bottom-16 left-0 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,30,128,0.15)] overflow-hidden border border-[#001E80]/10 flex flex-col"
                    >
                        <div className="bg-gradient-to-r from-[#001E80] to-[#010D3E] p-4 text-white">
                            <h3 className="font-bold text-sm tracking-wide">Account Switcher</h3>
                            <p className="text-[10px] text-white/70 uppercase font-semibold mt-1 tracking-wider">Active Sessions</p>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-gray-50/50">
                            {sessions.map((session, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!isActive) {
                                                switchSession(index);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-[#EAEEFE] border-[#001E80]/20 cursor-default'
                                                : 'bg-white border-transparent hover:bg-gray-50 cursor-pointer'
                                        } border`}
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            {session.profilePicture ? (
                                                <img src={session.profilePicture} alt={session.username} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                                            ) : (
                                                <FaUserCircle size={32} className="text-gray-400" />
                                            )}
                                            <div className="text-left truncate">
                                                <p className={`text-sm font-bold truncate ${isActive ? 'text-[#001E80]' : 'text-gray-800'}`}>
                                                    {session.username}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate">
                                                    {session.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {isActive && <FaCheck className="text-[#001E80] ml-2 shrink-0" size={14} />}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    logout(index);
                                                    if (isActive) setIsOpen(false);
                                                }}
                                                className="ml-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Logout this session"
                                            >
                                                <FaSignOutAlt size={12} />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountSwitcher;
