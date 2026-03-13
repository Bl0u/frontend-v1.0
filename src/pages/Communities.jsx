import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { FaHashtag, FaUsers, FaArrowRight, FaSearch, FaUniversity, FaGraduationCap, FaLayerGroup } from 'react-icons/fa';
import JoinGroupModal from '../components/JoinGroupModal';

const Communities = () => {
    const { user } = useContext(AuthContext);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchCommunities();
        }
    }, [user?.token]);

    const fetchCommunities = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/communities`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCommunities(res.data);
        } catch (error) {
            console.error('Error fetching communities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClick = (group) => {
        setSelectedGroup(group);
        setIsJoinModalOpen(true);
    };

    const filteredCommunities = communities.map(comm => ({
        ...comm,
        groups: comm.groups?.filter(g =>
            g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.groupType.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(comm => comm.groups?.length > 0 || comm.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest animate-pulse">Scanning Channels...</h3>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                            <FaHashtag size={20} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#010D3E] tracking-tight">Communities</h1>
                    </div>
                    <p className="text-[#010D3E]/50 font-medium max-w-xl">Join official peer networks verified by LearnCrew. Gain access to exclusive group chats, resources, and expert moderators.</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search groups or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Communities Grid */}
            <div className="space-y-16">
                {filteredCommunities.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <FaHashtag size={48} className="mx-auto text-gray-200 mb-6" />
                        <h3 className="text-xl font-bold text-gray-400">No communities found matching your search.</h3>
                        <p className="text-gray-300 mt-2">Try different keywords or check back later for new hubs.</p>
                    </div>
                ) : (
                    filteredCommunities.map((comm) => (
                        <div key={comm._id} className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[2rem] bg-[#EAEEFE] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                            <img src={comm.avatar || 'https://via.placeholder.com/150'} alt={comm.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-wider">
                                            Official
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-800 mb-1">{comm.name}</h2>
                                        <p className="text-sm text-gray-400 font-medium max-w-md">{comm.description}</p>
                                    </div>
                                </div>
                                <div className="hidden lg:flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs font-black uppercase tracking-widest text-[#001E80]/40 mb-1">Available Groups</div>
                                        <div className="text-2xl font-black text-indigo-600">{comm.groups?.length || 0}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {comm.groups?.map((group) => (
                                    <div
                                        key={group._id}
                                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500 opacity-50" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-16 h-16 rounded-2xl bg-[#EAEEFE]/50 p-1 border border-white shadow-md flex items-center justify-center overflow-hidden">
                                                    <img src={group.avatar || 'https://via.placeholder.com/150'} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                                                </div>
                                                <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-gray-50">
                                                    <FaUsers /> {group.members?.length || 0} Members
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">{group.name}</h3>

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/50 flex items-center gap-1">
                                                    {group.groupType === 'University' ? <FaUniversity /> : group.groupType === 'School' ? <FaGraduationCap /> : <FaLayerGroup />}
                                                    {group.groupType}
                                                </span>
                                                {group.metadata?.academicLevel && (
                                                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100/50">
                                                        {group.metadata.academicLevel}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-gray-50">
                                                <button
                                                    onClick={() => handleJoinClick(group)}
                                                    className="w-full flex items-center justify-between bg-white hover:bg-indigo-600 border border-indigo-600 text-indigo-600 hover:text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-xl hover:shadow-indigo-100 active:scale-95 group/btn"
                                                >
                                                    Join This Group
                                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <JoinGroupModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                group={selectedGroup}
                user={user}
            />
        </div>
    );
};

export default Communities;
