import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHashtag, FaPlus, FaSearch, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const PromoteLeadGroupsModal = ({ isOpen, onClose, userId, username, userToken }) => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCommunities();
        }
    }, [isOpen]);

    const fetchCommunities = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/communities`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setCommunities(res.data);
        } catch (error) {
            toast.error('Failed to fetch communities');
        } finally {
            setLoading(false);
        }
    };

    const toggleGroup = (groupId) => {
        if (selectedGroups.includes(groupId)) {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        } else {
            setSelectedGroups([...selectedGroups, groupId]);
        }
    };

    const handleConfirm = async () => {
        if (selectedGroups.length === 0) {
            onClose();
            return;
        }

        setSubmitting(true);
        try {
            await Promise.all(selectedGroups.map(groupId =>
                axios.put(`${API_BASE_URL}/api/admin/groups/${groupId}/moderators`, { userId }, {
                    headers: { Authorization: `Bearer ${userToken}` }
                })
            ));
            toast.success(`Successfully assigned lead to ${selectedGroups.length} groups!`);
            onClose();
        } catch (error) {
            toast.error('Failed to assign some groups');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const allGroups = communities.flatMap(c => c.groups || []).filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.groupType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#010D3E]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                {/* Header */}
                <div className="p-10 border-b border-gray-100 bg-[#EAEEFE]/30 relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
                            <FaUsers size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">Assign Community Groups</h3>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Select groups for <span className="text-[#001E80] font-black">@{username}</span> to moderate as a Lead.</p>
                    <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white rounded-full transition-all text-gray-400">
                        <FaTimes />
                    </button>
                </div>

                {/* Search */}
                <div className="px-10 py-6 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search groups by faculty or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-gray-600 text-sm"
                        />
                    </div>
                    <div className="flex items-center px-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{selectedGroups.length} Selected</span>
                    </div>
                </div>

                {/* Groups List */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Loading Groups...</p>
                        </div>
                    ) : allGroups.length === 0 ? (
                        <div className="text-center py-12 italic text-gray-400 font-medium">No community groups found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allGroups.map(group => (
                                <div
                                    key={group._id}
                                    onClick={() => toggleGroup(group._id)}
                                    className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group-card ${selectedGroups.includes(group._id)
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100'
                                        : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-[1.25rem] overflow-hidden border-2 ${selectedGroups.includes(group._id) ? 'border-white/30' : 'border-white'} shadow-sm`}>
                                            <img src={group.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black truncate max-w-[150px]">{group.name}</h4>
                                            <div className={`text-[9px] font-black uppercase tracking-widest ${selectedGroups.includes(group._id) ? 'text-white/70' : 'text-indigo-400'}`}>{group.groupType}</div>
                                        </div>
                                    </div>
                                    {selectedGroups.includes(group._id) ? (
                                        <div className="bg-white text-indigo-600 p-2 rounded-full shadow-lg animate-in zoom-in">
                                            <FaCheck size={10} />
                                        </div>
                                    ) : (
                                        <FaPlus size={10} className="text-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-5 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Skip for Now
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? 'Assigning...' : `Confirm & Assign Lead`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoteLeadGroupsModal;
