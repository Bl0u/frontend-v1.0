import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/communities/`;

// Get all communities
const getCommunities = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Get single community with circles
const getCommunity = async (communityId) => {
    const response = await axios.get(API_URL + communityId);
    return response.data;
};

// Join Request (Community or Circle)
const requestJoin = async (communityId, circleId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const payload = {
        type: 'community_join',
        community: communityId,
        groupChat: circleId
    };

    const response = await axios.post(`${API_BASE_URL}/api/requests`, payload, config);
    return response.data;
};

// Create a group (Decentralized)
const createCircle = async (communityId, groupData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(`${API_BASE_URL}/api/communities/${communityId}/groups`, groupData, config);
    return response.data;
};

// Delete a group (Decentralized)
const deleteCircle = async (groupId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_BASE_URL}/api/communities/groups/${groupId}`, config);
    return response.data;
};

// Get members for management
const getMembers = async (id, type, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_BASE_URL}/api/communities/${id}/members?type=${type}`, config);
    return response.data;
};

// Toggle ban
const toggleBan = async (id, type, userId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_BASE_URL}/api/communities/${id}/ban`, { type, userId }, config);
    return response.data;
};

// Get joined communities/groups
const getJoinedContent = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_BASE_URL}/api/communities/joined`, config);
    return response.data;
};

// Get moderated communities/groups
const getModeratedContent = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_BASE_URL}/api/communities/moderated`, config);
    return response.data;
};

const communityService = {
    getCommunities,
    getCommunity,
    requestJoin,
    createCircle,
    deleteCircle,
    getMembers,
    toggleBan,
    getModeratedContent,
    getJoinedContent
};

export default communityService;
