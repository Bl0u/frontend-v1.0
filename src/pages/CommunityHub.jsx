import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import communityService from '../features/communities/communityService';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaPlus, FaUsers, FaTrash, FaBan, FaUserShield, FaChevronRight } from 'react-icons/fa';
import '../styles/CommunityHub.css';

const CommunityHub = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    // Management State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [manageTarget, setManageTarget] = useState(null); // { id, type, name }
    const [members, setMembers] = useState([]);
    const [newCircleData, setNewCircleData] = useState({ name: '', description: '', privacyType: 'public' });

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const data = await communityService.getCommunities();
                setCommunities(data);
            } catch (error) {
                toast.error('Failed to load communities');
            } finally {
                setLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    const handleSelectCommunity = async (community) => {
        setLoading(true);
        try {
            const data = await communityService.getCommunity(community._id);
            setSelectedCommunity(data);
        } catch (error) {
            toast.error('Failed to load community details');
        } finally {
            setLoading(false);
        }
    };

    const isModerator = (target) => {
        if (!user || !target) return false;
        if (user.roles?.includes('admin')) return true;
        
        // Target can be community or circle/group
        const isMod = target.moderators?.includes(user._id) || target.creator === user._id;
        return isMod;
    };

    const handleOpenManageMembers = async (id, type, name) => {
        setManageTarget({ id, type, name });
        try {
            const data = await communityService.getMembers(id, type, user.token);
            setMembers(data);
            setShowManageModal(true);
        } catch (error) {
            toast.error('Failed to load members');
        }
    };

    const handleToggleBan = async (userId) => {
        if (!window.confirm('Are you sure you want to toggle ban status for this user?')) return;
        try {
            await communityService.toggleBan(manageTarget.id, manageTarget.type, userId, user.token);
            toast.success('Ban status updated');
            // Refresh members
            const data = await communityService.getMembers(manageTarget.id, manageTarget.type, user.token);
            setMembers(data);
        } catch (error) {
            toast.error('Failed to update ban status');
        }
    };

    const handleCreateCircle = async (e) => {
        e.preventDefault();
        try {
            await communityService.createCircle(selectedCommunity.community._id, newCircleData, user.token);
            toast.success('Circle created! 🎨');
            setShowCreateModal(false);
            setNewCircleData({ name: '', description: '', privacyType: 'public' });
            // Refresh
            handleSelectCommunity(selectedCommunity.community);
        } catch (error) {
            toast.error('Failed to create circle');
        }
    };

    const handleDeleteCircle = async (groupId) => {
        if (!window.confirm('Delete this circle and all its messages permanently?')) return;
        try {
            await communityService.deleteCircle(groupId, user.token);
            toast.success('Circle deleted');
            handleSelectCommunity(selectedCommunity.community);
        } catch (error) {
            toast.error('Failed to delete circle');
        }
    };

    const handleJoinRequest = async (circleId) => {
        if (!user) {
            toast.warning('Please login to join');
            return;
        }
        try {
            // New logic only applies to circles
            const data = await communityService.requestJoin(selectedCommunity.community._id, circleId, user.token);

            if (data.status === 'joined') {
                toast.success('Joined instantly! 🚀');
                handleSelectCommunity(selectedCommunity.community);
            } else {
                toast.success('Join request sent! ⏳');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const renderCommunityList = () => (
        <div className="community-grid">
            {communities.map((c) => {
                const hasModAccess = isModerator(c);

                return (
                    <div key={c._id} className="community-card" onClick={() => handleSelectCommunity(c)}>
                        <div className="community-content">
                            <div className="community-card-header">
                                <h3>{c.name}</h3>
                                {hasModAccess && (
                                    <div className="mod-badge">
                                        <FaShieldAlt /> Mod
                                    </div>
                                )}
                            </div>
                            <p>{c.description || 'No description provided.'}</p>
                            <div className="community-footer">
                                <span className="members-count">{c.members?.length || 0} Members</span>
                                <div className="flex gap-2 items-center">
                                    {hasModAccess && (
                                        <button 
                                            className="manage-btn-icon" 
                                            onClick={(e) => { e.stopPropagation(); handleOpenManageMembers(c._id, 'community', c.name); }}
                                            title="Manage Moderators"
                                        >
                                            <FaUsers />
                                        </button>
                                    )}
                                    <button className="view-btn">Explore Hub <FaChevronRight size={10} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {communities.length === 0 && (
                <div className="empty-communities">
                    <h3>No Communities Yet</h3>
                    <p>Communities will appear here once created by an administrator.</p>
                </div>
            )}
        </div>
    );

    const renderCircleExplorer = () => {
        const hasCommModAccess = isModerator(selectedCommunity.community);

        return (
            <div className="circle-explorer animate-in">
                <div className="explorer-header-minimal">
                    <button className="back-btn-minimal" onClick={() => setSelectedCommunity(null)}>← Back to Hubs</button>
                    <div className="community-header-main-minimal">
                        <div className="community-profile-minimal">
                            <h2>{selectedCommunity.community.name}</h2>
                            <p>{selectedCommunity.community.description}</p>
                        </div>
                        {hasCommModAccess && (
                            <div className="header-actions-minimal">
                                <button className="create-group-btn-minimal" onClick={() => setShowCreateModal(true)}>
                                    <FaPlus /> New Circle
                                </button>
                                <button className="manage-header-btn-minimal" onClick={() => handleOpenManageMembers(selectedCommunity.community._id, 'community', selectedCommunity.community.name)}>
                                    <FaUserShield /> Mods
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="circles-section-minimal">
                    <div className="section-title-minimal">
                        <h3>Available Circles</h3>
                        <p>Join focused discussion spaces within this hub.</p>
                    </div>

                    <div className="circle-grid-minimal">
                        {selectedCommunity.circles.map((circle) => {
                            const isMember = circle.members?.includes(user?._id);
                            const isPrivate = circle.privacyType === 'private';
                            const hasCircleModAccess = isModerator(circle);

                            return (
                                <div key={circle._id} className="circle-card-minimal">
                                    <div className="circle-info-minimal">
                                        <div className="circle-text-minimal">
                                            <h4>{circle.name}</h4>
                                            <p>{circle.description || 'No description available.'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="circle-footer-minimal">
                                        <div className="circle-meta-minimal">
                                            <span className="circle-member-count-minimal">{circle.members?.length || 0} members</span>
                                            {isPrivate && <span className="circle-privacy-tag-minimal">Private</span>}
                                        </div>
                                        
                                        <div className="circle-actions-minimal">
                                            {hasCircleModAccess && (
                                                <div className="circle-mod-actions-minimal">
                                                    <button className="mod-action-btn-minimal" onClick={() => handleOpenManageMembers(circle._id, 'group', circle.name)} title="Manage Mod">
                                                        <FaUsers />
                                                    </button>
                                                    <button className="mod-action-btn-minimal delete" onClick={() => handleDeleteCircle(circle._id)} title="Delete Circle">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                            {isMember ? (
                                                <button className="joined-btn-minimal" onClick={() => navigate(`/chat?u=${circle._id}&type=group`)}>Enter Chat</button>
                                            ) : (
                                                <button 
                                                    className={isPrivate ? "join-btn-minimal private" : "join-btn-minimal public"} 
                                                    onClick={() => handleJoinRequest(circle._id)}
                                                >
                                                    {isPrivate ? 'Request Access' : 'Join Instantly'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {selectedCommunity.circles.length === 0 && (
                            <div className="empty-circles">
                                <p>No circles have been created for this community yet.</p>
                                {hasCommModAccess && (
                                    <button className="create-first-btn" onClick={() => setShowCreateModal(true)}>
                                        Create the first circle
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="community-hub-page-minimal">
            <div className="hub-content-minimal">
                <div className="hub-hero-minimal">
                    <h1>Hub Explorer</h1>
                </div>

                {loading ? (
                    <div className="hub-loading">
                        <div className="spinner" />
                        <p>Discovering communities...</p>
                    </div>
                ) : selectedCommunity ? (
                    renderCircleExplorer()
                ) : (
                    renderCommunityList()
                )}
            </div>

            {/* Create Circle Modal */}
            {showCreateModal && (
                <div className="hub-modal-overlay">
                    <div className="hub-modal animate-in">
                        <div className="modal-header">
                            <h2>Create New Circle</h2>
                            <button className="close-modal" onClick={() => setShowCreateModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateCircle}>
                            <div className="form-group">
                                <label>Circle Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Computer Science 2024" 
                                    required 
                                    value={newCircleData.name}
                                    onChange={(e) => setNewCircleData({...newCircleData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    placeholder="What is this circle about?" 
                                    required
                                    value={newCircleData.description}
                                    onChange={(e) => setNewCircleData({...newCircleData, description: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Privacy Type</label>
                                <select 
                                    value={newCircleData.privacyType}
                                    onChange={(e) => setNewCircleData({...newCircleData, privacyType: e.target.value})}
                                >
                                    <option value="public">Public (Anyone can join)</option>
                                    <option value="private">Private (Request required)</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-modal-btn">Create Circle</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Members Modal */}
            {showManageModal && (
                <div className="hub-modal-overlay">
                    <div className="hub-modal animate-in wide">
                        <div className="modal-header">
                            <div>
                                <h2>Manage Members</h2>
                                <p className="subtitle">{manageTarget.name} ({manageTarget.type})</p>
                            </div>
                            <button className="close-modal" onClick={() => setShowManageModal(false)}>✕</button>
                        </div>
                        <div className="member-list-manage">
                            {members.length === 0 ? (
                                <div className="empty-msg-minimal">No users found.</div>
                            ) : (
                                members.map(m => (
                                    <div key={m._id} className="member-manage-card-minimal">
                                        <div className="member-info-minimal">
                                            <div className="name">{m.name}</div>
                                            <div className="username">@{m.username}</div>
                                        </div>
                                        {m._id !== user._id && !m.roles?.includes('admin') && (
                                            <button 
                                                className={`ban-btn-minimal ${manageTarget.type === 'community' ? m.bannedUsers?.includes(manageTarget.id) : false ? 'banned' : ''}`}
                                                onClick={() => handleToggleBan(m._id)}
                                            >
                                                <FaBan />
                                                Toggle Ban
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityHub;
