import { useState, useEffect } from 'react';
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
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    <button onClick={() => setEditingConfig(config)} className="text-gray-300 hover:text-indigo-600"><FaEdit /></button>
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
        </div>
    );
};

export default AdminCommunities;

const FaTimes = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>;
