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

    const handleJoinRequest = async (communityId, circleId = null) => {
        if (!user) {
            toast.warning('Please login to join');
            return;
        }
        try {
            const data = await communityService.requestJoin(communityId, circleId, user.token);

            if (data.status === 'joined') {
                toast.success('Joined instantly! 🚀');
                // Refresh to show "Enter Chat"
                if (selectedCommunity) {
                    handleSelectCommunity(selectedCommunity.community);
                } else {
                    const updated = await communityService.getCommunities();
                    setCommunities(updated);
                }
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
                const isMember = c.members?.includes(user?._id);
                const hasModAccess = isModerator(c);

                return (
                    <div key={c._id} className="community-card" onClick={() => handleSelectCommunity(c)}>
                        <div className="community-banner">
                            <img src={c.avatar || 'https://via.placeholder.com/400x120'} alt={c.name} />
                            {c.privacyType === 'private' && (
                                <div className="privacy-badge private">Private</div>
                            )}
                            {hasModAccess && (
                                <div className="mod-badge">
                                    <FaShieldAlt /> Moderator
                                </div>
                            )}
                        </div>
                        <div className="community-content">
                            <h3>{c.name}</h3>
                            <p>{c.description || 'No description provided.'}</p>
                            <div className="community-footer">
                                <span className="members-count">{c.members?.length || 0} Members</span>
                                <div className="flex gap-2">
                                    {hasModAccess && (
                                        <button 
                                            className="manage-btn-icon" 
                                            onClick={(e) => { e.stopPropagation(); handleOpenManageMembers(c._id, 'community', c.name); }}
                                            title="Manage Community Members"
                                        >
                                            <FaUsers />
                                        </button>
                                    )}
                                    {isMember ? (
                                        <button className="view-btn">Explore Circles</button>
                                    ) : (
                                        <button 
                                            className={c.privacyType === 'public' ? "join-hub-btn" : "request-hub-btn"}
                                            onClick={(e) => { e.stopPropagation(); handleJoinRequest(c._id); }}
                                        >
                                            {c.privacyType === 'public' ? 'Join Hub' : 'Request Access'}
                                        </button>
                                    )}
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
                <div className="explorer-header">
                    <button className="back-btn" onClick={() => setSelectedCommunity(null)}>← Back to Hub</button>
                    <div className="community-header-main">
                        <div className="community-profile">
                            <img src={selectedCommunity.community.avatar || 'https://via.placeholder.com/80'} alt="" />
                            <div>
                                <h2>{selectedCommunity.community.name}</h2>
                                <p>{selectedCommunity.community.description}</p>
                            </div>
                        </div>
                        {hasCommModAccess && (
                            <div className="header-actions">
                                <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
                                    <FaPlus /> Create Circle
                                </button>
                                <button className="manage-header-btn" onClick={() => handleOpenManageMembers(selectedCommunity.community._id, 'community', selectedCommunity.community.name)}>
                                    <FaUserShield /> Community Mods
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="circles-section">
                    <div className="section-title">
                        <h3>Available Circles</h3>
                        <p>Each circle is a dedicated space for specific discussions, projects, or interests.</p>
                    </div>

                    <div className="circle-grid">
                        {selectedCommunity.circles.map((circle) => {
                            const isMember = circle.members?.includes(user?._id);
                            const isPrivate = circle.privacyType === 'private';
                            const hasCircleModAccess = isModerator(circle);

                            return (
                                <div key={circle._id} className="circle-card">
                                    <div className="circle-info">
                                        <div className="circle-avatar">{circle.name?.charAt(0)}</div>
                                        <div>
                                            <h4>{circle.name}</h4>
                                            <p>{circle.description || 'Explore this circle'}</p>
                                        </div>
                                    </div>
                                    <div className="circle-meta">
                                        <span className="circle-member-count">{circle.members?.length || 0} members</span>
                                        {isPrivate && <span className="circle-privacy-tag">🔒 Private</span>}
                                    </div>
                                    <div className="circle-actions">
                                        {hasCircleModAccess && (
                                            <div className="circle-mod-actions">
                                                <button className="mod-action-btn" onClick={() => handleOpenManageMembers(circle._id, 'group', circle.name)} title="Manage Members">
                                                    <FaUsers />
                                                </button>
                                                <button className="mod-action-btn delete" onClick={() => handleDeleteCircle(circle._id)} title="Delete Circle">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                        {isMember ? (
                                            <button className="joined-btn" onClick={() => navigate(`/chat?u=${circle._id}&type=group`)}>Enter Chat</button>
                                        ) : (
                                            <button 
                                                className={isPrivate ? "request-btn" : "join-btn"} 
                                                onClick={() => handleJoinRequest(null, circle._id)}
                                            >
                                                {isPrivate ? 'Request Access' : 'Join Instantly'}
                                            </button>
                                        )}
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
        <div className="community-hub-page">
            <div className="hub-content">
                <div className="hub-hero">
                    <h1>Academic Communities</h1>
                    <p>Join your institution and connect with peers in specialized circles.</p>
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
                            {members.length > 0 ? members.map((m) => {
                                const isBanned = false; // Need to check against bannedUsers if populated
                                return (
                                    <div key={m._id} className="member-manage-card">
                                        <div className="member-info-hub">
                                            <img src={m.avatar || 'https://via.placeholder.com/40'} alt="" />
                                            <div>
                                                <p className="name">{m.name}</p>
                                                <p className="username">@{m.username}</p>
                                            </div>
                                        </div>
                                        <div className="member-actions-hub">
                                            <button 
                                                className={`ban-btn-hub ${isBanned ? 'banned' : ''}`}
                                                onClick={() => handleToggleBan(m._id)}
                                            >
                                                <FaBan /> {isBanned ? 'Unban' : 'Ban'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="empty-msg">No members found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityHub;
