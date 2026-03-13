import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import communityService from '../features/communities/communityService';
import { toast } from 'react-toastify';
import '../styles/CommunityHub.css';

const CommunityHub = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCommunity, setSelectedCommunity] = useState(null);

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

    const handleJoinRequest = async (communityId, circleId = null) => {
        if (!user) {
            toast.warning('Please login to join');
            return;
        }
        try {
            await communityService.requestJoin(communityId, circleId, user.token);
            toast.success('Join request sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const renderCommunityList = () => (
        <div className="community-grid">
            {communities.map((c) => (
                <div key={c._id} className="community-card" onClick={() => handleSelectCommunity(c)}>
                    <div className="community-banner">
                        <img src={c.avatar || 'https://via.placeholder.com/400x120'} alt={c.name} />
                        {c.privacyType === 'private' && (
                            <div className="privacy-badge private">Private</div>
                        )}
                    </div>
                    <div className="community-content">
                        <h3>{c.name}</h3>
                        <p>{c.description || 'No description provided.'}</p>
                        <div className="community-footer">
                            <span className="members-count">{c.members?.length || 0} Members</span>
                            <button className="view-btn">Explore Circles</button>
                        </div>
                    </div>
                </div>
            ))}
            {communities.length === 0 && (
                <div className="empty-communities">
                    <h3>No Communities Yet</h3>
                    <p>Communities will appear here once created by an administrator.</p>
                </div>
            )}
        </div>
    );

    const renderCircleExplorer = () => (
        <div className="circle-explorer animate-in">
            <div className="explorer-header">
                <button className="back-btn" onClick={() => setSelectedCommunity(null)}>← Back to Hub</button>
                <div className="community-profile">
                    <img src={selectedCommunity.community.avatar || 'https://via.placeholder.com/80'} alt="" />
                    <div>
                        <h2>{selectedCommunity.community.name}</h2>
                        <p>{selectedCommunity.community.description}</p>
                    </div>
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
                                    {isMember ? (
                                        <button className="joined-btn" onClick={() => navigate(`/chat?u=${circle._id}&type=group`)}>Enter Chat</button>
                                    ) : isPrivate ? (
                                        <button className="request-btn" onClick={() => handleJoinRequest(null, circle._id)}>Request Access</button>
                                    ) : (
                                        <button className="join-btn" onClick={() => handleJoinRequest(null, circle._id)}>Join Instantly</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {selectedCommunity.circles.length === 0 && (
                        <div className="empty-circles">
                            <p>No circles have been created for this community yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

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
        </div>
    );
};

export default CommunityHub;
