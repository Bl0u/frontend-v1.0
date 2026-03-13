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

const communityService = {
    getCommunities,
    getCommunity,
    requestJoin
};

export default communityService;
