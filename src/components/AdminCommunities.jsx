import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaSave, FaUsers, FaLayerGroup, FaHashtag, FaGlobe, FaCogs } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const AdminCommunities = ({ user }) => {
    const [communities, setCommunities] = useState([]);
    const [groupConfigs, setGroupConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('communities'); // 'communities' or 'configs'

    // Form states
    const [isCreateCommOpen, setIsCreateCommOpen] = useState(false);
    const [commForm, setCommForm] = useState({ name: '', description: '', avatar: '' });

    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [selectedCommId, setSelectedCommId] = useState(null);
    const [groupForm, setGroupForm] = useState({ name: '', description: '', groupType: '', metadata: {}, avatar: '' });

    const [editingConfig, setEditingConfig] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'community'|'group', id, groupId?, name }
    const [requestModal, setRequestModal] = useState(null); // { type: 'community'|'group', id, name }
    const [modModal, setModModal] = useState(null); // { type: 'community'|'group', id, name, moderators: [] }
    const [pendingRequests, setPendingRequests] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [userSearchText, setUserSearchText] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchData();
        }
    }, [user?.token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [commRes, configRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/communities`, { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get(`${API_BASE_URL}/api/admin/group-configs`, { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setCommunities(commRes.data);
            setGroupConfigs(configRes.data);
        } catch (error) {
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCommunity = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/admin/communities`, commForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Community created!');
            setIsCreateCommOpen(false);
            setCommForm({ name: '', description: '', avatar: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to create community');
        }
    };

    const handleAddGroup = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/admin/communities/${selectedCommId}/groups`, groupForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Group added to community!');
            setIsCreateGroupOpen(false);
            setGroupForm({ name: '', description: '', groupType: '', metadata: {}, avatar: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to add group');
        }
    };

    const handleSaveConfig = async (config) => {
        try {
            await axios.post(`${API_BASE_URL}/api/admin/group-configs`, config, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Group configuration updated!');
            setEditingConfig(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to update config');
        }
    };

    const handleDeleteConfig = async (configId) => {
        if (!window.confirm('Are you sure you want to delete this group type?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/group-configs/${configId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Group type deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete group type');
        }
    };

    const handleDeleteCommunity = async (commId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/communities/${commId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Community deleted successfully');
            setDeleteConfirm(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to delete community');
        }
    };

    const handleDeleteGroup = async (commId, groupId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/communities/${commId}/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Group removed successfully');
            setDeleteConfirm(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to remove group');
        }
    };

    const openRequestModal = async (type, id, name) => {
        setRequestModal({ type, id, name });
        setRequestLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/requests/received`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Filter requests for this specific community or group
            const filtered = data.filter(req => 
                req.status === 'pending' && 
                (type === 'community' ? req.community === id : req.groupChat?._id === id)
            );
            setPendingRequests(filtered);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setRequestLoading(false);
        }
    };

    const handleRespond = async (requestId, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/requests/${requestId}/respond`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success(`Request ${status}`);
            // Update local state
            setPendingRequests(prev => prev.filter(r => r._id !== requestId));
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleSearchUsers = async (query) => {
        setUserSearchText(query);
        if (query.trim().length < 2) {
            setSearchedUsers([]);
            return;
        }
        setSearchLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/users?search=${query}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSearchedUsers(data.users || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAssignMod = async (userId) => {
        try {
            const endpoint = modModal.type === 'community' 
                ? `/api/admin/communities/${modModal.id}/moderators`
                : `/api/admin/groups/${modModal.id}/moderators`;
            
            await axios.put(`${API_BASE_URL}${endpoint}`, { userId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            toast.success('Moderator assigned');
            // Optimistic update or refresh
            fetchData();
            setModModal(null);
            setUserSearchText('');
            setSearchedUsers([]);
        } catch (error) {
            toast.error('Failed to assign moderator');
        }
    };

    const handleAssignByUsername = async () => {
        if (!userSearchText.trim()) return;
        setSearchLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/users?search=${userSearchText}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            // Try to find exact username match
            const target = data.users.find(u => u.username.toLowerCase() === userSearchText.toLowerCase()) || data.users[0];
            
            if (target) {
                handleAssignMod(target._id);
            } else {
                toast.error('User not found. Try searching first.');
            }
        } catch (error) {
            toast.error('Error finding user');
        } finally {
            setSearchLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center italic text-gray-400 font-bold uppercase tracking-widest animate-pulse">Initializing Hubs...</div>;

    return (
        <div className="space-y-8 p-4">
            {/* Nav */}
            <div className="flex gap-4 border-b border-gray-100 pb-4">
                <button
                    onClick={() => setActiveView('communities')}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'communities' ? 'bg-[#001E80] text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-400 hover:text-indigo-600'}`}
                >
                    <FaGlobe className="inline mr-2" /> Hubs & Groups
                </button>
                <button
                    onClick={() => setActiveView('configs')}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'configs' ? 'bg-[#001E80] text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-400 hover:text-indigo-600'}`}
                >
                    <FaCogs className="inline mr-2" /> Dynamic Group Types
                </button>
            </div>

            {activeView === 'communities' ? (
                <div className="space-y-8">
                    {/* Communities List */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Active Communities</h2>
                        <button
                            onClick={() => setIsCreateCommOpen(true)}
                            className="bg-[#001E80] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <FaPlus /> New Hub
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {communities.map(comm => (
                            <div key={comm._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#EAEEFE] overflow-hidden border border-white shadow-md">
                                            <img src={comm.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-[#010D3E]">{comm.name}</h3>
                                            <p className="text-sm text-gray-400 font-medium">{comm.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setModModal({ type: 'community', id: comm._id, name: comm.name, moderators: comm.moderators })}
                                            className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            Moderators
                                        </button>
                                        <button
                                            onClick={() => openRequestModal('community', comm._id, comm.name)}
                                            className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            <FaUsers /> Requests
                                        </button>
                                        <button
                                            onClick={() => navigate(`/chat?u=${comm._id}&type=group`)}
                                            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            Enter Chat
                                        </button>
                                        <button
                                            onClick={() => { setSelectedCommId(comm._id); setIsCreateGroupOpen(true); }}
                                            className="bg-indigo-50 text-indigo-600 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ type: 'community', id: comm._id, name: comm.name })}
                                            className="bg-red-50 text-red-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Delete Community"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-50 pb-2">Nested Groups ({comm.groups?.length || 0})</div>
                                    {comm.groups?.map(g => (
                                        <div key={g._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm">
                                                    <img src={g.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-700">{g.name}</div>
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{g.groupType}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 transition-opacity">
                                                <button
                                                    onClick={() => setModModal({ type: 'group', id: g._id, name: g.name, moderators: g.moderators })}
                                                    className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
                                                >
                                                    Mods
                                                </button>
                                                <button
                                                    onClick={() => openRequestModal('group', g._id, g.name)}
                                                    className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    Requests
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/chat?u=${g._id}&type=group`)}
                                                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    Chat
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'group', id: comm._id, groupId: g._id, name: g.name })}
                                                    className="p-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!comm.groups || comm.groups.length === 0) && (
                                        <div className="text-center py-4 text-xs italic text-gray-300 font-medium">No groups added yet.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Configs List */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Dynamic Group Configurations</h2>
                        <button
                            onClick={() => setEditingConfig({ groupType: '', metadataRequirements: {}, questions: [] })}
                            className="bg-[#001E80] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                            <FaPlus /> New Group Type
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {groupConfigs.map(config => (
                            <div key={config._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                            <FaLayerGroup />
                                        </div>
                                        <div className="text-lg font-black text-gray-800">{config.groupType}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setEditingConfig(config)} className="text-gray-300 hover:text-indigo-600"><FaEdit /></button>
                                        <button onClick={() => handleDeleteConfig(config._id)} className="text-gray-300 hover:text-red-500"><FaTrash size={12} /></button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(config.metadataRequirements).map(([key, value]) => value && (
                                            <span key={key} className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">
                                                {key.replace('require', '')}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {config.questions?.length || 0} Join Questions
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Config Editor Modal */}
            {editingConfig && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-800 uppercase">Edit Group Type: {editingConfig.groupType || 'New'}</h3>
                            <button onClick={() => setEditingConfig(null)} className="text-gray-400"><FaTimes /></button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Type Name (e.g. University)</label>
                                <input
                                    type="text"
                                    value={editingConfig.groupType}
                                    onChange={e => setEditingConfig({ ...editingConfig, groupType: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600">Metadata Requirements</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['requireUniversity', 'requireCollege', 'requireLevel', 'requireGrade', 'requireInstitution'].map(key => (
                                        <label key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={editingConfig.metadataRequirements[key] || false}
                                                onChange={e => setEditingConfig({
                                                    ...editingConfig,
                                                    metadataRequirements: { ...editingConfig.metadataRequirements, [key]: e.target.checked }
                                                })}
                                                className="w-5 h-5 rounded-lg border-gray-200 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <span className="text-xs font-bold text-gray-700 capitalize">{key.replace('require', '')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Join Questions</label>
                                    <button
                                        onClick={() => setEditingConfig({
                                            ...editingConfig,
                                            questions: [...(editingConfig.questions || []), { id: Date.now().toString(), label: '', type: 'text', required: true, options: [] }]
                                        })}
                                        className="text-[10px] font-black text-indigo-600 uppercase border-b-2 border-indigo-100 hover:border-indigo-600 transition-all"
                                    >
                                        + Add Question
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {editingConfig.questions?.map((q, idx) => (
                                        <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                                            <button
                                                onClick={() => {
                                                    const newQs = [...editingConfig.questions];
                                                    newQs.splice(idx, 1);
                                                    setEditingConfig({ ...editingConfig, questions: newQs });
                                                }}
                                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Label</label>
                                                    <input
                                                        type="text"
                                                        value={q.label}
                                                        onChange={e => {
                                                            const newQs = [...editingConfig.questions];
                                                            newQs[idx].label = e.target.value;
                                                            setEditingConfig({ ...editingConfig, questions: newQs });
                                                        }}
                                                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Type</label>
                                                    <select
                                                        value={q.type}
                                                        onChange={e => {
                                                            const newQs = [...editingConfig.questions];
                                                            newQs[idx].type = e.target.value;
                                                            setEditingConfig({ ...editingConfig, questions: newQs });
                                                        }}
                                                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold"
                                                    >
                                                        <option value="text">Text Response</option>
                                                        <option value="radio">Selection (Radio)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 flex gap-4">
                            <button onClick={() => setEditingConfig(null)} className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">Cancel</button>
                            <button onClick={() => handleSaveConfig(editingConfig)} className="flex-[2] bg-[#001E80] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Save Configuration</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Community Modal */}
            {isCreateCommOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Create New Hub</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Community Name"
                                value={commForm.name}
                                onChange={e => setCommForm({ ...commForm, name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium"
                            />
                            <textarea
                                placeholder="Description"
                                value={commForm.description}
                                onChange={e => setCommForm({ ...commForm, description: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium h-32"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsCreateCommOpen(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px]">Cancel</button>
                            <button onClick={handleCreateCommunity} className="flex-[2] bg-[#001E80] text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg">Create Community</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {isCreateGroupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Add Group to Community</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Group Name"
                                value={groupForm.name}
                                onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium"
                            />
                            <select
                                value={groupForm.groupType}
                                onChange={e => setGroupForm({ ...groupForm, groupType: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-gray-700"
                            >
                                <option value="">Select Group Type</option>
                                {groupConfigs.map(c => <option key={c._id} value={c.groupType}>{c.groupType}</option>)}
                            </select>

                            <select
                                value={groupForm.privacyType || 'public'}
                                onChange={e => setGroupForm({ ...groupForm, privacyType: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-gray-700"
                            >
                                <option value="public">Public (Auto-Join)</option>
                                <option value="private">Private (Request Required)</option>
                            </select>

                            {/* Metadata Inputs based on type */}
                            {groupForm.groupType && (
                                <div className="space-y-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <div className="text-[9px] font-black uppercase text-indigo-400 mb-2">Metadata Details</div>
                                    <input
                                        type="text"
                                        placeholder="University Name"
                                        onChange={e => setGroupForm({ ...groupForm, metadata: { ...groupForm.metadata, university: e.target.value } })}
                                        className="w-full px-4 py-2 bg-white rounded-xl text-xs font-bold outline-none border border-white focus:border-indigo-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="College (Optional)"
                                        onChange={e => setGroupForm({ ...groupForm, metadata: { ...groupForm.metadata, college: e.target.value } })}
                                        className="w-full px-4 py-2 bg-white rounded-xl text-xs font-bold outline-none border border-white focus:border-indigo-300"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsCreateGroupOpen(false)} className="flex-1 text-gray-400 font-black uppercase text-[10px]">Cancel</button>
                            <button onClick={handleAddGroup} className="flex-[2] bg-[#001E80] text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg">Publish Group</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-red-600 uppercase tracking-tight">Confirm Delete</h3>
                        <p className="text-gray-600 font-medium">
                            Are you sure you want to permanently delete {deleteConfirm.type === 'community' ? 'community' : 'group'}{' '}
                            <strong className="text-gray-900">{deleteConfirm.name}</strong>?
                            {deleteConfirm.type === 'community' && ' This will also delete all nested groups and their messages.'}
                            {' '}This action cannot be undone.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-gray-400 font-black uppercase text-[10px] py-4 bg-gray-50 rounded-2xl">Cancel</button>
                            <button
                                onClick={() => {
                                    if (deleteConfirm.type === 'community') {
                                        handleDeleteCommunity(deleteConfirm.id);
                                    } else {
                                        handleDeleteGroup(deleteConfirm.id, deleteConfirm.groupId);
                                    }
                                }}
                                className="flex-[2] bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Request Manager Modal */}
            {requestModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Join Requests</h3>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{requestModal.name}</p>
                            </div>
                            <button onClick={() => setRequestModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {requestLoading ? (
                                <div className="py-12 text-center text-gray-400 text-xs font-black uppercase animate-pulse">Scanning Applications...</div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="text-indigo-100 mb-4"><FaUsers size={48} className="mx-auto" /></div>
                                    <p className="text-gray-400 text-xs font-bold uppercase">No pending requests for this {requestModal.type}</p>
                                </div>
                            ) : (
                                pendingRequests.map(req => (
                                    <div key={req._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <img src={req.sender?.profilePicture || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full bg-indigo-100" />
                                            <div>
                                                <div className="text-sm font-black text-gray-800">{req.sender?.name}</div>
                                                <div className="text-[9px] font-bold text-gray-400">@{req.sender?.username}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Link 
                                                to={`/profile/${req.sender?._id}`} 
                                                className="px-4 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase rounded-xl border border-gray-100 hover:border-indigo-600 transition-all"
                                                target="_blank"
                                            >
                                                Profile
                                            </Link>
                                            <button 
                                                onClick={() => handleRespond(req._id, 'rejected')}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Reject"
                                            >
                                                <FaTimes />
                                            </button>
                                            <button 
                                                onClick={() => handleRespond(req._id, 'accepted')}
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Moderator Manager Modal */}
            {modModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-top-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-purple-600 uppercase tracking-tight">Assign Moderator</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adding to {modModal.name}</p>
                            </div>
                            <button onClick={() => { setModModal(null); setSearchedUsers([]); setUserSearchText(''); }} className="p-2 hover:bg-gray-100 rounded-full"><FaTimes /></button>
                        </div>

                        <div className="space-y-4">
                            {/* Current Moderators List */}
                            {modModal.moderators?.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Moderators</div>
                                    <div className="flex flex-wrap gap-2 px-2">
                                        {modModal.moderators.map(mod => (
                                            <div key={mod._id} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-purple-100 flex items-center gap-2">
                                                <span>{mod.name} (@{mod.username})</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-px bg-gray-100 my-4" />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search or type exact username..."
                                        value={userSearchText}
                                        onChange={(e) => handleSearchUsers(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAssignByUsername()}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 font-medium text-sm"
                                    />
                                    {searchLoading && <div className="absolute right-4 top-4 animate-spin text-purple-400">◌</div>}
                                </div>
                                <button
                                    onClick={handleAssignByUsername}
                                    className="bg-purple-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center min-w-[100px]"
                                    disabled={searchLoading}
                                >
                                    {searchLoading ? '...' : 'Assign'}
                                </button>
                            </div>

                            <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {searchedUsers.length > 0 ? (
                                    searchedUsers.map(u => (
                                        <div key={u._id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between group hover:bg-purple-50 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">
                                                    {u.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-gray-800">{u.name}</div>
                                                    <div className="text-[9px] font-bold text-gray-400">@{u.username}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleAssignMod(u._id)}
                                                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))
                                ) : userSearchText.length > 1 ? (
                                    <div className="text-center py-8 text-gray-400 text-[10px] font-black uppercase">No users found</div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-[10px] font-black uppercase italic">Type to search for users</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCommunities;

const FaTimes = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>;
