import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import chatService from '../features/chat/chatService';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUsers, FaBullhorn, FaRocket, FaShieldAlt, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LeadConsole = () => {
    const { user } = useContext(AuthContext);
    const [eliteGroups, setEliteGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsoleData = async () => {
            try {
                const recents = await chatService.getRecentChats(user.token);
                const elite = recents.filter(c => c.chatType === 'group' && c.name.includes('Private Network'));
                setEliteGroups(elite);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchConsoleData();
    }, [user]);

    if (!user || !['studentLead', 'mentor', 'admin'].includes(user.role)) {
        return <div className="p-20 text-center uppercase font-black text-[#001E80]">Access Denied: Elite Personnel Only</div>;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFF] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-8">
                {/* Header Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-[#001E80] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                                    {user.role === 'studentLead' ? 'Student Lead' : 'Expert Mentor'} Console
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">v1.0 Activated</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#010D3E] uppercase leading-none" style={{ fontFamily: 'Zuume-Bold' }}>
                                Command Centre
                            </h1>
                            <p className="text-gray-400 font-medium mt-4 max-w-lg">
                                Welcome back, {user.name}. Your tactical overview for {user.role === 'studentLead' ? `Level ${user.academicLevel || 'N/A'}` : 'Global Mentorship'} is ready.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 min-w-[160px]">
                                <div className="text-[10px] font-black text-[#001E80] uppercase tracking-widest mb-2">Authority Status</div>
                                <div className="text-2xl font-black text-[#010D3E] uppercase flex items-center gap-2">
                                    <FaShieldAlt className="text-green-500" /> ACTIVE
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Official Channels */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-blue-900/5">
                            <h3 className="text-2xl font-black text-[#010D3E] uppercase mb-8 flex items-center gap-3" style={{ fontFamily: 'Zuume-Bold' }}>
                                <FaRocket className="text-[#001E80]" /> Team Channels
                            </h3>

                            <p className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Tactical units for secure coordination</p>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="rounded-full bg-gray-100 h-12 w-12"></div>
                                        <div className="flex-1 space-y-4 py-1">
                                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                ) : eliteGroups.length > 0 ? (
                                    eliteGroups.map(group => (
                                        <Link
                                            key={group._id}
                                            to={`/chat?u=${group._id}&type=group`}
                                            className="group flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-[#001E80]/20 hover:bg-white hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-[#001E80] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                                    <FaUsers />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-[#010D3E] uppercase tracking-tight">{group.name}</div>
                                                    <div className="text-xs font-bold text-[#001E80] uppercase tracking-widest mt-1">Personnel Only</div>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#001E80] shadow-sm border border-gray-100 group-hover:translate-x-2 transition-transform">
                                                <FaComments />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-gray-100 rounded-3xl">
                                        Initializing Core Networks...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar: Lead Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-blue-900/5">
                            <h3 className="text-xl font-black text-[#010D3E] uppercase mb-6 flex items-center gap-3" style={{ fontFamily: 'Zuume-Bold' }}>
                                <FaBullhorn className="text-orange-500" /> Lead Actions
                            </h3>
                            <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed mb-8">
                                Use the Chat interface to send group broadcasts. Announcements made there are highlighted to all level personnel.
                            </p>
                            <Link
                                to="/chat"
                                className="w-full py-4 rounded-xl bg-[#001E80] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <FaComments /> Open Comms Dashboard
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-[#010D3E] to-[#001E80] rounded-[2.5rem] p-10 text-white shadow-2xl">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white text-xl mb-6">
                                <FaGraduationCap />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-4" style={{ fontFamily: 'Zuume-Bold' }}>Protocol Guides</h3>
                            <p className="text-xs text-blue-200 font-medium leading-relaxed mb-6">
                                View official documentation on lead management and coordination.
                            </p>
                            <button
                                onClick={() => toast.info('Lead Protocols coming soon.')}
                                className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/30 pb-1 hover:text-blue-300 transition-colors"
                            >
                                View Lead Guidelines
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default LeadConsole;
